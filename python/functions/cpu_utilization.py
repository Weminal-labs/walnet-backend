import boto3
from datetime import datetime, timedelta

# Import utils
from utils.cloudwatch_client import get_cloudwatch_client
from functions.describe_nodes import describe_nodes_with_type

def check_idle(instance_id):
    cloudwatch = get_cloudwatch_client()

    # Get the CPU utilization for the last 5 minutes
    response = cloudwatch.get_metric_statistics(
        Namespace='AWS/EC2',
        MetricName='CPUUtilization',
        Dimensions=[{ 'Name': 'InstanceId', 'Value': instance_id }],
        StartTime=datetime.now() - timedelta(minutes=15),
        EndTime=datetime.now(),
        Period=900,
        Statistics=['Average']
    )

    # Calculate the average CPU utilization
    data_points = response['Datapoints']
    if data_points:
        avg_cpu = sum(dp['Average'] for dp in data_points) / len(data_points)
        return avg_cpu <= 5.5  # Busy if above 10%, idle otherwise
    else:
        return False

def get_idle_nodes():
    instances = describe_nodes_with_type()
    instance_ids = [
        instance["id"]
        for instance in instances
    ]

    idle_instances = []

    for id in instance_ids:
        if check_idle(id):
            idle_instances.append(id)

    return idle_instances