#!/bin/bash
# stop script if it has error
set -e 

# Update package list
apt update -y

# Install necessary packages
apt install python3 python3-pip python3.10-venv -y

# Create a directory for the virtual environment
mkdir -p /home/root/ray_env  

# Create a virtual environment
python3 -m venv /home/root/ray_env  

# Activate the virtual environment
source /home/root/ray_env/bin/activate

# Install Ray
pip install -U "ray[default]"

# Get the public IP address of the instance
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Start Ray with the public IP address
ray start --head --node-ip-address=$PUBLIC_IP --redis-password={TOKEN}