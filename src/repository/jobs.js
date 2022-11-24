const { Contract, Job, Profile, sequelize } = require("../model");
const { Op } = require("sequelize");

class JobsRepository {
  async findBestPayingClients(start, end, limit = 2) {
    const query = {
      where: {
        paid: 1,
        createdAt: { [Op.gte]: start },
        paymentDate: { [Op.lte]: end },
      },
      include: [
        {
          model: Contract,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [],
            },
          ],
        },
      ],
      group: ["Contract.Client.id"],
      attributes: [
        [sequelize.col("Contract.Client.id"), "id"],
        [sequelize.col("Contract.Client.firstName"), "firstName"],
        [sequelize.col("Contract.Client.lastName"), "lastName"],
        [sequelize.fn("SUM", sequelize.col("price")), "paid"],
      ],
      order: [[sequelize.col("paid"), "DESC"]],
      limit,
      raw: true,
    };

    return Job.findAll(query);
  }

  async findBestProfession(start, end) {
    const query = {
      where: {
        paid: 1,
        createdAt: { [Op.gte]: start },
        paymentDate: { [Op.lte]: end },
      },
      include: [
        {
          model: Contract,
          attributes: [],
          include: [{ model: Profile, as: "Contractor", attributes: [] }],
        },
      ],
      group: ["Contract.Contractor.profession"],
      attributes: [
        [sequelize.col("Contract.Contractor.profession"), "profession"],
        [sequelize.fn("SUM", sequelize.col("price")), "total"],
      ],
      order: [[sequelize.col("total"), "DESC"]],
      raw: true,
    };

    return Job.findOne(query);
  }

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
