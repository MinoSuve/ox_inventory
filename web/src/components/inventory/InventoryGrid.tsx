import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{
  inventory: Inventory;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isRightPanel?: boolean;
}> = ({ inventory, collapsed, onToggleCollapse, isRightPanel }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const getInventoryIcon = (type: string, icon?: string) => {
    const iconLabel = icon || type;
    const iconMap: Record<string, string> = {
      player: 'P',
      shop: 'S',
      container: 'C',
      crafting: 'CR',
      drop: 'G',
      ground: 'G',
      trunk: 'T',
      glovebox: 'GB',
      stash: 'ST',
      lockbox: 'L',
      police: 'PD',
    };
    return iconMap[iconLabel.toLowerCase()] || iconLabel.charAt(0).toUpperCase();
  };

  return (
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div>
        <div className="inventory-grid-header-wrapper">
          <div className="inventory-header-left">
            <div className="inventory-hex-icon">
              <span>{getInventoryIcon(inventory.type, inventory.icon)}</span>
            </div>
            <div className="inventory-header-info">
              <span className="inventory-header-label">{inventory.label || inventory.type.toUpperCase()}</span>
              <span className="inventory-header-id">{inventory.id}</span>
            </div>
          </div>
          <div className="inventory-header-right">
            {inventory.maxWeight && (
              <p className="inventory-weight-text">
                {(weight / 1000).toFixed(1)}/{(inventory.maxWeight / 1000).toFixed(1)} lbs
              </p>
            )}
            {isRightPanel && onToggleCollapse && (
              <button className="inventory-collapse-btn" onClick={onToggleCollapse}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="12"
                  height="12"
                  style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <path
                    fill="currentColor"
                    d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
      </div>
      {!collapsed && (
        <div className="inventory-grid-container" ref={containerRef}>
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
