import { ethers } from "ethers";

import HelloWorldContract from "../contracts/HelloWorld.json";

export const loadHelloWorldContract = (provider) => {
  const helloWorldContract = new ethers.Contract(
    "0x19D2CF2244df78401F94C05104F0740E3b98B8b6",
    HelloWorldContract.abi,
    provider
  );
  helloWorldContract.connect();
  return helloWorldContract;
};
