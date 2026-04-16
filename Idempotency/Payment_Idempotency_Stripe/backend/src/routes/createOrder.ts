import type  {Request,Response} from 'express'
import {prismaClient} from '../db.js'
import {razorpay} from '../utils/razorpay.js'

export const createOrder = async(req:Request,res:Response)=>{
    const key =(req as any).idempotencyKey;
    const {amount} =req.body;

    const existing =await prismaClient.idempotencyKey.findUnique({where:{key}});

    if(existing?.razorpayOrderId){
        return res.json(existing?.response);
    }

    const order =await razorpay.orders.create({
        amount:amount*100,
        currency:"INR",
        receipt:`receipt_${key}`,
    });

    const response ={orderId:order.id,amount};

    await prismaClient.idempotencyKey.update({
        where:{key},
        data:{
            razorpayOrderId:order.id,
            status:"SUCCESS",
            response
        },
    });
   
    res.json(response);

}