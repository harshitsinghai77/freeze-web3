// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// They cannot inherit from other smart contract
// they can only inherit from other interfaces

// They cannot declare a constructor
// They cannot declar state variables
// all declared functions have to be external

interface InterfaceHelloWorld {
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external;
}
