const Category = require("../models/categoryModel");
const handleAsync = require("../utils/handelAsync");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { CREATED, SuccessResponse } = require("../core/successResponse");
const handelAsync = require("../utils/handelAsync");

const createCategory = handleAsync(async (req, res, next) => {
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

const updateCategoryById = handleAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);

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

const deleteCategoryById = handleAsync(async (req, res, next) => {
    const deletedCategory = await Category.findByIdAndRemove(
        req.params.categoryId
    );

    if (!deletedCategory) {
        throw new NotFoundError("Không tìm thấy danh mục.");
    }

    const metadata = {
        deletedCategory,
    };

    return new SuccessResponse({ metadata }).send(res);
});

const getAllCategory = handelAsync(async (req, res, next) => {
    const categories = await Category.find({});

    const metadata = {
        result: categories.length,
        categories,
    };

    return new SuccessResponse({ metadata }).send(res);
});

const getCategoryById = handelAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);

    if (!category) throw new NotFoundError("Không tìm thấy danh mục");

    const metadata = {
        category,
    };

    return new SuccessResponse({ metadata }).send(res);
});

module.exports = {
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getAllCategory,
    getCategoryById,
};
