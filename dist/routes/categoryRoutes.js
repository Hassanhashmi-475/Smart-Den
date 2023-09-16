"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryService_1 = require("../controllers/CategoryService");
const Auth_1 = require("../config/Auth");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/add', Auth_1.isAuth, CategoryService_1.createCategory);
categoryRouter.get('/', Auth_1.isAuth, CategoryService_1.getAllCategoriesForUser);
categoryRouter.get('/:id', Auth_1.isAuth, CategoryService_1.getCategoryByIdForUser);
categoryRouter.put('/:id', CategoryService_1.updateCategoryById);
categoryRouter.delete('/:id', CategoryService_1.deleteCategoryById);
exports.default = categoryRouter;
//# sourceMappingURL=categoryRoutes.js.map