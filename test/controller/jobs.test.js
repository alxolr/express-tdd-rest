const { createSandbox } = require("sinon");
const chai = require("chai");
const app = require("../../src/app");
const { ProfileMock, JobMock } = require("../mock.data");
const { PaymentService } = require("../../src/service/payment");
const { JobsRepository } = require("../../src/repository/jobs");

chai.use(require("chai-http"));
const { Profile } = app.get("models");

describe("Controller Jobs", () => {
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

  describe("GET /jobs/unpaid", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the unpaid jobs route", async () => {
      sandbox
        .stub(JobsRepository.prototype, "getUnpaidJobs")
        .resolves([JobMock]);
      let response = await requester.get("/jobs/unpaid").set("profile_id", 1);

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response.body).to.be.deep.equal([JobMock]);
    });
  });

  describe("POST /jobs/:job_id/pay", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the pay job route", async () => {
      sandbox.stub(PaymentService.prototype, "pay").resolves();
      const response = await requester.post("/jobs/1/pay").set("profile_id", 1);

      chai.expect(response.status).to.be.equal(204);
    });
  });
});
