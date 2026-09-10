pragma solidity ^0.8.28;


enum State {Created, Hired, Completed, Refunded}

contract Job {

address public freelancer;
address public client;
uint256 public amount; //amount of eth the client pays the freelancer for completing the job
uint256 public deadline; //amount of days until job should be completed
State public state;

constructor(uint256 _amount, uint256 _deadline) {
    amount = _amount;
    deadline = _deadline;
    freelancer = msg.sender;
}

function hire() public payable  {
    require(msg.value == amount, "Not enough ETH for job");
    require(state == State.Created, "No one can have hired freelancer yet");

    client = msg.sender;
    currentState = State.Hired
}
}    