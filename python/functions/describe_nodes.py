from utils.ec2_client import get_ec2_client

def describe_nodes(instance_ids):
  ec2 = get_ec2_client()
  response = ec2.describe_instances(InstanceIds=instance_ids)
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
        }
      }      
      instances.append(instance)

  return instances