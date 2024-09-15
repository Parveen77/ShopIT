import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
    try {
        //shopIT1 is name of database
        await mongoose.connect("mongodb://localhost:27017/shopIT1");

        await Product.deleteMany();
        console.log("Products are Deleted");

        await Product.insertMany(products);
        console.log("Products are added");

        process.exit();
    }catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();