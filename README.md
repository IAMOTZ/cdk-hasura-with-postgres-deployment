# CDK Hasura with PostgreSQL Deployment

This project uses AWS CDK to deploy a complete Hasura GraphQL Engine setup with PostgreSQL database on AWS EC2. The deployment includes Docker Compose configuration for easy management and a systemd service for automatic startup.

## 🚀 Features

- **Hasura GraphQL Engine v2.46.0** - Instant GraphQL API over PostgreSQL
- **PostgreSQL 15** - Robust relational database
- **Docker Compose** - Containerized deployment for easy management
- **Systemd Service** - Automatic startup and restart capabilities
- **Security Groups** - Configured for Hasura console access (port 8080)
- **S3 Asset Management** - Automated deployment of configuration files

##  Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- [Node.js](https://nodejs.org/) (v18 or later)
- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) installed globally
- AWS account with permissions to create EC2, VPC, Security Groups, and S3 resources

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cdk-hasura-with-postgres-deployment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### First-time deployment
```bash
# Bootstrap CDK (only needed once per account/region)
npx cdk bootstrap

# Deploy the stack
npx cdk deploy
```

### Subsequent deployments
```bash
# Deploy updates
npx cdk deploy

# Or deploy with approval for security-sensitive changes
npx cdk deploy --require-approval any-change
```

##  Configuration

### Environment Variables
The stack uses the default AWS account and region from your CLI configuration. To customize:

1. Set environment variables:
   ```bash
   export CDK_DEFAULT_ACCOUNT=your-account-id
   export CDK_DEFAULT_REGION=your-region
   ```

2. Or modify `bin/cdk-hasura-with-postgres-deployment.ts` to specify exact values.

### Security Considerations

⚠️ **Important Security Notes:**

- The current configuration allows SSH access from any IP (port 22) - **restrict for production**
- Hasura console is accessible from any IP (port 8080)
- Postgres password is hardcoded - **use a Secrets Manager for production**
- Hasura admin secret is hardcoded - **use a Secrets Manager for production**

##  Accessing Hasura

After deployment, you can access:

- **Hasura Console**: `http://<EC2-PUBLIC-IP>:8080/console`
- **Admin Secret**: `hasura-admin-secret` (default)

## 🔍 Useful Commands

```bash
# Build TypeScript to JavaScript
npm run build

# Watch for changes and compile
npm run watch

# Run unit tests
npm test

# Synthesize CloudFormation template
npx cdk synth

# Compare deployed stack with current state
npx cdk diff

# Deploy stack
npx cdk deploy

# Destroy stack (removes all resources)
npx cdk destroy
```


### Logs and Debugging within the EC2 instance

```bash
# Check Docker containers
docker ps
docker logs <container-name>

# Check systemd service
sudo systemctl status hasura-with-docker
sudo journalctl -u hasura-with-docker
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
