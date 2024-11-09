#!/bin/bash

# Set up working directory
WORK_DIR=/home/root

# Stop script if an error occurs
set -e

# Update package list
apt update -y

# Install necessary packages
apt install python3 python3-pip python3.10-venv curl -y

# Create a directory for the virtual environment
mkdir -p $WORK_DIR/ray_env  

# Create and activate the virtual environment
python3 -m venv $WORK_DIR/ray_env
source $WORK_DIR/ray_env/bin/activate

# Upgrade pip for compatibility
pip install --upgrade pip

# Install Ray and Flask
pip install -U "ray[default]" flask

# Get the local IP address of the instance
LOCAL_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

# Download the source code for the header server
curl -o $WORK_DIR/header.py https://raw.githubusercontent.com/Weminal-labs/walnet-backend/refs/heads/main/python/ray/header.py

# Start Ray head node with the local IP address
ray start --head --node-ip-address=$LOCAL_IP --port=8000 --dashboard-host=0.0.0.0

# Run the Flask application
python3 $WORK_DIR/header.py
