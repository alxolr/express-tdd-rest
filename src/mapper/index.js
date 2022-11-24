function fullNameMapper(data) {
  let { firstName, lastName, ...rest } = data;

  return {
    ...rest,
    fullName: firstName + lastName,
  };
}

module.exports = { fullNameMapper };
