import React, { useState } from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectRightInventories, selectRightInventory } from '../../store/inventory';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);
  const rightInventories = useAppSelector(selectRightInventories);
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});

  const inventories = rightInventories.length > 0 ? rightInventories : rightInventory.id ? [rightInventory] : [];

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (inventories.length === 0) return null;

  return (
    <div className="right-inventory-column">
      {inventories.map((inv) => (
        <div key={inv.id} className="right-inventory-panel">
          <InventoryGrid
            inventory={inv}
            collapsed={!!collapsedIds[inv.id]}
            onToggleCollapse={() => toggleCollapse(inv.id)}
            isRightPanel
          />
        </div>
      ))}
    </div>
  );
};

export default RightInventory;
