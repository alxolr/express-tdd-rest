const { createSandbox } = require("sinon");
const chai = require("chai");
const app = require("../../src/app");
const { ProfileMock, BestProfessionMock } = require("../mock.data");
const { JobsRepository } = require("../../src/repository/jobs");

chai.use(require("chai-http"));
const { Profile } = app.get("models");

describe("Controller Admin", () => {
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

  describe("GET /admin/best-profession", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the best profession route", async () => {
      sandbox
        .stub(JobsRepository.prototype, "findBestProfession")
        .resolves(BestProfessionMock);

      const response = await requester
        .get("/admin/best-profession")
        .query({ start: new Date("2022-01-01"), end: new Date("2022-12-31") })
        .set("profile_id", 1);

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response.body).to.be.deep.equal(BestProfessionMock);
    });
  });

  describe("GET /admin/best-client", () => {
    afterEach(() => {
      sandbox.restore();
    });

    it("should exist the best clients route", async () => {
      sandbox
        .stub(JobsRepository.prototype, "findBestPayingClients")
        .resolves([]);

      const response = await requester
        .get("/admin/best-clients")
        .query({ start: new Date("2022-01-01"), end: new Date("2022-12-31") })
        .set("profile_id", 1);

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response.body).to.be.deep.equal([]);
    });
  });
});
