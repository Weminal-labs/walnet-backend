from datetime import datetime

def generate_keypair_name(address):
    # Get date format ddmmyyyy
    current_date = datetime.now().strftime("%d%m%Y")

    # Merge string
    key_name = f"keypair-{address}-{current_date}"
        
    return key_name

def generate_security_group_name(address):
    # Get date format ddmmyyyy
    current_date = datetime.now().strftime("%d%m%Y")

    # Merge string
    key_name = f"security-group-{address}-{current_date}"
        
    return key_name