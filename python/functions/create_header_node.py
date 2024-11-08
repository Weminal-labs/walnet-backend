import os

from utils.ec2_client import get_ec2_client
from utils.regions import ec2_image_ids, core_region_name

from functions.describe_nodes import describe_nodes

def get_user_data():
    script_path = os.path.join(os.path.dirname(__file__), '..', 'script/user_data_header_node.sh')
    with open(script_path, 'r') as file:
        user_data = file.read()
    return user_data

def create_header_node():
    ec2 = get_ec2_client()
    # user_data = get_user_data(token)
    user_data = get_user_data()

    response = ec2.run_instances(
        ImageId=ec2_image_ids[core_region_name]['t3.medium'],
        InstanceType='t3.medium',
        MinCount=1,
        MaxCount=1,
        # KeyName=key_name,
        # SecurityGroupIds=security_group_ids,
        UserData=user_data,
        TagSpecifications=[
            {
                'ResourceType': 'instance',
                'Tags': [
                    {
                        'Key': 'Name',
                        'Value': 'header-node-ray'
                    }
                ]
            }
        ]
    )
    
    instance_id = response['Instances'][0]['InstanceId']

    
    # Wait for the instance to be in the running state
    waiter = ec2.get_waiter('instance_running')
    waiter.wait(InstanceIds=[instance_id])
    
    # Describe Header Node
    instance_info = describe_nodes(instance_ids=[instance_id])[0]

    return instance_info
