import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getArn } from "@pulumi/aws";
import { AclArgs } from "@pulumi/aws/memorydb";

export interface FargateWebAppArgs {
    vpcId: pulumi.Input<string>
    subnetIds: pulumi.Input<pulumi.Input<string>[]>
    containerPort: pulumi.Input<number>
}

export class FargateWebApp extends pulumi.ComponentResource {

    cluster: aws.ecs.Cluster;
    securityGroup: aws.ec2.SecurityGroup;
    alb: aws.lb.LoadBalancer;
    atg: aws.lb.TargetGroup;
    wl: aws.lb.Listener;
    
    role: aws.iam.Role;
    rpa: aws.iam.RolePolicyAttachment;
    taskdefinition: aws.ecs.TaskDefinition;
    service: aws.ecs.Service;

    
    constructor(name: string, args: FargateWebAppArgs, opts?: pulumi.ComponentResourceOptions) {
        super("boog:index:FargateWebApp", name, {}, opts)

        this.cluster = new aws.ecs.Cluster(name, {}, { parent: this, aliases: [ "urn:pulumi:dev::cluster::aws:ecs/cluster:Cluster::boog" ]})


        this.securityGroup = new aws.ec2.SecurityGroup(name, {
            vpcId: args.vpcId,
            description: 'Enable HTTP Access',
            ingress: [{
                protocol: 'tcp',
                fromPort: 80,
                toPort: 80,
                cidrBlocks: ['0.0.0.0/0']
            }],
            egress: [{
                protocol: '-1',
                fromPort: 0,
                toPort: 0,
                cidrBlocks: ['0.0.0.0/0']
            }]
        },
        {parent: this}
        )  

        this.alb = new aws.alb.LoadBalancer(name,{
            securityGroups: [this.securityGroup.id],
            subnets: args.subnetIds,
        },
        {parent: this}
        )  

        this.atg = new aws.lb.TargetGroup(name, {
            targetType: "alb",
            port: 80,
            protocol: "TCP",
            vpcId: args.vpcId,
        },
        {parent: this}
        )

        this.wl = new aws.alb.Listener(name, {
            loadBalancerArn: this.alb.arn,
            port: 80,
            defaultActions: [{
                type: "forward",
                targetGroupArn: this.atg.arn,
            }],
        },
        {parent: this}
        )

        this.role = new aws.iam.Role(name, {
            assumeRolePolicy: JSON.stringify({ 
                Version: "2008-10-17",
                Statement: [{
                    Sid: "",
                    Effect: "Allow", 
                    Principal: {
                        Service: "ecs-tasks.amazonaws.com"
                    },
                    Action: "sts:AssumeRole",
                }]
            }),
        },
            {parent: this}
        )
        this.rpa = new aws.iam.RolePolicyAttachment(name, {
            role: this.role.name,
            policyArn: "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
        },
            {parent: this}
        )


        this.taskdefinition = new aws.ecs.TaskDefinition(name, {
            family: "fargate-task-definition", // nginx
            cpu: "256",
            memory: "512",
            networkMode: "awsvpc",
            requiresCompatibilities: ["FARGATE"],
            executionRoleArn: this.role.arn,
            containerDefinitions: JSON.stringify([{
                name: "my-app",
                image: "nginx",
                portMappings: [{
                    "containerPort": args.containerPort,
                    "hostPort": 80,
                    "protocol": "tcp"
                }]
            }])
        },
            {parent: this}
        )
        
        this.service = new aws.ecs.Service(name, {
            cluster: this.cluster.arn,
            desiredCount: 3,
            launchType: 'FARGATE',
            taskDefinition: this.taskdefinition.arn,
            networkConfiguration: {
                assignPublicIp: true,
                subnets: args.subnetIds,
                securityGroups: [this.securityGroup.id],
            },
             loadBalancers: [{
                 targetGroupArn: this.atg.arn,
                 containerName: "my-app",
                 containerPort: 80,
                }],
        },
            {dependsOn: this.wl, parent: this} 

        )

        // works
        this.service.name.apply(name => {
            console.log(JSON.stringify({ "name": name }))
        })

        
    }
}