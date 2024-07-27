const User = require('../Models/UserModel.js');
const StatusCodes = require('http-status-codes');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { createJWT } = require('../utils/tokenUtils');
const favourite = require('../Models/FavModel.js');
const History = require('../Models/HistoryModel.js');

const register = async (req, res) => {
  const { name, email, password: plainPassword, language } = req.body;

  const password = await hashPassword(plainPassword);

  let user = await User.create({ name, email, password, language });

  await user.save();

  res.status(200).json({ message: 'created successfully' });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(500).json({ message: 'Invalid credentials' });
  }

  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(500).json({ message: 'Invalid credentials' });
  }

  const token = createJWT({ userId: user._id });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ msg: 'user logged in' });
};

const getAllIngs = async (req, res) => {
  try {
    const ingredients = await Ing.find({}, { _id: 0, ingredient: 1 }).exec();
    const ingredientList = ingredients.map((doc) => doc.ingredient);
    res.json({ ingredients: ingredientList });
  } catch (e) {
    console.log('Error: ', e);
    res.json(500).json({ error: 'Error fetching ingredients' }, e);
  }
};

const fetchRecipes = async (req, res) => {
  const recipes = [
    {
      name: 'Spaghetti Carbonara',
      steps: [
        'Boil pasta according to package instructions.',
        'Cook pancetta in a skillet until crispy.',
        'Whisk eggs and grated Parmesan in a bowl.',
        'Combine pasta, pancetta, and egg mixture.',
        'Season with salt and pepper and serve.',
      ],
      ingredients: [
        'Spaghetti',
        'Pancetta',
        'Eggs',
        'Parmesan cheese',
        'Salt',
        'Pepper',
      ],
    },
    {
      name: 'Chicken Alfredo',
      steps: [
        'Cook pasta according to package instructions.',
        'Cook chicken breasts in a skillet until done.',
        'Melt butter in a pan and add heavy cream.',
        'Stir in Parmesan and cook until sauce thickens.',
        'Combine pasta, chicken, and sauce.',
        'Season with salt and pepper and serve.',
      ],
      ingredients: [
        'Pasta',
        'Chicken breasts',
        'Butter',
        'Heavy cream',
        'Parmesan cheese',
        'Salt',
        'Pepper',
      ],
    },
    {
      name: 'Beef Tacos',
      steps: [
        'Cook ground beef in a skillet until browned.',
        'Add taco seasoning and water to the beef.',
        'Simmer until sauce thickens.',
        'Warm taco shells in the oven.',
        'Fill taco shells with beef, lettuce, cheese, and salsa.',
      ],
      ingredients: [
        'Ground beef',
        'Taco seasoning',
        'Taco shells',
        'Lettuce',
        'Cheese',
        'Salsa',
      ],
    },
    {
      name: 'Vegetable Stir Fry',
      steps: [
        'Heat oil in a large pan.',
        'Add chopped vegetables and cook until tender.',
        'Stir in soy sauce, garlic, and ginger.',
        'Cook until sauce thickens.',
        'Serve with rice or noodles.',
      ],
      ingredients: [
        'Mixed vegetables (e.g., bell peppers, broccoli, carrots)',
        'Soy sauce',
        'Garlic',
        'Ginger',
        'Cooking oil',
        'Rice or noodles (optional)',
      ],
    },
    {
      name: 'Margherita Pizza',
      steps: [
        'Preheat oven to 475°F (245°C).',
        'Roll out pizza dough on a floured surface.',
        'Spread tomato sauce over the dough.',
        'Top with fresh mozzarella and basil leaves.',
        'Bake in the oven until crust is golden.',
        'Drizzle with olive oil and serve.',
      ],
      ingredients: [
        'Pizza dough',
        'Tomato sauce',
        'Fresh mozzarella',
        'Basil leaves',
        'Olive oil',
      ],
    },
    {
      name: 'Chicken Caesar Salad',
      steps: [
        'Grill chicken breasts until fully cooked.',
        'Chop romaine lettuce and place in a bowl.',
        'Add croutons and grated Parmesan.',
        'Slice the grilled chicken and add to the salad.',
        'Toss with Caesar dressing and serve.',
      ],
      ingredients: [
        'Chicken breasts',
        'Romaine lettuce',
        'Croutons',
        'Parmesan cheese',
        'Caesar dressing',
      ],
    },
    {
      name: 'Pancakes',
      steps: [
        'Mix flour, sugar, baking powder, and salt in a bowl.',
        'Whisk milk, eggs, and melted butter in another bowl.',
        'Combine wet and dry ingredients and stir until smooth.',
        'Heat a griddle and pour batter to form pancakes.',
        'Cook until bubbles form, then flip and cook until golden.',
        'Serve with syrup and butter.',
      ],
      ingredients: [
        'Flour',
        'Sugar',
        'Baking powder',
        'Salt',
        'Milk',
        'Eggs',
        'Butter',
        'Syrup (optional)',
      ],
    },
    {
      name: 'Beef Stew',
      steps: [
        'Brown beef in a large pot.',
        'Add chopped onions, carrots, and potatoes.',
        'Stir in beef broth, tomato paste, and seasonings.',
        'Simmer until meat and vegetables are tender.',
        'Serve hot with crusty bread.',
      ],
      ingredients: [
        'Beef',
        'Onions',
        'Carrots',
        'Potatoes',
        'Beef broth',
        'Tomato paste',
        'Seasonings',
      ],
    },
    {
      name: 'Chocolate Chip Cookies',
      steps: [
        'Preheat oven to 350°F (175°C).',
        'Cream butter and sugars together in a bowl.',
        'Add eggs and vanilla extract and mix well.',
        'Stir in flour, baking soda, and salt.',
        'Fold in chocolate chips.',
        'Drop spoonfuls of dough onto a baking sheet.',
        'Bake until golden brown.',
      ],
      ingredients: [
        'Butter',
        'Sugar',
        'Brown sugar',
        'Eggs',
        'Vanilla extract',
        'Flour',
        'Baking soda',
        'Salt',
        'Chocolate chips',
      ],
    },
    {
      name: 'Grilled Cheese Sandwich',
      steps: [
        'Butter one side of each bread slice.',
        'Place cheese slices between two pieces of bread.',
        'Heat a skillet over medium heat.',
        'Cook sandwich until bread is golden brown and cheese is melted.',
        'Serve hot.',
      ],
      ingredients: ['Bread slices', 'Cheese slices', 'Butter'],
    },
  ];
  res.status(200).json({ recipes: recipes });
};
const starRecipe = async (req, res) => {
  try {
    const { name, steps, ingredients } = req.body;
    const { userId } = req.user;

    if (!userId || !name || !steps || !ingredients) {
      return res
        .status(400)
        .json({ error: 'Missing user ID or recipe details' });
    }

    // Check if the recipe already exists for the specified user
    const existingRecipe = await favourite.findOne({
      recipeName: name,
      user: userId,
    });
    if (existingRecipe) {
      return res
        .status(400)
        .json({ warning: 'Recipe already exists in favourites.' });
    }

    const newFavourite = {
      recipeName: name,
      recipeIngrids: ingredients,
      recipeStps: steps,
      user: userId,
    };

    const favRecipe = new favourite(newFavourite);
    await favRecipe.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.favourites.push(favRecipe._id);
    await user.save();

    res.status(200).json({ message: 'Recipe added to favourites' });
  } catch (error) {
    console.error('Error inserting favourite recipe:', error);
    res.status(500).json({ error: 'Failed to add recipe to favourites' });
  }
};

