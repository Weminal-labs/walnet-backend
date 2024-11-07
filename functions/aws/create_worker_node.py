from utils.ec2_client import get_ec2_client

def get_user_data(token, public_ip_header_node):
    with open('utils/script/user_data_worker_node.sh', 'r') as file:
        user_data = file.read()
    # user_data = user_data.replace('{TOKEN}', token)
    # user_data = user_data.replace('{PUBLIC_IP}', public_ip_header_node)
    return user_data

def create_worker_node(token, key_name, security_group_ids, public_ip_header_node):
    ec2 = get_ec2_client()
    # user_data = get_user_data(token, public_ip_header_node)
    user_data = get_user_data()

    response = ec2.run_instances(
        ImageId='ami-040e71e7b8391cae4',
        InstanceType='t2.small',
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
                        'Value': 'worker-node-ray'
                    }
                ]
            }
        ]
    )
    
    print(f"response ec2.run_instances created {response}")
    
    # Lấy danh sách ID của các instance đã tạo
    instance_ids = [instance['InstanceId'] for instance in response['Instances']]
    
    # Chờ cho tất cả các instance vào trạng thái "running"
    print("Waiting for instances to be in running state...")
    waiter = ec2.get_waiter('instance_running')
    waiter.wait(InstanceIds=instance_ids)
    
    # Lấy thông tin của các instance
    instance_info = ec2.describe_instances(InstanceIds=instance_ids)
    print(f"instance_info: {instance_info}")
    
    # Kiểm tra và in địa chỉ IPv4 của từng instance
    for instance in instance_info['Reservations'][0]['Instances']:
        instance_ipv4 = instance.get('PrivateIpAddress')
        instance_id = instance['InstanceId']
        
        if instance_ipv4:
            print(f"Instance '{instance_id}' created with private IPv4 address: {instance_ipv4}")
        else:
            print(f"No private IPv4 address assigned to instance '{instance_id}'.")

    return [instance.get('PrivateIpAddress') for instance in instance_info['Reservations'][0]['Instances']], instance_info['Reservations'][0]['Instances']