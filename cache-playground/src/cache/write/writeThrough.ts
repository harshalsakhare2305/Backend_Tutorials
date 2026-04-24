import { redis } from "../../redis/redis.client.js";

export class WriteThrough{
    async write(key:string,data:any,dbWrite:()=>Promise<any>){
        const result =await dbWrite();

        await redis.set(key,result);

        return result;
    }
    
}