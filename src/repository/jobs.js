const { Contract, Job, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

class JobsRepository {
  async getTotalJobsCost(clientId, trx) {
    const query = {
      where: {
        paid: { [Op.is]: null },
      },
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          where: {
            ClientId: clientId,
          },
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
              attributes: [],
            },
          ],
        },
      ],
      attributes: [[sequelize.fn("SUM", sequelize.col("price")), "total"]],
      raw: true,
    };

    return Job.findOne(query, { transaction: trx });
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
