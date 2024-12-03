import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/users.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import {getResetPasswordTemplate} from "../utils/emailTemplates.js"
import sendEmail from "../utils/sendEmails.js"
import crypto from "crypto";
import { upload_file, delete_file } from "../utils/cloudinary.js";


//Register new user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } =req.body;

    const user = await User.create({
        name,
        email,
        password,
    });

    //const token = user.getJwtToken();

    sendToken(user, 201, res)
});

//Login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } =req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400));
    };
    //find user in database
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    };

    //Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    //const token = user.getJwtToken();
//
    //res.status(200).json({
    //    token,
    //})

    sendToken(user, 201, res);
});

//Logout user => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        });

        res.status(200).json({
            message: "Logged Out",
        })
});

//Upload user avatar => /api/v1/me/upload_avatar

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");
  
    // Remove previous avatar
    if (req?.user?.avatar?.url) {
      await delete_file(req?.user?.avatar?.public_id);
    }
  
    const user = await User.findByIdAndUpdate(req?.user?._id, {
      avatar: avatarResponse,
    });
  
    res.status(200).json({
      user,
    });
  });
  
//Forget password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    //find user in database
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email", 404));
    };

    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    //create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email:user.email,
            subject:"ShopIT password recovery",
            message,
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});

//Reset password  => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors( async (req, res, next) => {
    //Hash the URL token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user) {
        return next(new ErrorHandler("Invalid token or token has been expired", 400));
    };

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    //set the new password
    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//Get current user profile
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    //console.log(req?.user);
    const user = req?.user


    if(!user) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    } 

    res.status(200).json({
        user,
    });
});

//Reset password => /password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req?.user?._id).select("+password")
    //console.log(user);

    if(!user) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    } 

    const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordCorrect) {
        return next(new ErrorHandler("Current password is incorrect. Try again!!!", 400 ));
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
    });
});

//Update profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserDate = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req?.user?._id, newUserDate, { 
        new: true 
    });

    res.status(200).json({
        user,
    });
}); 

//Get all users -admin => api/v1/admin/users
export const getAllUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        users,
    });
});

//Get user deatils -admin => api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`No user found with this ID: ${req.params.id}`, 404));
    } 

    res.status(200).json({
        user,
    });
});

//Update user - ADMIN => /api/v1/admin/user/:id
export const updateUser = catchAsyncErrors( async (req, res, next) => {
    const newUserDate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req?.user?._id, newUserDate, { 
        new: true 
    });

    res.status(200).json({
        user,
    });
}); 

//Delete user -ADMIN => /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`No user found with this ID: ${req.params.id}`, 404));
    } 

    //remove user avatar from clodinary
    if (user?.avatar?.public_id) {
        await delete_file(user?.avatar?.public_id);
      }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    });
}); 