// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./InterfaceHelloWorld.sol";

contract HelloWorld is Owned, Logger, InterfaceHelloWorld {
    uint256 public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint256 => address) private lookupFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount < 5000000000000000000,
            "Cannot withdraw more than 1 ether"
        );
        _;
    }

    // this is a special functions
    // it's called when you make tx that doesn't specify
    // function name to call.

    // External function are part of the contract inteface
    // which mean they can be called via contracts and other txs
    receive() external payable {}

    function test() external onlyOwner {
        // some function
    }

    function test1() external onlyOwner {
        // some function
    }

    function emitLog() public pure override returns (bytes32) {
        return "Hello world";
    }

    function addFunds() external payable override {
        address funder = msg.sender;
        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lookupFunders[index] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lookupFunders[i];
        }

        return _funders;
    }

    function getfFunderAtIndex(uint8 index) external view returns (address) {
        return lookupFunders[index];
    }
}

// Two types of functions, pure and view.
// pure and view are read-only call, no gas free.
// view - it indicates that the functions will not alter the storage state in any way.
// pure - even more strict, indicating that it won't even read the storage state.

// Transactions (can generate state change) and require gas fee
