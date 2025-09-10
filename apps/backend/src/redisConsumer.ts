import { createClient, RedisClientType } from 'redis';
import { CALLBACK_STREAM } from './index';


export class RedisConsumer {
    private client: RedisClientType;

    constructor() {
        this.client = createClient();
        this.client.connect();
        this.messageReader();
    }
    async messageReader() {
        while (1) {
            console.log("Control is inside the messageReader");
            const res = await this.client.xRead({ 
                    key: "callback-stream", 
                    id: "$" 
                },{
                    COUNT: 1,
                    BLOCK: 10
                })

            if (!res) {
                continue;
            }
            // @ts-ignore
            const {name, messages} = res[0];
            // const payload = JSON.parse(messages[0].message.message);
            // @ts-ignore
            const id = res[0]?.messages[0]?.id;
            console.log("This is the message from callback stream", id);

            // await new Promise(r => setInterval(r,0))
        }
    }
    waitForMessage() {
        console.log("Control is inside the waitForMessageFunction");
    }
}