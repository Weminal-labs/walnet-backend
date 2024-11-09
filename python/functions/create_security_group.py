from utils.ec2_client import get_ec2_client

def create_security_group(group_name, description, inbound_rules = None):
	ec2 = get_ec2_client()
	# Create security group
	response = ec2.create_security_group(GroupName=group_name, Description=description)
	security_group_id = response['GroupId']
	
	# Adding rule for security group (Allow to SSH from anywhere IPv4)
	if inbound_rules:
		ec2.authorize_security_group_ingress(
			GroupId=security_group_id,
			IpPermissions=inbound_rules
		)
	
	print(f"Security group '{group_name}' created with ID: {security_group_id}.")
	return security_group_id