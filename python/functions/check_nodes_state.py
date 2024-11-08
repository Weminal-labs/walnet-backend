from utils.ec2_client import get_ec2_client

from functions.describe_nodes import describe_nodes

def check_nodes_state(instance_ids):
    ec2 = get_ec2_client()

    response = ec2.describe_instance_status(InstanceIds=instance_ids)

    statuses = []

    for instance_status in response['InstanceStatuses']:
        statuses.append({
            "id": instance_status['InstanceId'],
            "state": {
                "code": instance_status['InstanceState']['Code'],
                "name": instance_status['InstanceState']['Name']
            }
        })

    return statuses