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
exports.deleteRecipe = exports.getAllRecipe = exports.updateRecipe = exports.generateRecipe = void 0;
const axios_1 = __importDefault(require("axios"));
const Recipe_1 = __importDefault(require("../models/Recipe"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const console_1 = require("console");
function generateRecipe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pythonApiUrl = 'http://localhost:5000/generate_recipe';
            const items = req.body.items;
            const response = yield axios_1.default.post(pythonApiUrl, { texts: items });
            const generatedRecipes = response.data;
            const formattedRecipes = yield Promise.all(generatedRecipes.map((text) => __awaiter(this, void 0, void 0, function* () {
                const sections = text.split('\n');
                const formattedSections = [];
                let recipeObj = {};
                for (const section of sections) {
                    const cleanedSection = section.trim();
                    let headline;
                    if (cleanedSection.startsWith('title:')) {
                        headline = 'TITLE';
                        recipeObj.name = cleanedSection.replace(/title:/i, '').trim();
                    }
                    else if (cleanedSection.startsWith('ingredients:')) {
                        headline = 'INGREDIENTS';
                        recipeObj.ingredients = cleanedSection
                            .replace(/ingredients:/i, '')
                            .trim();
                    }
                    else if (cleanedSection.startsWith('directions:')) {
                        headline = 'DIRECTIONS';
                        recipeObj.directions = cleanedSection
                            .replace(/directions:/i, '')
                            .trim();
                    }
                    else {
                        continue;
                    }
                }
                recipeObj.user = req.user
                    ? new mongoose_1.default.Types.ObjectId(req.user._id)
                    : undefined;
                return new Recipe_1.default(recipeObj);
            })));
            // Save the generated recipes to the database
            const savedRecipes = yield Recipe_1.default.create(formattedRecipes);
            res.json(savedRecipes);
            console.log('Saved recipes:', savedRecipes);
        }
        catch (error) {
            console.error('Error generating and saving recipes:', error.message);
            res.status(500).json({ error: 'Failed to generate and save recipes.' });
        }
    });
}
exports.generateRecipe = generateRecipe;
function updateRecipe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipeId = req.params.id;
            const updatedData = req.body;
            const updatedRecipe = yield Recipe_1.default.findByIdAndUpdate(recipeId, updatedData, { new: true });
            if (!updatedRecipe) {
                return res.status(404).json({ error: 'Recipe not found.' });
            }
            res.json(updatedRecipe);
        }
        catch (error) {
            console.error('Error updating recipe:', error.message);
            res.status(500).json({ error: 'Failed to update the recipe.' });
        }
    });
}
exports.updateRecipe = updateRecipe;
function getAllRecipe(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
            (0, console_1.log)(email);
            const user = yield User_1.default.find({ email: email });
            console.log(user);
            const recipes = yield Recipe_1.default.find().populate({ path: 'user', select: '_id name email' });
            res.json(recipes);
        }
        catch (error) {
            console.error('Error fetching recipes:', error.message);
            res.status(500).json({ error: 'Failed to fetch recipes.' });
        }
    });
}
exports.getAllRecipe = getAllRecipe;
function deleteRecipe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recipe = yield Recipe_1.default.findByIdAndDelete(req.params.id);
            res.json(recipe);
        }
        catch (error) {
            console.error('Error fetching recipes:', error.message);
            res.status(500).json({ error: 'Failed to fetch recipes.' });
        }
    });
}
exports.deleteRecipe = deleteRecipe;
//# sourceMappingURL=RecipeService.js.map