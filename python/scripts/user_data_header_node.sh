#!/bin/bash

exec > /var/log/user-data.log 2>&1

# Set up working directory
WORK_DIR=$HOME

# Stop script if an error occurs
set -e

# Update package list with sudo
apt update -y

# Install necessary packages with sudo
apt install -y python3 python3-pip python3-venv curl

# Create a directory for the virtual environment
mkdir -p $WORK_DIR/ray_env  

# Create and activate the virtual environment
python3 -m venv $WORK_DIR/ray_env
source $WORK_DIR/ray_env/bin/activate

# Upgrade pip for compatibility
pip install --upgrade pip

# Install Ray and Flask
pip install -U "ray[default]" flask

# Download the source code for the header server
curl -o $WORK_DIR/main.py https://raw.githubusercontent.com/Weminal-labs/walnet-backend/refs/heads/main/python/ray/header.py

# Start Ray head node with the local IP address
ray start --head --node-ip-address=0.0.0.0 --port=8000

# Run the Flask application
python3 $WORK_DIR/main.py
