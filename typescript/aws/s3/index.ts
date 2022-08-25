import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as s3bucket from "./s3";

// Create an AWS resource (S3 Bucket)
//const bucket = new aws.s3.Bucket("my-bucket");

const bucket = new s3bucket.S3Bucket(
    'boog', {

    }
)

// Export the name of the bucket
//export const bucketName = bucket.bucket.id;
