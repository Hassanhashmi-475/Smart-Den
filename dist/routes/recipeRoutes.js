"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RecipeService_1 = require("../controllers/RecipeService");
const recipeRouter = (0, express_1.Router)();
recipeRouter.get('/', RecipeService_1.getAllRecipe);
recipeRouter.post('/generate', RecipeService_1.generateRecipe);
recipeRouter.put('/:id', RecipeService_1.updateRecipe);
recipeRouter.delete('/:id', RecipeService_1.deleteRecipe);
exports.default = recipeRouter;
//# sourceMappingURL=recipeRoutes.js.map