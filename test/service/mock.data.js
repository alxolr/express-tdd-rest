module.exports.TransactionMock = {
  async commit() {},
  async rollback() {},
};

module.exports.JobNotEnoughClientMoneyMock = {
  paid: null,
  Contract: {
    Client: {
      balance: 100,
    },
  },
  price: 250,
};

module.exports.JobSuccesfulTransaction = {
  paid: null,
  Contract: {
    Contractor: {
      balance: 50,
      save() {},
    },
    Client: {
      balance: 100,
      async save() {},
    },
  },
  price: 100,
  async save() {},
};
