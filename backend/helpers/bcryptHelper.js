const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8);
};

const comparePassword = async (passwordFromUser, passwordInDb) => {
    return await bcrypt.compare(passwordFromUser, passwordInDb);
};
module.exports = { hashPassword, comparePassword };
