const HelloWorldContract = artifacts.require("HelloWorld");

module.exports = function (depoloyer) {
  depoloyer.deploy(HelloWorldContract);
};
