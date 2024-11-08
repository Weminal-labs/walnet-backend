from utils.ec2_client import get_ec2_client

def stop_node(instance_ids):
    ec2 = get_ec2_client()

    response = ec2.stop_instances(InstanceIds=instance_ids)
    instance = response['StoppingInstances'][0]

    return { 
        "id": instance['InstanceId'],
        "currentState": { "code": instance['CurrentState']['Code'], "name": instance['CurrentState']['Name'] },
        "previousState": { "code": instance['PreviousState']['Code'], "name": instance['PreviousState']['Name'] }
    }