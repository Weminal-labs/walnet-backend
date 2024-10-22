#!/bin/bash
# stop script if it has error
set -e 

# Update package list
apt update -y

# Install necessary packages
apt install python3 python3-pip python3.10-venv -y

# Create a directory for the virtual environment
mkdir -p /home/ubuntu/ray_env  

# Create a virtual environment
python3 -m venv /home/ubuntu/ray_env  

# Activate the virtual environment
source /home/ubuntu/ray_env/bin/activate

# Install Ray
pip install -U "ray"

# Add node into cluster Ray with the public IP address
ray start --address='{PUBLIC_IP}:6379' --redis-password={TOKEN}
