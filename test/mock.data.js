module.exports.ProfileMock = {
  id: 1,
  firstName: "Harry",
  lastName: "Potter",
  profession: "Wizard",
  balance: 1150,
  type: "client",
};

module.exports.ContractMock = {
  id: 1,
  terms: "bla bla bla",
  status: "terminated",
  ClientId: 1,
  ContractorId: 5,
};

module.exports.JobMock = {
  description: "work",
  price: 21,
  paid: true,
  paymentDate: "2020-08-10T19:11:26.737Z",
  ContractId: 1,
};
