import boto3
from utils.regions import core_region

# Set up the CloudWatch client
def get_cloudwatch_client():
  return boto3.client("cloudwatch", region_name=core_region)