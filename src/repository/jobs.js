const { Contract, Job, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

class JobsRepository {
  async getTotalJobsCost(clientId) {
    const query = {
      where: {
        paid: { [Op.is]: null },
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: ["ClientId"],
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
              where: { "$Profile.ClientId$": clientId },
            },
          ],
        },
      ],
      attributes: [sequelize.fn("SUM", sequelize.col("price"))],
      raw: true,
    };

    return Job.findAll(query);
  }

  async getUnpaidJobs(profileId) {
    const query = {
      where: {
        [Op.or]: [
          { "$Contract.ContractorId$": profileId },
          { "$Contract.ClientId$": profileId },
        ],

        "$Contract.status$": { [Op.not]: "terminated" },
      },
      include: [
        {
          model: Contract,
          required: true,
        },
      ],
    };

    return Job.findAll(query);
  }

  async getJob(id, trx) {
    const query = {
      where: {
        id,
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: ["ContractorId", "ClientId"],
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
            },
            {
              model: Profile,
              as: "Contractor",
              required: true,
            },
          ],
        },
      ],
    };

    return Job.findOne(query, { transaction: trx });
  }
}

module.exports = { JobsRepository };
