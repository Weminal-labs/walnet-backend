import boto3
from datetime import datetime, timedelta

# Import utils
from utils.cloudwatch_client import get_cloudwatch_client

def check_cpu_utilization(instance_id):
    cloudwatch = get_cloudwatch_client()

    # Get the CPU utilization for the last 5 minutes
    response = cloudwatch.get_metric_statistics(
        Namespace='AWS/EC2',
        MetricName='CPUUtilization',
        Dimensions=[{ 'Name': 'InstanceId', 'Value': instance_id }],
        StartTime=datetime.now() - timedelta(minutes=5),
        EndTime=datetime.now(),
        Statistics=['Average']
    )

    # Calculate the average CPU utilization
    data_points = response['Datapoints']
    if data_points:
        avg_cpu = sum(dp['Average'] for dp in data_points) / len(data_points)
        print(f"Average CPU Utilization: {avg_cpu}%")
        return avg_cpu > 10  # Busy if above 10%, idle otherwise
    else:
        print("No data points available.")
        return False
