from utils.ec2_client import get_ec2_client

from functions.describe_nodes import describe_nodes

def reboot_node(instance_id):
    ec2 = get_ec2_client()

    response = ec2.reboot_instances(InstanceIds=[instance_id])

    # Wait for the instance to be in the running state
    waiter = ec2.get_waiter('instance_running')
    waiter.wait(InstanceIds=[instance_id])

    return describe_nodes(instance_ids=[instance_id])[0]