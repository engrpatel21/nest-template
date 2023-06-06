import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { RedisKeyValue } from "./dto/redis.dto";

@Injectable()
export class RedisCacheManager{
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache){
    }

    async setGetKeyValueTest(redisKeyValue: RedisKeyValue): Promise<string>{
        await this.cacheManager.set(redisKeyValue.key, redisKeyValue.value)
        return await this.cacheManager.get<string>(redisKeyValue.key)
    }

    async setSessionIdToUser(redisKeyValue: RedisKeyValue){
        try{
            await this.cacheManager.set(redisKeyValue.key, redisKeyValue.value) 
            return await this.cacheManager.get<string>(redisKeyValue.key)
        } catch(error: any){
            throw new Error(`Redis Error: ${error}`)
        }
    }

}