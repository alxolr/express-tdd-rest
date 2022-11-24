const { createSandbox } = require("sinon");
const chai = require("chai");
const app = require("../../src/app");
const { ProfileMock, ContractMock } = require("../mock.data");
const { Op } = require("sequelize");

chai.use(require("chai-http"));

const { Profile, Contract } = app.get("models");

describe("Controller Contracts", () => {
  let sandbox;
  let requester = chai.request(app).keepOpen();

  before(() => {
    sandbox = createSandbox();
  });

  after(() => {
    requester.close();
  });

  describe("GET /contracts/:id", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should exist the get contract by id route", async () => {
      sandbox.stub(Contract, "findOne").resolves(ContractMock);
      sandbox.stub(Profile, "findOne").resolves(ProfileMock);

      let response = await requester.get("/contracts/1").set("profile_id", 1);

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response.body).to.be.deep.equal(ContractMock);
    });
  });

  describe("GET /contracts", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the list contracts route", async () => {
      sandbox.stub(Contract, "findAll").resolves([ContractMock]);
      sandbox.stub(Profile, "findOne").resolves(ProfileMock);

      const response = await requester.get("/contracts").set("profile_id", 1);

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response.body).to.be.deep.equal([ContractMock]);
    });
  });
});
