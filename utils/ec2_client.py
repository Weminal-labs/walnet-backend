import boto3

def get_ec2_client():
    ec2_client = boto3.client('ec2', region_name='ap-southeast-2')
    return ec2_client