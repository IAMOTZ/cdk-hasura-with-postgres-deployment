#!/bin/bash

# Install docker
dnf update -y
dnf install -y docker

# Enable/start docker service via systemd
systemctl enable docker
systemctl start docker

# Add docker to ec2-user group
usermod -aG docker ec2-user

# Install Docker Compose v2 plugin
DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/libexec/docker}
mkdir -p "$DOCKER_CONFIG/cli-plugins"
curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"

# Copy application assets to ec2 instance
mkdir -p /home/ec2-user/hasura-with-docker
aws s3 cp {{EC2_ASSETS_S3_URL}} /home/ec2-user/hasura-with-docker/app.zip
unzip /home/ec2-user/hasura-with-docker/app.zip -d /home/ec2-user/hasura-with-docker/

chown -R ec2-user:ec2-user /home/ec2-user/hasura-with-docker

cp /home/ec2-user/hasura-with-docker/hasura-with-docker.service /etc/systemd/system/hasura-with-docker.service

systemctl enable hasura-with-docker
systemctl start hasura-with-docker
