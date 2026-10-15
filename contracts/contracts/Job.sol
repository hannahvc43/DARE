pragma solidity ^0.8.28;

enum State {
    Created,
    Hired,
    Completed,
    Refunded,
    Approved
}

contract Job {
    address public immutable freelancer;
    address public client;
    uint256 public immutable amount; //amount of eth the client pays the freelancer for completing the job
    uint256 public immutable minutesOfWork; //amount of minutes until job should be completed
    uint256 public deadline; //timestamp of when it has to be complete
    uint256 public approvalDeadline;
    State public state;

    constructor(address _freelancer, uint256 _amount, uint256 _minutesOfWork) {
        require(_freelancer != address(0), "Freelancer address cannot be zero"); //avoid missing-zero-check
        amount = _amount;
        minutesOfWork = _minutesOfWork;
        freelancer = _freelancer;
        state = State.Created;
    }

    function getRefund() public {
        require(state != State.Created, "Freelancer has not been hired yet");
        require(state != State.Completed, "Freelancer has already submitted work");
        require(state == State.Hired, "Freelancer has to be hired");
        require(msg.sender == client, "Only clients can request refunds");
        require(block.timestamp > deadline, "Deadline has not passed yet");

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
        approvalDeadline = block.timestamp + (7 days);
    }
    function approve() public { //fixes arbitrary-send-eth vulnerability: client has to approve of the delivered product first
        require(client == msg.sender, "Freelancer cannot approve");
        require(state == State.Completed, "Freelancer has not delivered product yet");
        
        state = State.Approved;

        payable(freelancer).transfer(amount);
    }

    function claimAutoApproval() public { //if the client has not approved of the product after 7 days, the freelancer should be transferred the amount automatically
        require(freelancer ==  msg.sender, "Client cannot request auto approval");
        require(state == State.Completed, "Freelancer has not delivered product yet");
        require(approvalDeadline <= block.timestamp, "Approval deadline has not passed yet");
        
        state = State.Approved; //Change state so freelancer cannot try to claim auto-approval twice

        payable(freelancer).transfer(amount);
    }

    function hire() public payable {
        require(msg.value == amount, "Not enough ETH for job");
        require(state == State.Created, "No one can have hired freelancer yet"); //todo: fix unclear wording
        require(msg.sender != freelancer, "Freelancer cannot hire himself");

        client = payable(msg.sender);
        state = State.Hired;
        deadline = block.timestamp + (minutesOfWork * 1 minutes);
    }
}
