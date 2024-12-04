import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory, categories }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromURL = searchParams.get('category');
    if (categoryFromURL) {
      setCategory(categoryFromURL);
    }
  }, [location.search, setCategory]);

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    navigate(`/?category=${categoryId === 'All' ? '' : categoryId}`);
  };

  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="explore-menu">
      <button
        onClick={() => handleCategoryChange('All')}
        className={category === 'All' ? 'active' : ''}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => handleCategoryChange(cat._id)}
          className={category === cat._id ? 'active' : ''}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default ExploreMenu;
