import os

from utils.ec2_client import get_ec2_client
from utils.regions import ec2_image_ids, core_region_name

from functions.describe_nodes import describe_nodes
from functions.create_security_group import create_security_group

def get_user_data():
    script_path = os.path.join(os.path.dirname(__file__), '..', 'scripts/user_data_worker_node.sh')
    with open(script_path, 'r') as file:
        user_data = file.read()
    return user_data

def create_worker_node(subnet_id = '', allowed_cidrs = None):
    ec2 = get_ec2_client()
    # user_data = get_user_data(token, public_ip_header_node)
    user_data = get_user_data()

    if allowed_cidrs == None or len(allowed_cidrs) < 1:
        allowed_cidrs = [ '0.0.0.0/0' ]

    security_group_id = create_security_group("Workder SG", [
        {
            'IpProtocol': '-1',
            'FromPort': 0,
            'ToPort': 65535,
            'IpRanges': [{"CidrIp": cidr} for cidr in allowed_cidrs]
        }
    ])

    response = ec2.run_instances(
        ImageId=ec2_image_ids[core_region_name]['t2.small'],
        InstanceType='t2.small',
        MinCount=1,
        MaxCount=1,
        # KeyName=key_name,
        # SecurityGroupIds=security_group_ids,
        UserData=user_data,
        SubnetId=subnet_id,
        SecurityGroupIds=[security_group_id],
        TagSpecifications=[
            {
                'ResourceType': 'instance',
                'Tags': [
                    {
                        'Key': 'Name',
                        'Value': 'worker-node-ray'
                    }
                ]
            }
        ]
    )
    
    instance_id = response['Instances'][0]['InstanceId']

    
    # Wait for the instance to be in the running state
    waiter = ec2.get_waiter('instance_running')
    waiter.wait(InstanceIds=[instance_id])
    
    # Describe Worker Node

    instance_info = describe_nodes(instance_ids=[instance_id])[0]

    return instance_info