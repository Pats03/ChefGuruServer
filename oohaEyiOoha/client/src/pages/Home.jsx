import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, MainContent } from '../components';
import customFetch from '../../../utils/customFetch';
import { FaRobot } from 'react-icons/fa';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('favourites');
  const [ingredients, setIngredients] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const openAiTab = () => {
    setActiveTab('ai');
    setSidebarOpen(true);
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await customFetch.get('/auth/getallIngs');
        setIngredients(response.data.ingredients);
      } catch (e) {
        console.log(e.message);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-60 lg:ml-80' : ''} transition-all duration-300`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <MainContent ingredients={ingredients} openAiTab={openAiTab} sidebarOpen={sidebarOpen} className=''/>
      </div>
    </div>
  );
};

export default Home;
