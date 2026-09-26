pragma solidity ^0.8.28;

enum State {
    Created,
    Hired,
    Completed,
    Refunded
}

contract Job {
    address public immutable freelancer;
    address public client;
    uint256 public immutable amount; //amount of eth the client pays the freelancer for completing the job
    uint256 public immutable daysOfWork; //amount of days until job should be completed
    uint256 public deadline; //timestamp of when it has to be complete
    uint256 public approvalDeadline;
    State public state;

    constructor(address _freelancer, uint256 _amount, uint256 _daysOfWork) {
        amount = _amount;
        daysOfWork = _daysOfWork;
        freelancer = _freelancer;
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
        approvalDeadline = block.timestamp + (7 * 1 days);
    }
    function approve() public { //fixes arbitrary-send-eth vulnerability: client has to approve of the delivered product first
        require(client == msg.sender, "Freelancer cannot approve");
        require(state == State.Completed, "Freelancer has not delivered product yet");
        payable(freelancer).transfer(amount);
    }

    function claimAutoApproval() public { //if the client has not approved of the product after 7 days, the freelancer should be transferred the amount automatically
        require(freelancer ==  msg.sender, "Client cannot request auto approval");
        require(state == State.Completed, "Freelancer has not delivered product yet");
        require(approvalDeadline <= block.timestamp, "Approval deadline has not passed yet");
        
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
