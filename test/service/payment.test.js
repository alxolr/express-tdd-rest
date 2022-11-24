const { createSandbox } = require("sinon");
const chai = require("chai");
const { sequelize } = require("../../src/model");

const { PaymentService } = require("../../src/service/payment");
const { JobsRepository } = require("../../src/repository/jobs");
const {
  JobSuccesfulTransaction,
  TransactionMock,
  JobNotEnoughClientMoneyMock,
} = require("./mock.data");

describe("PaymentService", () => {
  let sandbox;
  const service = new PaymentService();

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("pay should throw error balance not enough", async () => {
    sandbox.stub(sequelize, "transaction").resolves(TransactionMock);
    sandbox.stub(JobsRepository.prototype, "getJob").resolves({ paid: 1 });

    try {
      await service.pay(10);
      chai.expect(true).to.be.false; // this should not be executed
    } catch (err) {
      chai.expect(err.message).to.contain("Job already paid");
    }
  });

  it("pay should throw error if client has not enough money", async () => {
    sandbox.stub(sequelize, "transaction").resolves(TransactionMock);
    sandbox
      .stub(JobsRepository.prototype, "getJob")
      .resolves(JobNotEnoughClientMoneyMock);

    try {
      await service.pay(10);
      chai.expect(true).to.be.false; // this should not be executed
    } catch (err) {
      chai.expect(err.message).to.contain("balance is not enough");
    }
  });

  it("pay should be succesful if all validations passes", async () => {
    sandbox.stub(sequelize, "transaction").resolves(TransactionMock);
    sandbox
      .stub(JobsRepository.prototype, "getJob")
      .resolves(JobSuccesfulTransaction);

    await service.pay(10);

    chai
      .expect(JobSuccesfulTransaction.Contract.Contractor.balance)
      .to.be.equal(150);
  });
});
