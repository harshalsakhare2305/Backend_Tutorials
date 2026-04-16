import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

import {prismaClient} from '../db.js'
import { error } from 'console';

export const idempotencyMiddleware =async(req:Request,res:Response,next:NextFunction)=>{
    
    const key =req.header("Idempotency-Key");
    console.log("Key is :",key);
    if(!key)return res.status(400).json({error:"Missing Key"});
   
    const hash =crypto.createHash("sha256").update(JSON.stringify(req.body)).digest("hex");

    const existing =await prismaClient.idempotencyKey.findUnique({
    where:{
        key
    }
    });

    console.log("Exisitn Check is :",existing);
    
    if(existing){
        if(existing.requestHash !=hash){
            return res.status(400).json({error:"Payload Mismatch"});
        }

        if(existing.status=="PROCESSING")
            return res.status(409).json({error:"Processing"});

        return res.json(existing.response);
    }

    try {
        await prismaClient.idempotencyKey.create({
            data:{key,requestHash:hash,status:"PROCESSING"},
        });
    } catch (error) {
        const record =await prismaClient.idempotencyKey.findUnique({where:{key}});
        return res.json(record?.response);
    }

    (req as any).idempotencyKey=key;
    next();
}