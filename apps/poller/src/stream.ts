import { createClient } from "redis";
import { normalizedDataType } from "./index.js";

const client = createClient();
client.connect();

async function redisStreams(data: Record<string, Array<normalizedDataType>>) {
    try {
        const id = await client.xAdd("market_data", "*", {
            data: JSON.stringify(data)
        })
        console.log(id);
    } catch (error) {
        console.error("Error before adding in redisStreams");
    }  
}

export default redisStreams;