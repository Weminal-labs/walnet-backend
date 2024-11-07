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

# Get the local IP address of the instance
LOCAL_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

# Start Ray with the local IP address
ray start --head --node-ip-address=$LOCAL_IP