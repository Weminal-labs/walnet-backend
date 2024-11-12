from datetime import datetime
import uuid

def generate_keypair_name(user_id):
    # Get date format ddmmyyyy
    current_date = datetime.now().strftime("%d%m%Y")

    # Merge string
    key_name = f"kp-{user_id}-{uuid.uuid4().hex}"
        
    return key_name

def generate_security_group_name():
    # Get date format ddmmyyyy
    current_timestamp = int(datetime.now().timestamp())

    # Merge string
    key_name = f"security-group-{uuid.uuid4().hex}-{current_timestamp}"
        
    return key_name