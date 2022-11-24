const { Contract } = require("../model");

class ContractsRepository {
  async listNonTerminatedContracts(profileId) {
    const query = {
      where: {
        [Op.and]: {
          status: { [Op.not]: "terminated" },
          [Op.or]: { ContractorId: profileId, ClientId: profileId },
        },
      },
    };

    return Contract.findAll(query);
  }

  async findContractOwnedBy(id, profileId) {
    const query = {
      where: {
        [Op.and]: {
          id,
          [Op.or]: { ContractorId: profileId, ClientId: profileId },
        },
      },
    };

    return Contract.findOne(query);
  }
}

module.exports = { ContractsRepository };
