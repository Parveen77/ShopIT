import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Ypur name can not exceed 50 characters"],
    },
    email: {
        type: String, 
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
{timestamps: true}
);

//Encrypting password before saving the user
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }

    const salt =10;
    this.password = await bcrypt.hash(this.password, salt);
});

//Return JsonWebToken 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};

//Compare user password
userSchema.methods.comparePassword =async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hash and set reset password token field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
}

export default mongoose.model("User", userSchema);
