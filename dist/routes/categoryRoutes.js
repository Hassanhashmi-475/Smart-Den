"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryService_1 = require("../controllers/CategoryService");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/add', CategoryService_1.createCategory);
categoryRouter.get('/', CategoryService_1.getAllCategoriesForUser);
categoryRouter.get('/:id', CategoryService_1.getCategoryByIdForUser);
categoryRouter.put('/:id', CategoryService_1.updateCategoryById);
categoryRouter.delete('/:id', CategoryService_1.deleteCategoryById);
exports.default = categoryRouter;
//# sourceMappingURL=categoryRoutes.js.map