import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as random from "@pulumi/random";
import { output } from "@pulumi/pulumi";

const password = new random.RandomPassword("password", {
    length: 17,
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

const postgresqlcluster = new aws.rds.Cluster("carl-postgresql", {
    availabilityZones: [
        "us-east-1a",
        "us-east-1b",
        "us-east-1c",
    ],
    backupRetentionPeriod: 5,
    clusterIdentifier: "carl-cluster-demo",
    databaseName: "mydb",
    preferredBackupWindow: "07:00-09:00",
    deletionProtection: false,
    engine: "aurora-postgresql",
    engineMode: "provisioned",
    engineVersion: "14.3",
    masterPassword: password.result,
    masterUsername: "carl",
    skipFinalSnapshot: true,
});
for (const range = {value: 0}; range.value < 2; range.value++){
const readOnlyClusterInstance = new aws.rds.ClusterInstance( `carlInstances-${range.value}`, {
        identifier: `carl-cluster-demo-${range.value}`,
        clusterIdentifier: postgresqlcluster.id,
        instanceClass: "db.t3.medium",
        engine: "aurora-postgresql",
        engineVersion: postgresqlcluster.engineVersion,
        applyImmediately: true,
        publiclyAccessible: true,
    });
}
export const dbpass = password.result

