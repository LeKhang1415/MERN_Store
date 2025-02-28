const User = require("../models/userModel");
const handleAsync = require("../utils/handelAsync");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { CREATED, SuccessResponse } = require("../core/successResponse");
const { createNewUser, getUserByEmail } = require("../services/userService");
const { hashPassword, comparePassword } = require("../helpers/bcryptHelper");
const { generateToken } = require("../helpers/jwtHelper");
const handelAsync = require("../utils/handelAsync");
const { filterObj } = require("../utils");

const createUser = handleAsync(async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError("Email đã được sử dụng");
    }

    // Tạo và lưu user mới

    const hashedPassword = await hashPassword(password);

    const newUser = await createNewUser({
        email,
        password: hashedPassword,
        name,
    });

    const payload = { id: newUser._id };

    const token = generateToken(payload, res);

    const metadata = {
        user: newUser,
        token,
    };

    const message = "Tạo user mới thành công";

    return new CREATED({ metadata, message }).send(res);
});

const login = handleAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    const userHolder = await getUserByEmail(email);
    if (!userHolder) throw new NotFoundError("Người dùng chưa đăng kí!");

    // So sánh mật khẩu
    const isPassword = await comparePassword(password, userHolder.password);
    if (!isPassword) throw new BadRequestError("Sai mật khẩu");

    const payload = { id: userHolder._id };

    const token = generateToken(payload, res);

    const metadata = {
        token,
    };

    const message = "Đăng nhập thành công";

    return new SuccessResponse({ metadata, message }).send(res);
});

const logout = handleAsync(async (req, res, next) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Xóa cookie ngay lập tức
    });

    const message = "Đăng xuất thành công";

    return new SuccessResponse({ message }).send(res);
});

const getAllUser = handelAsync(async (req, res, next) => {
    const users = await User.find({});

    const metadata = {
        result: users.length,
        users,
    };

    return new SuccessResponse({ metadata }).send(res);
});

const getCurrentUserProfile = handelAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) throw new NotFoundError("Không tìm thấy user");

    const metadata = {
        userId: user._id,
        name: user.name,
        email: user.email,
    };

    return new SuccessResponse({ metadata }).send(res);
});

const updateCurrentUserProfile = handelAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new NotFoundError("Không tìm thấy người dùng.");
    }

    // 1) Lọc ra các trường được phép cập nhật
    const filteredBody = filterObj(req.body, "name", "email", "password");

    // 2) Nếu cập nhật mật khẩu, phải hash trước khi lưu
    if (filteredBody.password) {
        filteredBody.password = await hashPassword(filteredBody.password);
    }

    // 3) Cập nhật tài liệu người dùng
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    const metadata = {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
    };

    return new SuccessResponse({ metadata }).send(res);
});

const getUserById = handelAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) throw new NotFoundError("Không tìm thấy user");

    const metadata = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const message = "Lấy user thành công";

    return new SuccessResponse({ metadata, message }).send(res);
});

const deleteUserById = handelAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) throw new NotFoundError("Không tìm thấy user");

    if (user.role === "admin")
        throw new BadRequestError("Không thể xóa user này");

    await User.deleteOne({ _id: user._id });

    const message = "Xóa user thành công";

    return new SuccessResponse({ message }).send(res);
});

const updateUserById = handelAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new NotFoundError("Không tìm thấy người dùng.");
    }

    // 1) Lọc ra các trường được phép cập nhật
    const filteredBody = filterObj(
        req.body,
        "name",
        "email",
        "password",
        "role"
    );

    // 2) Nếu cập nhật mật khẩu, phải hash trước khi lưu
    if (filteredBody.password) {
        filteredBody.password = await hashPassword(filteredBody.password);
    }

    // 3) Cập nhật tài liệu người dùng
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    const metadata = {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
    };

    return new SuccessResponse({ metadata }).send(res);
});

module.exports = {
    createUser,
    login,
    logout,
    getAllUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getUserById,
    deleteUserById,
    updateUserById,
};
