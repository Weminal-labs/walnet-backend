#!/bin/bash

# Set up working directory
WORK_DIR=/home/root

# stop script if it has error
set -e 

# Update package list
apt update -y

# Install necessary packages
apt install python3 python3-pip python3.10-venv -y

# Create a directory for the virtual environment
mkdir -p $WORK_DIR/ray_env  

# Create a virtual environment
python3 -m venv $WORK_DIR/ray_env  

# Activate the virtual environment
source $WORK_DIR/ray_env/bin/activate

# Install Ray
pip install -U "ray[default]" flask

# Get the local IP address of the instance
LOCAL_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

# Load source code for Header Server
curl -o $WORK_DIR/header.py https://raw.githubusercontent.com/Weminal-labs/walnet-backend/refs/heads/main/python/ray/header.py

# Start Ray with the local IP address
ray start --head --node-ip-address=$LOCAL_IP --port=8000
python3 $WORK_DIR/header.py
