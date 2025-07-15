import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import path from 'path';

export class CdkHasuraWithPostgresStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Using the default VPC
    const vpc = Vpc.fromLookup(this, 'Vpc', {
      isDefault: true,
    });

    // Create a security group
    const securityGroup = new cdk.aws_ec2.SecurityGroup(this, 'hasura-with-postgres-security-group', {
      vpc,
      allowAllOutbound: true,
      description: 'Hasura/Postgres security group'
    })

    // Inbound rule below allows all inbound traffic from any IP address on port 8080
    // This allows access to the Hasura console
    securityGroup.addIngressRule(cdk.aws_ec2.Peer.anyIpv4(), cdk.aws_ec2.Port.tcp(8080), 'Hasura Console')

    // EC2 instance
    const instance = new cdk.aws_ec2.Instance(this, 'hasura-with-postgres', {
      vpc,
      instanceType: cdk.aws_ec2.InstanceType.of(cdk.aws_ec2.InstanceClass.T2, cdk.aws_ec2.InstanceSize.MICRO),
      machineImage: cdk.aws_ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
    });

    // Upload application assets to S3
    const assets = new cdk.aws_s3_assets.Asset(this, 'HasuraWithPostgresEC2Assets', {
      path: path.join(__dirname, './assets'),
    });
    assets.grantRead(instance.role)

    // Read the user data script and replace the EC2_ASSETS_S3_URL placeholder with the S3 object URL
    let userDataScript = readFileSync(path.join(__dirname, './ec2-user-data.sh'), 'utf-8');
    userDataScript = userDataScript.replace('{{EC2_ASSETS_S3_URL}}', assets.s3ObjectUrl)

    // Add the user data script to the instance
    instance.addUserData(userDataScript);
  }
}
