import React, { useState, useEffect, useRef } from 'react';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { FaRobot, FaStar, FaSearch } from 'react-icons/fa';
import temp from '../assets/temp.svg';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

const MainContent = ({ ingredients, openAiTab }) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [loadingImages, setLoadingImages] = useState({});
  const [favorites, setFavorites] = useState([]);

  const requestQueue = useRef([]);
  const processingQueue = useRef(false);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    if (input) {
      setSuggestions(
        ingredients.filter((ingredient) =>
          ingredient.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 10) // Limit to a maximum of 10 suggestions
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (ingredient) => {
    if (selectedTags.length < 5 && !selectedTags.includes(ingredient)) {
      setSelectedTags([...selectedTags, ingredient]);
      setSearchInput('');
      setSuggestions([]);
    }
  };

  const removeTag = (ingredient) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== ingredient));
  };

  const handleSearchClick = async () => {
    if (selectedTags.length === 0) {
      setResponseMessage('Please add at least one ingredient.');
      return;
    }

    try {
      const response = await customFetch.post('/auth/fetchRecipes', {
        ingredients: selectedTags,
      });
      const fetchedRecipes = response.data.recipes;
      setRecipes(fetchedRecipes);

      // Add image generation requests to the queue
      fetchedRecipes.forEach((recipe, index) => {
        requestQueue.current.push({ recipeName: recipe.name, index });
      });

      // Start processing the queue
      // processQueue();

      setResponseMessage('');
    } catch (e) {
      console.error('Failed to fetch recipes:', e.message);
      setResponseMessage('Failed to fetch recipes');
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const starRecipe = async (recipe) => {
    try {
      const { name, steps, ingredients } = recipe;
      const response = await customFetch.post('/auth/starRecipe', { name, steps, ingredients });

      if (response.status === 200) {
        toast.success(`${response.data.message}\nPlease refresh your sidebar`);
        setFavorites((prev) => [...prev, recipe.name]);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(`${error.response?.data?.warning || 'Failed to star recipe'}\nPlease refresh your sidebar`);
    }
  };

  return (
    <div className="p-4 flex-1 bg-orange-100">
      <div className="mb-4">
        <div className="flex flex-wrap items-center border border-orange-900 rounded p-1 ">
          {selectedTags.map((tag, index) => (
            <div key={index} className="bg-orange-300 px-2 py-1 rounded border border-black mr-2 flex items-center">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 text-red-600">
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search..."
            className="flex-1 p-2 outline-none bg-transparent"
          />
          <button
            onClick={handleSearchClick}
            className=" border-l border-orange-900 icon-button p-2 mr-0 hover:bg-orange-200 hover:border-2 hover:border-orange-950  hover:rounded"
          >
            <FaSearch className='text-3xl text-orange-950' />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="rounded-2xl mt-2 bg-transparent absolute z-10 max-h-80 overflow-y-auto custom-scrollbar">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className=" border border-orange-900 hover:border-orange-950 mb-1 mr-1 p-1 hover:bg-orange-300 hover:border-4 text-center rounded-2xl cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {responseMessage && (
        <div className="mt-4">
          <p>{responseMessage}</p>
        </div>
      )}
      {recipes.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recipes.map((recipe, index) => (
            <IonCard
              key={index}
              onClick={() => handleRecipeClick(recipe)}
              className="hover:scale-100 scale-95 shadow-orange-950 shadow-md hover:rounded-2xl hover:shadow-black hover:shadow-xl cursor-pointer relative border-2 border-orange-900 p-4 bg-transparent rounded-lg hover:bg-orange-400 hover:border-4 hover:font-bold hover:text-white "
            >
              <div className="absolute top-2 left-2">
                <button
                  className="bg-orange-950 text-orange-50 rounded-full p-2 shadow-lg hover:bg-orange-50 hover:text-orange-950 transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    starRecipe(recipe);
                  }}
                >
                  <FaStar />
                </button>
              </div>
              {loadingImages[index] ? (
                <div className="flex justify-center items-center w-full">
                  <div className="loader">Loading...</div>
                </div>
              ) : (
                <div className="image-container ">
                  <img
                    alt="Recipe"
                    src={recipe.image || temp}
                    className="h-auto w-auto object-cover rounded-sm "
                  />
                </div>
              )}
              <div className='mt-1  border-orange-900'>
                <div className='border-t-4 border-orange-950'></div>
                <IonCardHeader >
                  <IonCardTitle className="text-xl font-extrabold">{recipe.name}</IonCardTitle>
                </IonCardHeader>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm pr-8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, et cum deserunt iste officiis perferendis!</p>
                <button
                  className="absolute bottom-10 right-1 hover:bg-orange-50 hover:text-orange-950 rounded-full p-4 shadow-lg bg-orange-950 text-white transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAiTab();
                  }}
                >
                  <FaRobot />
                </button>
              </div>
            </IonCard>
          ))}
        </div>
      )}
      {selectedRecipe && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeRecipeModal}
        >
          <div
            className="bg-orange-100 p-8 rounded-2xl shadow-black shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeRecipeModal}
              className="absolute text-3xl top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className=" flex font-bold text-2xl border-b-4 border-orange-900 mb-2">
              <img className='mr-5' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAo9JREFUSEuVV4t1wyAMPE0SZxN7kiaTNJ0k2STuJHUnoRYWWICEXd5LXyqQTp+TIIR/LgIQ9j+mdtyWnf07gRBEF2D5oXI8IGBR2dDQYGdsusAAbiBcEPAL4CXGbgRcAkoZgAtKmZ9H8XADtt19AxjXz0zAJFFmGUCTJFTchMDa20fUCDPocwsAJzERxMA5/QLyRJgEhYBgFgAZOUDFqAr3nyTHLM4XhAEAK+DBkcONbplvCr1L9zRcwWAn+wpa68QYDzJNDw+8ZUX1EwA8B0ETk4sF3Kr6QpprZZQ8q1RgENm2F8URPDw2mFdmUV3zckHsagXFlntI0VhFdB98DdApZb+3PVgjiwV5rsWV/V13A2LdrFZP4Zhn0uWt5slK8P4gPhkYsbHxMXIb6Im7sqTdmvtn9oJeyyVdrRX69VhjeRKhFgABXUXjcmA82uRTFLa3nH96Qcfw6RCF33kqaHjzK3oYI7uzSbEnsyZmH9H0v5BgBIS9wNTNRXecgThzJ+TVA8O7KNRVrJXwHnAWySn4A0fZ9j0CS26Le0I84dTgWgOeRZCF3kWxIs4heRC1xUuQl+3wZcT4+LP2zYpmJIX2COV8AdnbAX+8NpgNAAAAAElFTkSuQmCC" alt="Recipe" />
              {selectedRecipe.name}
            </h3>
            <h4 className="font-bold mb-1 text-xl">Ingredients:</h4>
            <ul className="list-disc list-inside mb-4">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4 className="font-bold mb-1 text-xl">Steps:</h4>
            <ol className="list-decimal list-inside">
              {selectedRecipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
