import {S3Client,GetObjectCommand,PutObjectCommand,ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

// const s3Client =new S3Client({
//     region:'ap-south-1',
//     credentials:{
//         accessKeyId:"your access key",
//         secretAccessKey:"Your secret access key "
//     }
// });

const bucketName ="tutorial-bucket.nodejs";

async function generateURL(key){

    // Write some Extraa Sucurity COde or middleware to check if the user is authorized to access the file or not
    const command =new GetObjectCommand({
        Bucket:bucketName,
        Key:key
    });

    try {
       const url =await getSignedUrl(s3Client,command);
       console.log("The url for Image is: ", url) 
    } catch (error) {
        console.error("Error generating signed URL:", error);
    }
}
async function GetUploadURL(filename,ContentType) {
    
    const command =new PutObjectCommand({
        Bucket:bucketName,
        Key:`user/uploads/images/${filename}`,
        ContentType:ContentType
    });

    try {
        const url =await getSignedUrl(s3Client,command);
        console.log("The url for uploading file is: ", url)
    } catch (error) {
        console.error("Error generating signed URL for upload:", error);
    }
}

async function ListObjects(){
    const command =new ListObjectsV2Command({
        Bucket:bucketName,
        Key:"/"
    });

    const list =await s3Client.send(command);
    console.log("List of objects in the bucket: ", list);
}

async function init(){
     //await generateURL("user/uploads/images/Images-1775655997945");
   //  await ListObjects();

   const command =new DeleteObjectCommand({
    Bucket:bucketName,
    Key:"image1.png"
   });

   await s3Client.send(command);

      //  await GetUploadURL(`Images-${Date.now()}`,"images/png");
}

init();


