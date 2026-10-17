# DareLance: End-to-end decentralized application on Ethereum
Project for Fourth ACM Europe Summer School on Distributed and Replicated Environments (DARE 2026).

## How to run
The application consists of two main components:
1) **A web server** (found in the webserver folder)
2) **A local testnet**: For developing the smart contract, the framework Hardhat was used, which allows us to simulate an Ethereum blockchain network locally. It also provides fake pre-funded accounts with 10,000 ETH each.

To run the application, you must keep two terminals running simultaneously:

```sh
# run the webserver;
cd webserver
npm install
npm run dev
```

```sh
# run the local blockchain node:
cd contracts
npm install
npx hardhat compile
npx hardhat node
```

As mentioned, when running the local testnet, hardhat gives us ten accounts along with their private keys.
In metamask we can then import these accounts using this key (using Add wallet -> Import an account). We also need to add the local network to metamask:
Go to Networks>Add custom network:
- RPC URL: [http://127.0.0.1:8545](http://127.0.0.1:8545)
- chain id: 31337

Once this has been done you can click the connect wallet button on the top right and start using your test account to use the application.

> **Common Bug Fixes:**
> If you encounter transaction errors during testing, clean your local wallet cache (settings > developer tools > delete activity and nonce data).
> If you have multiple tabs open during testing, make sure to always have the right account selected. As a switch in MetaMask might cause a switch for all tabs.


## Technical decisions and details

### Tech stack
- **Hardhat**: Used for developing, testing and deploying smart contract. Also provides us with a local testnet node, along with pre-funded accounts. The smart contract itself can be found in contracts/contracts/Job.sol
- **SvelteKit**: Framework used for developing the UI
- **Supabase**: backend platform which offers a relational database

### Tests

The smart contract was thoroughly tested using unit tests (found in contracts/test/Job.ts), these test can be ran using the npx hardhat test command.
Reaching 100% branch coverage (can be tested by running npx hardhat coverage).


## Static Analysis
For staticaly analyzing the smart contract, the tool [*Slither*](https://github.com/crytic/slither) was used. 

An important vulnerability (severity level high) that the tool uncovered is the arbitray-send-eth vulnerability [https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations](https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations). This occurs when a function sending Ether to an arbitrary address, without protection. In the contract, when the freelancer would submit their work, the ETH would be automatically transferred to the freelancer address.In order to have the client explicitly authorize this, the contract was altered to first only have the client approve the work first, before any transfers are made.

Another vulnerability was as missing zero check when assigning the freelancer address. [https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation](https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation)
As well as some fields that should have been made immutable.

## Stretch goal: safety and liveness properties of your smart contract + formal veriﬁcation of Solidity smart contracts
- Safety "bad things never happen":

    The following properties are enforced because of the preconditions (require) and the use of a state to indicate where in the job's process we are.

    - A freelancer cannot deliver before being hired or after the deadline has passed
    - Only the client can approve of the delivered work
    - The client cannot ask for a refund before the deadline, or after delivery
    - The freelancer cannot be paid twice
- Liveness "something good eventually happens":
    - A hired job can be completed if the freelancer delivers within the deadline
    - The client can recover their ETH if the deadline is missed
    - The freelancer can claim their payment if the client does not approve of the product within seven days.

    However there is one thing regarding liveness that could be improved on: 
    One case I forgot about is if the submission deadline is passed, and the client never requests a refund, the ETH will be trapped inside the contract indefinetly. Or if the approvement dedline has passed, and the freelancer never requests their funds.

    Regarding formal verificaton tools for verifying these properties, SMTChecker is built-in formal verification module for the Solidity compiler.
    The properties above are enforced using pre- and postconditions using require and assert statements.
    SMT stands for Satisfiability Modulo Theory, so it will treat the require statements in the Solidity code as assumptions and tries to prove whether the corresponding assertions hold for all possible execution paths.
    
    > As this is a stretch goal, I did not look into it in depth, and I did not test the SMTChecker tool out for my smart contract.

