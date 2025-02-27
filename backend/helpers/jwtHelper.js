const jwt = require("jsonwebtoken");

const verifyOptions = {
    expiresIn: "24h",
    algorithm: ["RS256"],
};
const signOptions = {
    expiresIn: "24h",
};

const generateToken = (payload, res) => {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, signOptions);

    // Thiết lập cookie chứa token
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Chỉ bật secure khi không phải môi trường dev
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return token;
};

module.exports = {
    generateToken,
};
