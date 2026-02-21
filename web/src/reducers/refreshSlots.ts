import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { itemDurability } from '../helpers';
import { inventorySlice } from '../store/inventory';
import { Items } from '../store/items';
import { InventoryType, Slot, State } from '../typings';

export type ItemsPayload = { item: Slot; inventory?: InventoryType };

interface Payload {
  items?: ItemsPayload | ItemsPayload[];
  itemCount?: Record<string, number>;
  weightData?: { inventoryId: string; maxWeight: number };
  slotsData?: { inventoryId: string; slots: number };
}

export const refreshSlotsReducer: CaseReducer<State, PayloadAction<Payload>> = (state, action) => {
  if (action.payload.items) {
    if (!Array.isArray(action.payload.items)) action.payload.items = [action.payload.items];
    const curTime = Math.floor(Date.now() / 1000);

    Object.values(action.payload.items)
      .filter((data) => !!data)
      .forEach((data) => {
        let targetInventory;
        if (data.inventory) {
          if (data.inventory === InventoryType.PLAYER) {
            targetInventory = state.leftInventory;
          } else {
            // Search across rightInventories array first
            targetInventory = state.rightInventories.find((inv) => inv.type === data.inventory) || state.rightInventory;
          }
        } else {
          targetInventory = state.leftInventory;
        }

        data.item.durability = itemDurability(data.item.metadata, curTime);
        targetInventory.items[data.item.slot - 1] = data.item;
      });

    // Janky workaround to force a state rerender for crafting inventory to
    // run canCraftItem checks
    if (state.rightInventory.type === InventoryType.CRAFTING) {
      state.rightInventory = { ...state.rightInventory };
    }
    // Also check rightInventories for crafting
    state.rightInventories = state.rightInventories.map((inv) =>
      inv.type === InventoryType.CRAFTING ? { ...inv } : inv
    );
  }

  if (action.payload.itemCount) {
    const items = Object.entries(action.payload.itemCount);

    for (let i = 0; i < items.length; i++) {
      const item = items[i][0];
      const count = items[i][1];

      if (Items[item]!) {
        Items[item]!.count += count;
      } else console.log(`Item data for ${item} is undefined`);
    }
  }

  // Refresh maxWeight when SetMaxWeight is ran while an inventory is open
  if (action.payload.weightData) {
    const inventoryId = action.payload.weightData.inventoryId;
    const inventoryMaxWeight = action.payload.weightData.maxWeight;

    if (inventoryId === state.leftInventory.id) {
      state.leftInventory.maxWeight = inventoryMaxWeight;
    } else if (inventoryId === state.rightInventory.id) {
      state.rightInventory.maxWeight = inventoryMaxWeight;
    } else {
      // Search in rightInventories array
      const rightInv = state.rightInventories.find((inv) => inv.id === inventoryId);
      if (rightInv) rightInv.maxWeight = inventoryMaxWeight;
    }
  }

  if (action.payload.slotsData) {
    const { inventoryId } = action.payload.slotsData;
    const { slots } = action.payload.slotsData;

    if (inventoryId === state.leftInventory.id) {
      state.leftInventory.slots = slots;
      inventorySlice.caseReducers.setupInventory(state, {
        type: 'setupInventory',
        payload: { leftInventory: state.leftInventory },
      });
    } else if (inventoryId === state.rightInventory.id) {
      state.rightInventory.slots = slots;
      inventorySlice.caseReducers.setupInventory(state, {
        type: 'setupInventory',
        payload: { rightInventory: state.rightInventory },
      });
    } else {
      // Search in rightInventories array
      const rightInvIndex = state.rightInventories.findIndex((inv) => inv.id === inventoryId);
      if (rightInvIndex !== -1) {
        state.rightInventories[rightInvIndex].slots = slots;
        const updatedInventories = [...state.rightInventories];
        inventorySlice.caseReducers.setupInventory(state, {
          type: 'setupInventory',
          payload: { rightInventories: updatedInventories },
        });
      }
    }
  }
};
