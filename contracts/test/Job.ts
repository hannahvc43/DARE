import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { assert, expect } from "chai";
import hre, { ethers } from "hardhat";

//inspired by lock example:
describe("Job", function () {
  async function deployJobFixture() {
    const [freelancer, client] = await ethers.getSigners();
    const amount = ethers.parseEther("1.0");
    const daysOfWork = 3
    const Job = await hre.ethers.getContractFactory("Job");
    const job = await Job.deploy(amount, daysOfWork);

    return {job, amount, daysOfWork, freelancer, client };
  };

  it("should deploy correctly", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();

    expect(await job.freelancer()).to.equal(freelancer.address)
    expect(await job.daysOfWork()).to.equal(daysOfWork)
    expect(await job.amount()).to.equal(amount)
  });

  it("should allow clients to hire a freelancer", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();
    await job.connect(client).hire({value: amount}) 
    expect(await job.client()).to.equal(client.address) 
  });
  it("should dissallow freelancers from hiring themselves", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();
    await expect(job.hire({value: amount})).to.be.revertedWith(
    "Freelancer cannot hire himself");});
  
  it("should dissallow freelancers from being hired twice by the same person", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();
    await job.connect(client).hire({value: amount}) 
    await expect(job.connect(client).hire({value: amount})).to.be.revertedWith(
    "No one can have hired freelancer yet");});

  it("should dissallow an active job to be hired twice by different people", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();
    const [client2] = await ethers.getSigners();

    await job.connect(client).hire({value: amount}) 
    await expect(job.connect(client2).hire({value: amount})).to.be.revertedWith(
    "No one can have hired freelancer yet");});

   it("should dissallow a freelancer being hired by a client that has inssuficient funds", async function () {
    const {job, amount, daysOfWork, freelancer, client} = await deployJobFixture();
    const insufficientAmount = ethers.parseEther("0.5");

    
    await expect(job.connect(client).hire({value: insufficientAmount})).to.be.revertedWith(
    "Not enough ETH for job");}); 

})