const fetchFavs = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const favourites = await favourite.find({ user: userId });

    res.status(200).json(favourites);
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ error: 'Failed to fetch favourites' });
  }
};

const removeRecipe = async (req, res) => {
  const { recipeName } = req.body;
  try {
    const deletedRecipe = await favourite.findOneAndDelete({
      recipeName: recipeName,
    });
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({
      message: 'Recipe removed from favourites',
      recipe: deletedRecipe,
    });
  } catch (error) {
    console.error('Error removing recipe from favourites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const createImage = async (req, res) => {
  const { recipeName, recipeIngrids } = req.body;
  console.log('name:', recipeName);
  const options = {
    method: 'POST',
    url: 'https://chatgpt-42.p.rapidapi.com/texttoimage',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      text: recipeName,
      width: 512,
      height: 512,
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(400).json('Error:', error);
  }
};

const addHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recipeName, recipeIngrids, recipeStps } = req.body;

    if (!recipeName || !recipeIngrids || !recipeStps) {
      return res.status(400).json({ error: 'Missing recipe details' });
    }

    // Create a new history object with the userId
    const newHistory = new History({
      recipeName,
      recipeIngrids,
      recipeStps,
      user: userId, // Add userId to the history object
    });

    // Save the history object
    const savedHistory = await newHistory.save();

    // Find the user and update their history array
    const user = await User.findById(userId);
    user.history.push(savedHistory._id);

    await user.save();

    res
      .status(200)
      .json({ message: 'History added successfully', history: savedHistory });
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ error: 'Failed to add history' });
  }
};

const fetchhistory = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const histories = await History.find({ user: userId });

    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching Histories:', error);
    res.status(500).json({ error: 'Failed to fetch Histories' });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

const updateuser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body);
  res.status(StatusCodes.OK).json({ msg: 'user updated' });
};

module.exports = {
  register,
  login,
  getAllIngs,
  fetchRecipes,
  starRecipe,
  fetchFavs,
  removeRecipe,
  createImage,
  addHistory,
  fetchhistory,
  getCurrentUser,
  updateuser
};
