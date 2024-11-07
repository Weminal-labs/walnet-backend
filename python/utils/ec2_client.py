import boto3
from utils.regions import core_region

def get_ec2_client():
    ec2_client = boto3.client("ec2", region_name=core_region)
    return ec2_client