// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

abstract contract Logger {
    uint256 public testNum;
    bytes32 public testStr;

    constructor() {
        testNum = 100;
        testStr = "fuckme";
    }

    function emitLog() public pure virtual returns (bytes32);

    function getTestNum() public view returns (uint256) {
        return testNum;
    }

    function getTestString() public view returns (bytes32) {
        return testStr;
    }
}
