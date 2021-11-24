from web3 import Web3
from decimal import Decimal

import json

instance = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

with open("build/contracts/HelloWorld.json") as json_file:
    artifact = json.load(json_file)
    
contract_add = artifact['networks']['5777']['address']
contract = instance.eth.contract(address=contract_add, abi=artifact['abi'])

acc_address = instance.eth.accounts[3]

contract_function = contract.functions.addFunds()
contract_function.transact({"from": acc_address, "value": 2000000000000000000})
contract_function.transact(
    {"from": instance.eth.accounts[2], "value": 500000000000000000}
)

funder = contract.functions.getfFunderAtIndex(0).call()
print("funder: ", funder)

all_funders = contract.functions.getAllFunders().call()
print("all_funders: ", all_funders)

amount = Web3.toWei(Decimal("0.2"), "ether")
withdraw = contract.functions.withdraw(amount).transact({"from": acc_address})

amount = Web3.toWei(Decimal("0.48"), "ether")
withdraw = contract.functions.withdraw(amount).transact({"from": acc_address})

# This should throw error because these are onlyOwner functions defined in smart contract.
# Only owner should be able to call these functions.
contract_function = contract.functions.test().transact({"from": instance.eth.accounts[0]})
contract_function = contract.functions.test1()

num = contract.functions.getTestNum().call()
print('num: ', num)

test_bytes = contract.functions.getTestString().call()
print('test_string: ', Web3.toText(test_bytes))
