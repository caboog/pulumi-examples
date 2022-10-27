import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as random from "@pulumi/random";
import { output } from "@pulumi/pulumi";

const vpc = new awsx.ec2.Vpc("carl", {
    cidrBlock: "172.24.0.0/20"
})
export const vpcId = vpc.id
export const publicSubnetIds = vpc.publicSubnetIds
const password = new random.RandomPassword("password", {
    length: 16,
    special: true,
    overrideSpecial: `_%@`,
});

const dbsecret = new aws.secretsmanager.Secret("dbpassword11", {});

const dbssm = new aws.secretsmanager.SecretVersion("dbpassword-ssm", {
    secretId: dbsecret.id,
    secretString: password.result,
});

// const getpass = pulumi.output(aws.secretsmanager.getSecret({
//     name: "dbpassword-0745e16",
// }));
const sg = new aws.rds.SubnetGroup("example", {
    subnetIds: vpc.publicSubnetIds,
});

const securityGroup = new aws.ec2.SecurityGroup("carl-test", {
    description: "all",
    vpcId: vpc.id,
    ingress: [
      { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["104.156.99.82/32"] },
    ],
    egress: [
      { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] },
    ]
});

const carl_cluster_demo = new aws.rds.Cluster("carl-cluster-demo", {
    allocatedStorage: 1,
    applyImmediately: true,
    availabilityZones: [
        "us-east-2a",
        "us-east-2b",
        "us-east-2c",
    ],
    backupRetentionPeriod: 7,
    clusterIdentifier: "carl-cluster-demo",
    clusterMembers: ["carl-cluster-demo-instance-1"],
    copyTagsToSnapshot: true,
    dbClusterParameterGroupName: "default.aurora-postgresql14",
    dbSubnetGroupName: "example-1aad104",
    deletionProtection: true,
    engine: "aurora-postgresql",
    engineVersion: "14.4",
    kmsKeyId: "arn:aws:kms:us-east-2:052848974346:key/1384de79-beb1-49eb-ba1a-08dba411d699",
    masterUsername: "carl",
    masterPassword: password.result,
    networkType: "IPV4",
    port: 5432,
    preferredBackupWindow: "05:15-05:45",
    preferredMaintenanceWindow: "sat:08:25-sat:08:55",
    skipFinalSnapshot: true,
    storageEncrypted: true,
    vpcSecurityGroupIds: ["sg-0f9d1cb04ca9bd213"],
}, {
    protect: false,
});
for (const range = {value: 0}; range.value < 2; range.value++){
const readOnlyClusterInstance = new aws.rds.ClusterInstance( `carlInstances-${range.value}`, {
        identifier: `carl-cluster-demo-${range.value}`,
        clusterIdentifier: carl_cluster_demo.id,
        instanceClass: "db.t3.medium",
        engine: "aurora-postgresql",
        engineVersion: carl_cluster_demo.engineVersion,
        applyImmediately: true,
        publiclyAccessible: true,
    });
}
export const dbpass = password.result

