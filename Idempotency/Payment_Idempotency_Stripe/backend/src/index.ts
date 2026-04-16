import express from 'express'

import {prismaClient} from './db.js'

const app =express();

async function init() {
    const hello= await  prismaClient.idempotencyKey.create({
   data:{
      key:"djksss@",
    requestHash:"fjdjsdowdkc",
    status:"dfjfefd"
   }
});

}
init();




app.get('/',(req,res)=>{
});

app.listen(5000,()=>{
    console.log("Server is listening on port number 5000");
});