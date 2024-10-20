require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./model/recipe.model");
initializeDatabase();

app.use(express.json());
app.use(cors(corsOptions));

createRecipe = async (newRecipe) => {
  try {
    const addNewRecipe = new Recipe(newRecipe);
    const saveRecipe = await addNewRecipe.save();
    return saveRecipe;
  } catch (error) {
    console.log("Error creating new recipe", error);
  }
};

app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = await createRecipe(req.body);

    res
      .status(201)
      .json({ message: "Recipe added successfully.", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe." });
  }
});

readAllRecipes = async () => {
  try {
    const allRecipe = await Recipe.find();
    return allRecipe;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch {
    res.status(500).json({ error: "Error fetching the recipes." });
  }
});

readRecipesByTitle = async (recipeTitle) => {
  try {
    const recipesByTitle = await Recipe.findOne({ title: recipeTitle });
    return recipesByTitle;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/:title", async (req, res) => {
  try {
    const recipe = await readRecipesByTitle(req.params.title);

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.status(500).json({ error: "Error fetching the recipe." });
  }
});

readRecipesByAuthor = async (authorName) => {
  try {
    const recipesByAuthor = await Recipe.find({ author: authorName });
    return recipesByAuthor;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipesByAuthor(req.params.authorName);

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.status(500).json({ error: "Error fetching the recipe." });
  }
});

readRecipesBydifficulty = async (recipeDifficulty) => {
  try {
    const recipesByDifficulty = await Recipe.find({
      difficulty: recipeDifficulty,
    });
    return recipesByDifficulty;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/difficulty/:recipeDifficulty", async (req, res) => {
  try {
    const recipes = await readRecipesBydifficulty(req.params.recipeDifficulty);

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch {
    res.status(500).json({ error: "Error fetching the recipe." });
  }
});

updateWithId = async (recipeId, dataToUpdate) => {
  try {
    const updateRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { new: true }
    );
    return updateRecipe;
  } catch (error) {
    throw error;
  }
};

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateWithId(req.params.recipeId, req.body);

    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.status(500).json({ error: "Error updating the recipe." });
  }
});

updateWithTitle = async (recipeTitle, dataToUpdate) => {
  try {
    const updateWithTitle = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { new: true }
    );
    return updateWithTitle;
  } catch (error) {
    throw error;
  }
};

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateWithTitle(
      req.params.recipeTitle,
      req.body
    );

    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.status(500).json({ error: "Error updating the recipe." });
  }
});

deleteRecipe = async (recipeId) => {
  try {
    const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deleteRecipe;
  } catch (error) {
    throw error;
  }
};

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);

    if (deletedRecipe) {
      res
        .status(200)
        .json({
          message: "Recipe deleted successfully.",
          recipe: deletedRecipe,
        });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch {
    res.json(500).json({ error: "Error deleting the recipe." });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is nunning on port", PORT);
});
