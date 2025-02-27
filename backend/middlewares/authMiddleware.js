const { BadRequestError, AuthFailureError } = require("../core/errorResponse");
const handelAsync = require("../utils/handelAsync");

const protect = handelAsync(async (req, res, next) => {
    let token = req.cookies?.jwt || null;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AuthFailureError(
            "Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập!"
        );
    }

    try {
        // Xác minh token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Kiểm tra người dùng có tồn tại không
        const currentUser = await User.findById(
            decoded.id || decoded._id
        ).select("-password");
        if (!currentUser) {
            throw new AuthFailureError(
                "Người dùng thuộc token này không còn tồn tại."
            );
        }

        req.user = currentUser; // Gán thông tin user vào request
        next();
    } catch (error) {
        throw new AuthFailureError("Token không hợp lệ hoặc đã hết hạn!");
    }
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AuthFailureError(
                "Bạn không có quyền để làm hành động này!"
            );
        }
        next();
    };
};

module.exports = { protect, restrictTo };
