import * as webapp from "./fargatewebapp";
import * as aws from "@pulumi/aws";

const vpc = aws.ec2.getVpcOutput({default: true})
const subnets = aws.ec2.getSubnetIdsOutput({ vpcId: vpc.id })

const app = new webapp.FargateWebApp(
    'boog', {
        vpcId: vpc.id,
        subnetIds: subnets.ids,
        containerPort: 80,
    }
)