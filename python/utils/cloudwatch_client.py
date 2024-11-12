import boto3

# Set up the CloudWatch client
def get_cloudwatch_client():
  return boto3.client("cloudwatch")