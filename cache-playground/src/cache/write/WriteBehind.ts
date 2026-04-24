import { redis } from "../../redis/redis.client.js";
import { writeQueue } from "../../queue/queue.js";

export class WriteBehind{
    async write(key:string,data:any,dbWrite:()=>Promise<any>){
        await redis.set(key,data);
        writeQueue.enqueue(dbWrite);
        return data;
    }
}