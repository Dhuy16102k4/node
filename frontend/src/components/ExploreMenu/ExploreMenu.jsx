import React from 'react';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory, categories }) => {
  return (
    <div className="explore-menu">
      <button 
        onClick={() => setCategory('All')}
        className={category === 'All' ? 'active' : ''}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setCategory(cat.name)}
          className={category === cat.name ? 'active' : ''}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default ExploreMenu;
