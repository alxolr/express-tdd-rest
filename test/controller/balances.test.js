const { createSandbox } = require("sinon");
const chai = require("chai");
const app = require("../../src/app");
const { ProfileMock } = require("../mock.data");
const { DepositService } = require("../../src/service/deposit");

chai.use(require("chai-http"));
const { Profile } = app.get("models");

describe("Controller Balances", () => {
  let sandbox;
  let requester = chai.request(app).keepOpen();

  before(() => {
    sandbox = createSandbox();
  });

  beforeEach(() => {
    sandbox.stub(Profile, "findOne").resolves(ProfileMock);
  });

  after(() => {
    requester.close();
  });

  describe("POST /balances/deposit/:user_id", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the deposit route", async () => {
      sandbox.stub(DepositService.prototype, "deposit").resolves();
      const response = await requester
        .post("/balances/deposit/4")
        .set("profile_id", 4)
        .send({
          amount: 40,
        });

      chai.expect(response.status).to.be.equal(204);
    });
  });
});
