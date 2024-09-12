import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase} from './config/dbConnect.js';

dotenv.config({ path: "backend/config/config.env"});


//connecting database
connectDatabase();

//import all routes
import productRoutes from "./routes/product.js";

app.use("/api/v1", productRoutes);

app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
});