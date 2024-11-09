from utils.ec2_client import get_ec2_client, get_ec2_resource

from functions.describe_nodes import describe_nodes

def destroy_node(instance_ids):
    try:
        ec2 = get_ec2_client()
        ec2_resource = get_ec2_resource()

        response = ec2.terminate_instances(InstanceIds=instance_ids)
        instance = response['TerminatingInstances'][0]

        instance_info = describe_nodes([instance['InstanceId']])[0]

        instance_ref = ec2_resource.Instance(instance['InstanceId'])
        instance_ref.wait_until_terminated()

        # Delete security groups
        ec2.delete_security_group(GroupId=instance_info['securityGroups'][0]['groupId'])

        return { 
            "id": instance['InstanceId'],
            "currentState": { "code": instance['CurrentState']['Code'], "name": instance['CurrentState']['Name'] },
            "previousState": { "code": instance['PreviousState']['Code'], "name": instance['PreviousState']['Name'] }
        }
    except Exception as e:
        raise Exception(str(e))