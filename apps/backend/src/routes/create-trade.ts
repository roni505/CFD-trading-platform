import { createClient } from 'redis';
import { Router } from "express";
import { CREATE_ORDER_STREAM } from '..';
import { RedisConsumer } from '../redisConsumer';

const client = createClient();
client.connect();

const redisClass = new RedisConsumer();

const router = Router();

router.post("/trade/create", async (req, res) => {
    try {
        
        const { asset, type, qty} = req.body; 
        // if (!asset || !type || !qty) {
            //     return res.status(400).json({
                //         error: "Please add inputs"
                //     })
                // }
                // this will add the order in the same stream 
                // in which the data from poller is added
        const id = Math.random().toString();
        await client.xAdd(CREATE_ORDER_STREAM, "*", {
            message: JSON.stringify({
                kind: "create-order",
                asset,
                type,
                qty,
                id
            })
        })
        
        const redisRes = await redisClass.waitForMessage();
        res.json({
            message: "Order-added"
        });
    } catch (error) {
        console.error("This is the error", error);
        res.json({
            message: `This is the error ${error}`
        })
    }
})


export default router;