from pysui import SuiConfig, SyncClient, SuiAddress
from pysui.sui.sui_txn import SyncTransaction

SUI_NETWORK_ENPOINT = "https://fullnode.testnet.sui.io";
SUI_VIEW_TXN_ENPOINT = "https://suiscan.xyz/testnet/tx";
SUI_VIEW_OBJECT_ENPOINT = "https://suiscan.xyz/testnet/object";

config = SuiConfig.user_config(
    rpc_url=SUI_NETWORK_ENPOINT
)

_client = SyncClient(config)

def get_sui_client():
    return _client

def get_txn(sender_address):
    return SyncTransaction(_client, initial_sender=SuiAddress(sender_address))

def verify_sui_address(address):
    try:
        # Attempt to get the balance or owned objects
        _client.get_balance(address)
        return True
    except Exception as e:
        # If there's an error, the address might be invalid
        print(f"Address verification failed: {e}")
        return False

def get_movecall_target(address, module, fn):
    return "{address}::{module}::{fn}".format(address=address, module=module, fn=fn)