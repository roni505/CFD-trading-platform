import express, { json } from "express";
import { Router } from "express";
import createTrade from "./routes/create-trade";
import tradeRouter from "./routes/create-trade";

const app = express();
const PORT = 3000;
export const router = Router();

//this are the key for streams
export const CREATE_ORDER_STREAM  = "trade-stream";
export const CALLBACK_STREAM  = "callback-stream";

app.use(express.json());
app.use("/api/v1", tradeRouter );

app.listen(PORT, () => {
    console.log(`Server is listen on port: ${PORT}`);  
});