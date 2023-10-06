"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryByIdForUser = exports.getAllCategoriesForUser = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, description } = req.body;
            // const createdBy = req.user
            //   ? new mongoose.Types.ObjectId(req.user._id)
            //   : undefined
            const category = new Category_1.default({
                name,
                description,
                // createdBy,
            });
            const savedCategory = yield category.save();
            res.status(201).json(savedCategory);
        }
        catch (error) {
            console.error('Error creating category:', error.message);
            res.status(500).json({ error: 'Failed to create category' });
        }
    });
}
exports.createCategory = createCategory;
function getAllCategoriesForUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const createdBy = req.user
            //   ? new mongoose.Types.ObjectId(req.user._id)
            //   : undefined
            const categories = yield Category_1.default.find();
            // .populate('createdBy')
            res.status(200).json(categories);
        }
        catch (error) {
            console.error('Error fetching categories:', error.message);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    });
}
exports.getAllCategoriesForUser = getAllCategoriesForUser;
function getCategoryByIdForUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryId = req.params.id;
            // const createdBy = req.user
            //   ? new mongoose.Types.ObjectId(req.user._id)
            //   : undefined
            const category = yield Category_1.default.findOne({ _id: categoryId });
            if (!category) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.status(200).json(category);
        }
        catch (error) {
            console.error('Error fetching category:', error.message);
            res.status(500).json({ error: 'Failed to retrieve category' });
        }
    });
}
exports.getCategoryByIdForUser = getCategoryByIdForUser;
function updateCategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryId = req.params.id;
            const { name, description } = req.body;
            const updatedCategory = yield Category_1.default.findByIdAndUpdate(categoryId, { name, description }, { new: true });
            if (!updatedCategory) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.status(200).json(updatedCategory);
        }
        catch (error) {
            console.error('Error updating category:', error.message);
            res.status(500).json({ error: 'Failed to update category' });
        }
    });
}
exports.updateCategoryById = updateCategoryById;
function deleteCategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryId = req.params.id;
            const deletedCategory = yield Category_1.default.findByIdAndRemove(categoryId);
            if (!deletedCategory) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting category:', error.message);
            res.status(500).json({ error: 'Failed to delete category' });
        }
    });
}
exports.deleteCategoryById = deleteCategoryById;
//# sourceMappingURL=CategoryService.js.map