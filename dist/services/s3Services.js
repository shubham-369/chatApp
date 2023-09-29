"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
function uploadToS3(file, filename) {
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
    let params = {
        Bucket: bucket_name,
        Key: filename,
        Body: file,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (error, data) => {
            if (error) {
                reject('Error while uploading file to s3Bucket ' + error.message);
            }
            else {
                resolve(data.Location);
            }
        });
    });
}
;
exports.default = uploadToS3;
