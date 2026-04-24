import { redis } from "../../redis/redis.client.js";
import { config } from "../../config/cache.config.js";

export class CacheAside{
    async get(key:string,fetcher:()=>Promise<any>){
        const cached=await redis.get(key);

        if(cached){
            console.log("⚡ Cache Hit");
            return cached;
        }

        const data=await fetcher();

        if(data){
            await redis.set(key,data,"EX",config.TTL);
        }

        return data;
    }
}