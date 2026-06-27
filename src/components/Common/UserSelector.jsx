import React, { useState } from 'react';

function UserSelector({ items = [], onSelect }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    if (onSelect) onSelect(item); // Sends the chosen item to the parent component
  };

  return (
    <ul className="flex flex-col w-full max-h-48 overflow-y-auto bg-white text-black rounded divide-y divide-gray-200 border border-gray-300">
      {items.map((item, index) => {
        const isSelected = selectedItem?.uuid === item.uuid;
        
        return (
          <li 
            key={item.uuid} /* Uses the unique uuid as the React key */
            onClick={() => handleSelect(item)}
            className={`px-6 py-3 text-sm font-medium cursor-pointer 
              ${isSelected ? 'bg-gray-200 font-bold' : ''}
            `}
          >
            {item.username} {/* Pulls 'theruderaw' out of the object */}
          </li>
        );
      })}
    </ul>
  );
}

export default UserSelector;