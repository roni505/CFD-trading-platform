import { WebSocket } from 'ws';
import redisStreams from './stream.js';

const BAGPACK_URL = "wss://ws.backpack.exchange/";

export interface normalizedDataType {
    asset: string,
    price: number,
    decimal: number
}

// array that will contain the updated prizes, symbol and decimal
export const updated_array: normalizedDataType[] = [];

// object for the schema that is given, will push to redis in this format
export const schemaData: Record<string, Array<normalizedDataType>> = {};

function normalizeData(price: string, asset: string) {
    const symbol = asset.split("_")[0] as string;
    if (!price.includes(".")) {
        return {asset:symbol, price: Number(price), decimal: 0}
    }
    const [whole, fraction] = price.split(".");
    const decimal = fraction ? fraction.length : 0;
    const decimalRemoved =  Number(whole + (fraction ?? ""));
    return {asset:symbol, price: decimalRemoved, decimal: decimal}
}

function poller() {
    const wss = new WebSocket(BAGPACK_URL);

    wss.on("open", () => {
        console.log("Connected to bagpack ws stream!!!");  
        // sending the req for particular symbols
        wss.send(`{"method":"SUBSCRIBE","params":["bookTicker.SOL_USDC","bookTicker.BTC_USDC","bookTicker.ETH_USDC"],"id":3}	`);
    })

    wss.on("message", (data) => {
        const rawData = JSON.parse(data.toString());
        // console.log("Raw ws message:", rawData);        
        const normalizedData = normalizeData(rawData.data.a, rawData.data.s);
        // console.log("This is the normalized data:",normalizedData); 

        const existing = updated_array.find((d) => d.asset == normalizedData.asset)

        if (existing) {
            existing.decimal = normalizedData.decimal;
            existing.price = normalizedData.price;
        } else {
            updated_array.push(normalizedData);
        }
        schemaData.price_updates = updated_array;
        // console.log("This is the data inside given schema", schemaData);
    })

    setInterval(() => {
        redisStreams(schemaData);
        // console.log(schemaData);
    }, 100);
}

poller();

