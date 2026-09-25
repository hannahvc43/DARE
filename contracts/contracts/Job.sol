pragma solidity ^0.8.28;

enum State {
    Created,
    Hired,
    Completed,
    Refunded
}

contract Job {
    address public freelancer;
    address public client;
    uint256 public amount; //amount of eth the client pays the freelancer for completing the job
    uint256 public daysOfWork; //amount of days until job should be completed
    uint256 public deadline; //timestamp of when it has to be complete
    State public state;

    constructor(uint256 _amount, uint256 _daysOfWork) {
        amount = _amount;
        daysOfWork = _daysOfWork;
        freelancer = msg.sender;
        state = State.Created;
    }

    function getRefund() public {
        require(state == State.Hired, "Freelancer has not been hired yet");
        require(msg.sender == client, "Only clients can request refunds");

        state = State.Refunded;
        payable(client).transfer(amount);
    }

    function deliver() public {
        require(state == State.Hired, "Freelancer has not been hired yet");
        require(
            block.timestamp <= deadline,
            "Deadline can not have been passed yet"
        );

        state = State.Completed;
        payable(freelancer).transfer(amount);
    }

    function hire() public payable {
        require(msg.value == amount, "Not enough ETH for job");
        require(state == State.Created, "No one can have hired freelancer yet"); //todo: fix unclear wording
        require(msg.sender != freelancer, "Freelancer cannot hire himself");

        client = payable(msg.sender);
        state = State.Hired;
        deadline = block.timestamp + (daysOfWork * 1 days);
    }
}
