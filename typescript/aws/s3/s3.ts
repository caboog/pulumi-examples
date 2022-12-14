import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";
import * as asyncmutex from 'async-mutex';

const mutex = new asyncmutex.Mutex();

mutex
    .runExclusive(function() {
        // ...
    })
    .then(function(result) {
        // ...
    });

export class S3Bucket extends pulumi.ComponentResource {

    bucket: aws.s3.Bucket;
    // role: aws.iam.Role;
    // rpa: aws.iam.RolePolicyAttachment



    constructor(name: string, args?: {}, opts?: pulumi.ComponentResourceOptions ) {
        super("boog:index:S3Bucket", name, {}, opts)

        this.bucket = new aws.s3.Bucket(name, {}, {parent: this})

        //Does not work.
        // let bucketName = pulumi.all([this.bucket.id]).
        //       apply([this.bucket.id]) => {
        //          console.log(this.bucket.id)};

        // //Does not work.
        // const bucketName: Output<string> = pulumi.all([this.bucket.id]).apply([this.bucket.id]) => {console.log(this.bucket.id)};

        // this.role = new aws.iam.Role(name, {
        //     assumeRolePolicy: JSON.stringify({
        //             Version: "2012-10-17",
        //             Statement: [
        //                 {
        //                     Sid: "PublicRead",
        //                     Effect: "Allow",
        //                     Principal: "*",
        //                     Action: [
        //                         "s3:GetObject",
        //                         "s3:GetObjectVersion"
        //                     ],
        //                     Resource: [
        //                         "arn:aws:s3:::{this.bucketName}/*"
        //                     ]
        //                 }
        //             ]
        //         })
        //     },
        //     {parent: this}
        //     )
        
        //     this.rpa = new aws.iam.RolePolicyAttachment(name, {
        //         role: this.role.name,
        //         policyArn: this.role.arn,
        //     },
        //         {dependsOn: this.role, parent: this}
        //     )
        }
        

}