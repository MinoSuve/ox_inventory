import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectLeftInventory, selectFilterText, setFilterText } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const filterText = useAppSelector(selectFilterText);
  const dispatch = useAppDispatch();

  return (
    <div className="left-inventory-wrapper">
      <div className="filter-input-wrapper">
        <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14">
          <path
            fill="currentColor"
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          />
        </svg>
        <input
          className="filter-input"
          type="text"
          placeholder="Filter inventory..."
          value={filterText}
          onChange={(e) => dispatch(setFilterText(e.target.value))}
        />
        {filterText && (
          <button className="filter-clear-btn" onClick={() => dispatch(setFilterText(''))}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="10" height="10">
              <path
                fill="currentColor"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 12.5 32.8 0 45.3s-32.8-12.5-45.3 0L342.6 150.6z"
              />
            </svg>
          </button>
        )}
      </div>
      <InventoryGrid inventory={leftInventory} />
    </div>
  );
};

export default LeftInventory;
