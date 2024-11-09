from utils.ec2_client import get_ec2_client
from utils.check_type import is_array

def create_security_group(vpc_id, group_name, description, inbound_rules = None):
    security_group_id = ""

    try:
        ec2 = get_ec2_client()
        # Create security group
        response = ec2.create_security_group(GroupName=group_name, Description=description, VpcId=vpc_id)
        security_group_id = response['GroupId']
        
        # Adding rule for security group (Allow to SSH from anywhere IPv4)
        if is_array(inbound_rules) and len(inbound_rules) > 0:
            ec2.authorize_security_group_ingress(
                GroupId=security_group_id,
                IpPermissions=inbound_rules
            )

        return security_group_id
    except Exception as e:
        ec2.delete_security_group(GroupId=security_group_id)
        raise Exception(str(e))