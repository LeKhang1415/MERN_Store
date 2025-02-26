const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8);
};

const comparePassword = async (passwordInDb, passwordFromUser) => {
    return bcrypt.compare(passwordInDb, passwordFromUser);
};
module.exports = { hashPassword, comparePassword };
