const { createSandbox } = require("sinon");
const chai = require("chai");
const { sequelize, Profile } = require("../../src/model");

const { DepositService } = require("../../src/service/deposit");
const { JobsRepository } = require("../../src/repository/jobs");
const { TransactionMock } = require("./mock.data");

describe("DepositService", () => {
  let sandbox;
  const service = new DepositService();

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("deposit should throw error that the amount is bigger than 25% of the total jobs to pay", async () => {
    sandbox.stub(sequelize, "transaction").resolves(TransactionMock);
    sandbox
      .stub(JobsRepository.prototype, "getTotalJobsCost")
      .resolves({ total: 100 });
    sandbox.stub(Profile, "findByPk").resolves({ balance: 100 });

    try {
      await service.deposit(1, 100);
      chai.expect(true).to.be.false; // this should not be executed
    } catch (err) {
      chai
        .expect(err.message)
        .to.contain("deposit more than 25% of his total jobs to pay");
    }
  });

  it("deposit should pass", async () => {
    const client = { balance: 100, id: 10 };
    sandbox.stub(sequelize, "transaction").resolves(TransactionMock);
    sandbox
      .stub(JobsRepository.prototype, "getTotalJobsCost")
      .resolves({ total: 100 });
    sandbox.stub(Profile, "findByPk").resolves(client);
    sandbox.stub(Profile, "update").resolves();

    await service.deposit(1, 20);

    chai.expect(client.balance).to.be.equal(120);
  });
});
