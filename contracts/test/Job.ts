import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { assert, expect } from "chai";
import hre, { ethers } from "hardhat";

//the tests below achieve 100% branch coverage (can be checked by running 'npx hardhat coverage')
//(inspired by lock example)

describe("Job", async function () {
    async function deployJobFixture() {
        const [freelancer, client] = await ethers.getSigners();
        const amount = ethers.parseEther("1.0");
        const daysOfWork = 3
        const Job = await hre.ethers.getContractFactory("Job");
        const job = await Job.deploy(freelancer.address, amount, daysOfWork);

        return { job, amount, daysOfWork, freelancer, client };
    };

    it("Should deploy correctly", async function () {
        const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();

        expect(await job.freelancer()).to.equal(freelancer.address)
        expect(await job.daysOfWork()).to.equal(daysOfWork)
        expect(await job.amount()).to.equal(amount)
    });

    describe("hiring: ", function () {
        it("Should allow clients to hire a freelancer", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();

            await job.connect(client).hire({ value: amount })
            expect(await job.client()).to.equal(client.address)
        });
        it("Should dissallow freelancers from hiring themselves", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();

            await expect(job.hire({ value: amount })).to.be.revertedWith(
                "Freelancer cannot hire himself");
        });

        it("Should dissallow freelancers from being hired twice by the same person", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();

            await job.connect(client).hire({ value: amount })
            await expect(job.connect(client).hire({ value: amount })).to.be.revertedWith(
                "No one can have hired freelancer yet");
        });

        it("Should dissallow an active job to be hired twice by different people", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            const [client2] = await ethers.getSigners();

            await job.connect(client).hire({ value: amount })
            await expect(job.connect(client2).hire({ value: amount })).to.be.revertedWith(
                "No one can have hired freelancer yet");
        });

        it("Should dissallow a freelancer being hired by a client that has inssuficient funds", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            const insufficientAmount = ethers.parseEther("0.5");

            await expect(job.connect(client).hire({ value: insufficientAmount })).to.be.revertedWith(
                "Not enough ETH for job");
        });
    })
    describe("delivery: ", function () {
        it("Should be possible to deliver within the deadline completion", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await expect(job.connect(freelancer).deliver()).to.not.be.reverted
        });
        it("Should not be able to deliver when the deadline has passed", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(daysOfWork * 86400 + 1) //seconds in a day plus one
            await expect(job.connect(freelancer).deliver()).to.be.revertedWith("Deadline can not have been passed yet");
        });
        it("Should not let the freelancer deliver if he has not been hired yet", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await time.increase(daysOfWork * 86400 + 1) //seconds in a day plus one
            await expect(job.connect(freelancer).deliver()).to.be.revertedWith("Freelancer has not been hired yet");
        });
    })
    describe("approval", function () {
        it("Should make the transfer upon completion of the freelancer and approval by the client", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await job.connect(freelancer).deliver()
            await expect(job.connect(client).approve()).to.changeEtherBalance(freelancer, amount);
        });
        it("Should not be possible for approval to work if the job has not been completed yet ", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(7 * 86400)
            await expect(job.connect(client).approve()).to.be.revertedWith("Freelancer has not delivered product yet")
        });
        it("Should not be possible for the freelancer themselves to approve of the product", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(7 * 86400 + 1)
            await expect(job.connect(freelancer).approve()).to.be.revertedWith("Freelancer cannot approve")
        });
        it("Should transfer when the client has failed approving for 7 days", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await job.connect(freelancer).deliver()

            await time.increase(7 * 86400 + 1) //seconds in a day plus one (times 7 because client has seven days to approve)

            await expect(job.connect(freelancer).claimAutoApproval()).to.changeEtherBalance(freelancer, amount);
        });
        it("Should not be possible for auto approval to work if the client is within the 7 day timeframe", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await job.connect(freelancer).deliver()
            await time.increase(6 * 86400)
            await expect(job.connect(freelancer).claimAutoApproval()).to.be.revertedWith("Approval deadline has not passed yet")
        });
        it("Should not be possible for auto approval to work if the job has not been completed yet ", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(7 * 86400 + 1)
            await expect(job.connect(freelancer).claimAutoApproval()).to.be.revertedWith("Freelancer has not delivered product yet")
        });
        it("Should not be possible for a client to call the auto approval function ", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(7 * 86400 + 1)
            await expect(job.connect(client).claimAutoApproval()).to.be.revertedWith("Client cannot request auto approval")
        });
    })
    describe("refund: ", function () {
        //refund:
        it("Should  not allow a refund if the job has already been completed", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await job.connect(freelancer).deliver()
            await expect(job.connect(client).getRefund()).to.be.revertedWith("Freelancer has already submitted work");
        })
        it("Should allow client to get a refund if the deadline has passed", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await time.increase(daysOfWork * 86400 + 1) //seconds in a day plus one
            await expect(job.connect(client).getRefund()).to.changeEtherBalance(client, amount);
        })
        it("Should not allow client to get a refund if the deadline has not passed yet", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await job.connect(client).hire({ value: amount });
            await expect(job.connect(client).getRefund()).to.be.revertedWith("Deadline has not passed yet");
        })
        it("Should only allow the client to get a refund", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            const [client2] = await ethers.getSigners();

            await job.connect(client).hire({ value: amount });
            await time.increase(daysOfWork * 86400 + 1) //seconds in a day plus one
            await expect(job.connect(client2).getRefund()).to.be.revertedWith("Only clients can request refunds")
        });
        it("Should only allow the client to get a refund if the freelancer has been hired", async function () {
            const { job, amount, daysOfWork, freelancer, client } = await deployJobFixture();
            await time.increase(daysOfWork * 86400 + 1) //seconds in a day plus one
            await expect(job.connect(client).getRefund()).to.be.revertedWith("Freelancer has not been hired yet")
        });
    })
})