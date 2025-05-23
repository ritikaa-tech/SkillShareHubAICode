import React, { useState } from 'react';

const FilterSidebar = ({ onFilter }) => {
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('');

  const applyFilters = () => {
    onFilter({ category, priceMin, priceMax, sort });
  };

  return (
    <div className="p-4 bg-gray-100 rounded space-y-4">
      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border">
        <option value="">All Categories</option>
        <option value="design">Design</option>
        <option value="coding">Coding</option>
        <option value="business">Business</option>
      </select>
      <div className="flex gap-2">
        <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min $" className="w-1/2 p-2 border" />
        <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max $" className="w-1/2 p-2 border" />
      </div>
      <select value={sort} onChange={e => setSort(e.target.value)} className="w-full p-2 border">
        <option value="">Sort by</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="rating">Rating</option>
      </select>
      <button onClick={applyFilters} className="bg-green-500 text-white w-full py-2 rounded">Apply</button>
    </div>
  );
};

export default FilterSidebar;
