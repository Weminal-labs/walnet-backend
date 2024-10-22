from utils.ec2_client import get_ec2_client

def create_key_pair(key_name):
    ec2 = get_ec2_client()
    # Create the keypair
    key_pair = ec2.create_key_pair(KeyName=key_name)
    
    # In the furture, we will save in database
    # Currently, we're saving private key into file
    with open(f"utils/private/{key_name}.pem", "w") as key_file:
        key_file.write(key_pair['KeyMaterial'])
    
    print(f"Key pair '{key_name}' created and saved as '{key_name}.pem'.")
    print(f"Key pair '{key_name}' {key_pair}")