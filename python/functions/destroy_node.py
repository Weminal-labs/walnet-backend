from utils.ec2_client import get_ec2_client

from functions.describe_nodes import describe_nodes

def destroy_node(instance_ids):
    ec2 = get_ec2_client()

    response = ec2.terminate_instances(InstanceIds=instance_ids)
    instance = response['TerminatingInstances'][0]

    instance_info = describe_nodes([instance['InstanceId']])[0]

    # Delete security groups
    ec2.delete_security_group(GroupId=instance_info['securityGroups'][0]['groupId'])

    return { 
        "id": instance['InstanceId'],
        "currentState": { "code": instance['CurrentState']['Code'], "name": instance['CurrentState']['Name'] },
        "previousState": { "code": instance['PreviousState']['Code'], "name": instance['PreviousState']['Name'] }
    }