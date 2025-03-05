const Category = require("../models/categoryModel");
const handleAsync = require("../utils/handelAsync");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { CREATED, SuccessResponse } = require("../core/successResponse");
const handelAsync = require("../utils/handelAsync");

const createCategory = handelAsync(async (req, res, next) => {
    const { name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name.trim()) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        throw new BadRequestError("Tên này đã được sử dụng");
    }

    const newCategory = await new Category({ name }).save();

    const metadata = {
        newCategory,
    };

    const message = "Tạo danh mục mới thành công";

    return new CREATED({ metadata, message }).send(res);
});

const updateCategoryById = handelAsync(async (req, res, next) => {
    const category = await User.findById(req.params.id);

    if (!category) {
        throw new NotFoundError("Không tìm thấy danh mục.");
    }

    const { name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name.trim()) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    category.name = name;
    const updatedCategory = await category.save();

    const metadata = {
        updatedCategory,
    };

    return new SuccessResponse({ metadata }).send(res);
});

module.exports = {
    createCategory,
};
