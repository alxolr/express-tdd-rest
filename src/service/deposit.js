const { JobsRepository } = require("../repository/jobs");
const { sequelize, Profile } = require("../model");

class DepositService {
  constructor() {
    this.jobRepo = new JobsRepository();
    this.profileRepo = Profile;
  }

  async deposit(clientId, amount) {
    const trx = await sequelize.transaction();

    try {
      const [{ total }, client] = await Promise.all([
        this.jobRepo.getTotalJobsCost(clientId, trx),
        this.profileRepo.findByPk(clientId, { transaction: trx }),
      ]);

      if (amount < total * 0.25) {
        client.balance += amount;

        await this.profileRepo.update(client, { where: { id: client.id } });
      } else {
        throw new Error(
          "Client can't deposit more than 25% of his total jobs to pay"
        );
      }

      await trx.commit();
    } catch (err) {
      await trx.rollback();

      throw err;
    }
  }
}

module.exports = { DepositService };
