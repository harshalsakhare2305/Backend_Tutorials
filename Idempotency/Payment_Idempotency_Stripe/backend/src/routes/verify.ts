import type { Request,Response } from "express";
import {prismaClient} from '../db.js'
import crypto from "crypto"
import dotenv from "dotenv"
import { error } from "console";

dotenv.config();

export const verifyPayment =async (req:Request,res:Response)=>{
    const key =(req as any).idempotencyKey;

    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

    const body =razorpay_order_id +"|"+razorpay_payment_id;

    const expected =crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");

    if(expected!==razorpay_signature){
        return res.status(400).json({error:"Invalid Signature"});
    }

    const existing =await prismaClient.idempotencyKey.findUnique({where:{key}});

    if(existing && typeof existing.response === 'object' && existing.response !== null && (existing.response as any).verified){
        return res.status(200).json(existing.response);
    }

    const response ={
        success:true,
        paymentId:razorpay_payment_id,
        verified:true,
    };

    await prismaClient.idempotencyKey.update({
        where:{key},
        data:{
            status: "SUCCESS",
             response
        }
    },
);


  res.json(response);

}
