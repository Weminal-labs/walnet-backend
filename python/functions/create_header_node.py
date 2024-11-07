from utils.ec2_client import get_ec2_client
from utils.regions import ec2_ids, core_region_name

def get_user_data(token):
    with open('utils/script/user_data_header_node.sh', 'r') as file:
        user_data = file.read()
    # user_data = user_data.replace('{TOKEN}', token)
    return user_data

def create_header_node(token, key_name, security_group_ids):
    ec2 = get_ec2_client()
    # user_data = get_user_data(token)
    user_data = get_user_data()

    response = ec2.run_instances(
        ImageId=ec2_ids[core_region_name]["t3.medium"],
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
    
    print(f"response ec2.run_instances created {response}")
    instance_id = response['Instances'][0]['InstanceId']
    
    # Wait for the instance to be in the running state
    print("Waiting for instance to be in running state...")
    waiter = ec2.get_waiter('instance_running')
    waiter.wait(InstanceIds=[instance_id])
    
    # Get IPv4 address of header node
    instance_info = ec2.describe_instances(InstanceIds=[instance_id])
    print(f"instance_info: {instance_info}")
    
    # Check if PrivateIpAddress exists
    instance_ipv4 = instance_info['Reservations'][0]['Instances'][0].get('PrivateIpAddress')

    if instance_ipv4:
        print(f"Instance '{instance_id}' created with private IPv4 address: {instance_ipv4}")
    else:
        print(f"No private IPv4 address assigned to instance '{instance_id}'.")

    return instance_ipv4, instance_info['Reservations'][0]['Instances'][0]
