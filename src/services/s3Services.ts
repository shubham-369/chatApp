import * as AWS from "aws-sdk";

function uploadToS3(file: any, filename: any){
    const bucket_name = process.env.BUCKET_NAME;
    const i_am_user_key = process.env.IAM_ACCESS_KEY;
    const i_am_user_secret_key = process.env.IAM_SECRET_KEY;

    if (!bucket_name) {
        throw new Error("Bucket name is not defined in environment variables.");
    }

    let s3bucket = new AWS.S3({
        accessKeyId: i_am_user_key,
        secretAccessKey: i_am_user_secret_key
    });

    const fileBuffer = Buffer.from(file.buffer);
    
    let params: AWS.S3.PutObjectRequest = {
        Bucket: bucket_name,
        Key: filename,
        Body: fileBuffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
    };

    return new Promise((resolve, reject)=> {
        s3bucket.upload(params, (error, data)=> {
            if(error){
                reject('Error while uploading file to s3Bucket '+ error.message);
            }else{
                resolve(data.Location);
            }
        });
    })
};

export default uploadToS3;