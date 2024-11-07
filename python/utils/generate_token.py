import hashlib
import os

def generate_token(userId):
    # create salt from userId 
    salt = str(userId).encode('utf-8')
    
    # Create a random value 16 byte
    randomValue = os.urandom(16)  
    
    # Combine salt and random value
    token = hashlib.sha256(salt + randomValue).hexdigest()
    
    return token
