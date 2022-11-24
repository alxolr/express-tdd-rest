const { createSandbox } = require("sinon");
const chai = require("chai");
const app = require("../../src/app");

chai.use(require("chai-http"));

const { Profile } = app.get("models");

describe("Middleware getProfile", () => {
  let sinon;
  let requester = chai.request(app).keepOpen();

  before(() => {
    sinon = createSandbox();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    requester.close();
  });

  it("should return 401 if profile is not set in the header", async () => {
    sinon.stub(Profile, "findOne").resolves(null);
    let response = await requester.get("/");

    chai.expect(response.status).to.be.equal(401);
  });

  it("should return 401 if profile is not in the database", async () => {
    sinon.stub(Profile, "findOne").resolves(null);
    let response = await requester.get("/").set("profile_id", 1);

    chai.expect(response.status).to.be.equal(401);
  });
});
