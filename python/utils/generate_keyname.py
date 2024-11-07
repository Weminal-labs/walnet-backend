from datetime import datetime

def generate_keypair_name(user_id):
    # Get date format ddmmyyyy
    current_date = datetime.now().strftime("%d%m%Y")

    # Merge string
    key_name = f"keypair-{user_id}-{current_date}"
        
    return key_name

def generate_security_group_name(user_id):
    # Get date format ddmmyyyy
    current_date = datetime.now().strftime("%d%m%Y")

    # Merge string
    key_name = f"security-group-{user_id}-{current_date}"
        
    return key_name