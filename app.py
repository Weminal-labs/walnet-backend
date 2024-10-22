from flask import Flask, request
from utils.generate_token import generate_token
from utils.generate_keyname import generate_keypair_name, generate_security_group_name
from functions.aws.create_header_node import create_header_node
from functions.aws.create_worker_node import create_worker_node
from functions.aws.create_key_pair import create_key_pair
from functions.aws.create_security_group import create_security_group

app = Flask(__name__)
@app.route("/")
def hello():
  return "Hello World!"

@app.route('/deploy_cluster', methods=['POST'])
def create_and_setup_cluster():
    # Get userId from headers
    userId = request.headers.get('userId')  

    # Verify userId in the database
    # existUser = rs.find(userId)  # Assume rs.find() returns the user if it exists

    # if not existUser:
    # return {"error": "User not found"}, 404  # Return error if user does not exist

    # If the user exists, create a token with salt as userId
    token = generate_token(userId)

    # Create keypair example kp-userId-date
    key_name = generate_keypair_name(userId)
    
    # Create keypair
    create_key_pair(key_name)
        
    # Create security_group_name example sg-userId-date
    security_group_name = generate_security_group_name(userId)
    security_group_description = 'Security group for my EC2 instances'
    
    # Create security_group
    security_group_id = create_security_group(security_group_name, security_group_description)

    # Create header node
    header_node_ip = create_header_node(token, key_name, [security_group_id])
    
    # Setup worker node  
    worker_node_ips = create_worker_node(token, key_name, [security_group_id], header_node_ip)

    return {
       "message": "Cluster created successfully", 
       "header_node_ip": header_node_ip, 
       "worker_node_ips" : worker_node_ips
    }, 201

if __name__ == "__main__":
    app.run()
