from utils.ec2_client import get_ec2_client

def create_security_group(group_name, description):
	ec2 = get_ec2_client()
	# Create security group
	response = ec2.create_security_group(GroupName=group_name, Description=description)
	security_group_id = response['GroupId']
	
	# Adding rule for security group (Allow to SSH from anywhere IPv4)
	ec2.authorize_security_group_ingress(
		GroupId=security_group_id,
		# IpPermissions=[
		# 	{
		# 		'IpProtocol': 'tcp',
		# 		'FromPort': 22,
		# 		'ToPort': 22,
		# 		'IpRanges': [{'CidrIp': '0.0.0.0/0'}] 
		# 	}
		# ]
		IpPermissions=[
			{
				'IpProtocol': '-1',  # all protocol
				'FromPort': 0,       # from port 0
				'ToPort': 65535,     # to port 65535
				'IpRanges': [{'CidrIp': '0.0.0.0/0'}]  # Allow all trafic
			}
		]
	)
	
	print(f"Security group '{group_name}' created with ID: {security_group_id}.")
	return security_group_id