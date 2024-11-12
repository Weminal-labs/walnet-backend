from utils.ec2_client import get_ec2_client

def _get_node_information(response):
    instances = []
    
    for reservation in response['Reservations']:
        for _instance in reservation['Instances']:
        # Information of an EC2 Instance
            instance = {
                "id": _instance['InstanceId'],
                "ip": _instance['PrivateIpAddress'],
                "architecture": _instance["Architecture"],
                "state": {
                    "code": _instance['State']['Code'],
                    "name": _instance['State']['Name']
                },
                "cpu": {
                    "core": _instance["CpuOptions"]["CoreCount"],
                    "threadPerCore": _instance["CpuOptions"]["ThreadsPerCore"]
                },
                "securityGroups": [{"groupId": item["GroupId"]} for item in _instance['SecurityGroups']]
            }
            instances.append(instance)

    return instances

def describe_nodes(instance_ids):
    ec2 = get_ec2_client()
    response = ec2.describe_instances(InstanceIds=instance_ids)
    return _get_node_information(response)

def describe_nodes_with_type(type_of_node = None):
    ec2 = get_ec2_client()
    filter = [
        {
            'Key': 'tag:Owner',
            'Value': 'shared-network'
        }
    ]

    if type_of_node == 'header':
        filter.append({
            'Key': 'tag:NodeType',
            'Value': 'header'
        })
    elif type_of_node == 'worker':
        filter.append({
            'Key': 'tag:NodeType',
            'Value': 'worker'
        })

    response = ec2.describe_instances(Filters=filter)
    return _get_node_information(response)