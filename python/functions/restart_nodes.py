from utils.ec2_client import get_ec2_client

from functions.describe_nodes import describe_nodes

def restart_nodes(instance_ids):
    ec2 = get_ec2_client()

    response = ec2.start_instances(InstanceIds=instance_ids)

    instance = response['StartingInstances'][0]

    return { 
        "id": instance['InstanceId'],
        "currentState": { "code": instance['CurrentState']['Code'], "name": instance['CurrentState']['Name'] },
        "previousState": { "code": instance['PreviousState']['Code'], "name": instance['PreviousState']['Name'] }
    }