import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase} from './config/dbConnect.js';
import errorMiddleware from "./middlewares/errors.js";

//Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to Uncaught Exception");
    process.exit(1);
});

dotenv.config({ path: "backend/config/config.env"});


//connecting database
connectDatabase();

//import all routes
import productRoutes from "./routes/product.js";
app.use(express.json())

app.use("/api/v1", productRoutes);

//it uses error middleware after every route
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(() =>{
        process.exit(1);
    });
});