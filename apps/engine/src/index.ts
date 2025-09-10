import { createClient } from 'redis';

const client = createClient();
client.connect();

const OPEN_ORDER = [];

client.on("connect", async () => {
    while (1) {
        console.log("Control is inside the while loop");
        
        const res = await client.xRead({
            key: "trade-stream",
            id: "0"
        },{
            COUNT: 1,
            BLOCK: 10
        })

        if (!res) {
            console.log("Res is empty");
            continue;
        }
        // updating the in-memory array
        OPEN_ORDER.push(res);

        // @ts-ignore
        const {name, messages} = res[0]
        const payload = JSON.parse(messages[0].message.message);
        const id = payload.id;
        console.log(id);
            
        await client.xAdd("callback-stream", "*", {
            id: id
        })
    }
})
