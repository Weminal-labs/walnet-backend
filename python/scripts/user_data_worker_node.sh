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
pip install -U "ray" flask

# Load source code for Header Server
curl -o $WORK_DIR/workder.py https://raw.githubusercontent.com/Weminal-labs/walnet-backend/refs/heads/main/python/ray/workder.py

# Add node into cluster Ray with the public IP address
python3 $HOME/worker.py
