const User = require("../models/userModel");

// create new user
const createNewUser = async (data) => {
    const newUser = await User.create(data);
    return newUser.toObject(); // Lấy dữ liệu thô
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

module.exports = {
    createNewUser,
    getUserByEmail,
};
