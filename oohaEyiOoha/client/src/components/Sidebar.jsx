import React, { useState, useEffect } from 'react';
import { FaSyncAlt, FaPepperHot } from 'react-icons/fa';
import { FaLeftLong } from 'react-icons/fa6';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const [favourites, setFavourites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    if (activeTab === 'favourites') {
      fetchFavourites();
    }
  }, [activeTab]);

  const fetchFavourites = async () => {
    try {
      const response = await customFetch.get('/auth/fetchFavs');
      const data = await response.data;
      setFavourites(data);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const showRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  const handleFavouritesClick = () => {
    setActiveTab('favourites');
    fetchFavourites();
  };

  const handleAIClick = () => {
    setActiveTab('ai');
  };

  const refreshTab = () => {
    setIsRotating(true);
    if (activeTab === 'favourites') {
      fetchFavourites();
    } else if (activeTab === 'ai') {
      // Add AI related refresh logic if needed
    }
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleRemoveClick = (recipeName) => {
    setRecipeToDelete(recipeName);
  };

  const confirmDelete = async () => {
    try {
      const response = await customFetch.post('/auth/removeRecipe', { recipeName: recipeToDelete });
      if (response.status === 200) {
        toast.success('Recipe removed from favourites');
        refreshTab();
      } else {
        toast.error('Failed to remove recipe from favourites');
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast.error('Failed to remove recipe from favourites');
    } finally {
      setRecipeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRecipeToDelete(null);
  };

  return (
    <div className={`border-orange-300 shadow-orange-900 shadow-xl border-r fixed inset-y-0 left-0 bg-orange-100 text-black transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:w-60 lg:w-80`}>
      <div className="flex items-center justify-between p-4">
        <button onClick={toggleSidebar} className="block text-orange-950">
          <FaLeftLong className='ml-2 text-2xl' />
        </button>
      </div>
      <nav className="mt-4 flex space-x-2 px-4">
        <button
          onClick={handleFavouritesClick}
          className={`flex-1 text-center py-2 ${activeTab !== 'favourites' ? 'hover:border-black bg-transparent border border-gray-400 rounded-md font-light hover:scale-90 ' : 'border scale-105 bg-orange-300 font-bold px-4 py-2 border-gray-700 rounded-md border-x-2 border-y-2'}`}
        >
          Favourites
        </button>
        <button
          onClick={handleAIClick}
          className={`flex-1 text-center py-2 ${activeTab !== 'ai' ? 'hover:border-black  bg-transparent border border-gray-400 rounded-md font-light hover:scale-90' : 'border bg-orange-300 scale-105 font-bold px-4 py-2 border-gray-700 rounded-md border-x-2 border-y-2'}`}
        >
          AI
        </button>
      </nav>
      <div className="flex justify-left px-8 py-3">
        <button
          onClick={refreshTab}
          className={`text-2xl transition-transform duration-500 text-orange-950 ${isRotating ? 'transform rotate-180' : ''}`}
        >
          <FaSyncAlt />
        </button>
      </div>
      <div className="px-4 ">
        {activeTab === 'favourites' ? (
          <div>
            {favourites.length > 0 ? (
              favourites.map((recipe, index) => (
                <div
                  key={index}
                  onMouseEnter={(e) => e.currentTarget.querySelector('.delete-icon').classList.remove('hidden')}
                  onMouseLeave={(e) => e.currentTarget.querySelector('.delete-icon').classList.add('hidden')}
                  className="hover:scale-105 cursor-pointer hover:bg-orange-400 p-2 px-4 rounded-md flex justify-between mb-2   items-center border border-orange-950 hover:border-black hover:shadow-black hover:shadow-sm"
                >
                  <span onClick={() => showRecipeDetails(recipe)}>
                    {recipe.recipeName}
                  </span>
                  <FaPepperHot
                    className="delete-icon hidden text-red-600 hover:text-2xl hover:text-red-900 transition duration-200 cursor-pointer text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveClick(recipe.recipeName);
                    }}
                  />
                </div>
              ))
            ) : (
              <p>Start adding some recipes to your favourites list</p>
            )}
          </div>
        ) : (
          <div>AI Content</div>
        )}
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeRecipeDetails}>
          <div className="bg-orange-100 text-black rounded-xl w-11/12 h-3/4 overflow-auto custom-scrollbar p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex font-bold text-2xl border-b-4 border-orange-900 mb-2">
                <img className="mr-2" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAo9JREFUSEuVV4t1wyAMPE0SZxN7kiaTNJ0k2STuJHUnoRYWWICEXd5LXyqQTp+TIIR/LgIQ9j+mdtyWnf07gRBEF2D5oXI8IGBR2dDQYGdsusAAbiBcEPAL4CXGbgRcAkoZgAtKmZ9H8XADtt19AxjXz0zAJFFmGUCTJFTJMPnmSl9UxA36E4QbAi1AuIraM2YCWABcRaOQZfMqss3p0v5Rqp/Chrukm0EZiFcrI9wRclki2E4ol1wNFwcAnMaBgCUQJmYVAe8A8B5HHVPL5wgYwi7jvQ5r2Yn+4hozOC8mGEc5gvAWaouMRkJgh/Q5mzy5Ow6QJbW5rk2tCVdxQmotnDjoryJi56yKOjJ5FrZzepkCXAJm/hhidqKUS8Dnuhlveb6NpiTX6U4Gd5kAJ2dEaQJhridNzaLMdDtiGoAwSDekKJhc/GHdCBDJRRikC+bUPV7Ga3J9Wrk5Mw7FiZgo57yegAWrdY/2u0Hv2jeCh556/wC4lyfrpug6FI3twMr2RpgGrJl9Bw3YLcwdhFcqRzLEZPk5VWPpI8X8Vs3G55m/xFFa7ctN43vtMN+8+itv4sWSZBurd2s+wQzEbuDt5n1tuVcaETUw9+tP8T5p3zBmjXe/Sg/Vf0V2FXA+EqP2DB2PdmMQAo81r1816a2T6XKvKiF3qoHeaed5m+dtJrIZtZXv4pICGrj8rt+V6kGoCFW6Vo9MHQvX+2PtOU6T5Vx6eFZdlQHS/W1OMavGNQrP74c1gDuD7bGO7KKmdXUKVjuEGuW501S2A8yv0rP3sTsa24nm9bS4RsA1EJaSUCUx68nldQu3GD/at+VNjs2h7+7rQ3TrAWI2YR/Hqt7xj5weq8vIvIKerrzOFvAH8bASM4itvE4AAAAASUVORK5CYII=" />
                {selectedRecipe.recipeName}
              </h3>
              <button onClick={closeRecipeDetails} className="text-3xl font-bold">&times;</button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-none">
                {selectedRecipe.recipeIngrids.map((ingredient, index) => (
                  <li key={index} className="flex items-center justify-center border border-gray-400 hover:border-orange-950 scale-105 p-1 mb-1 rounded-xl hover:cursor-default bg-orange-200 hover:font-semibold">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Steps:</h3>
              <ol className="list-none">
                {selectedRecipe.recipeStps.map((step, index) => (
                  <li key={index} className="mb-2 border-gray-400 bg-orange-200 border rounded-lg hover:border-orange-900 hover:rounded-lg p-1 hover:bg-orange-200 hover:font-semibold">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {recipeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={cancelDelete}>
          <div className="bg-white text-black p-4 rounded-lg w-11/12" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the recipe: {recipeToDelete}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;
