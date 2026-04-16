import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { idempotencyMiddleware } from './middleware/idempotency.js';
import { createOrder } from './routes/createOrder.js';
import { verifyPayment } from './routes/verify.js';

const app =express();

app.use(cors());
app.use(bodyParser.json());

app.post('/create-order',idempotencyMiddleware,createOrder);
app.post("/verify",idempotencyMiddleware,verifyPayment);





app.listen(5000,()=>{
    console.log("Server is listening on port number 5000");
});