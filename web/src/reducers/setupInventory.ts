import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { getItemData, itemDurability } from '../helpers';
import { Items } from '../store/items';
import { Inventory, State } from '../typings';

const processInventoryItems = (inventory: Inventory, curTime: number): Inventory => ({
  ...inventory,
  items: Array.from(Array(inventory.slots), (_, index) => {
    const item = Object.values(inventory.items).find((item) => item?.slot === index + 1) || {
      slot: index + 1,
    };

    if (!item.name) return item;

    if (typeof Items[item.name] === 'undefined') {
      getItemData(item.name);
    }

    item.durability = itemDurability(item.metadata, curTime);
    return item;
  }),
});

export const setupInventoryReducer: CaseReducer<
  State,
  PayloadAction<{
    leftInventory?: Inventory;
    rightInventory?: Inventory;
    rightInventories?: Inventory[];
  }>
> = (state, action) => {
  const { leftInventory, rightInventory, rightInventories } = action.payload;
  const curTime = Math.floor(Date.now() / 1000);

  if (leftInventory) {
    state.leftInventory = processInventoryItems(leftInventory, curTime);
  }

  // Support new array-based right inventories
  if (rightInventories && rightInventories.length > 0) {
    state.rightInventories = rightInventories.map((inv) => processInventoryItems(inv, curTime));
    // Set the first as the "primary" rightInventory for backward compat
    state.rightInventory = state.rightInventories[0];
  } else if (rightInventory) {
    // Backward compat: single rightInventory wraps into array
    const processed = processInventoryItems(rightInventory, curTime);
    state.rightInventory = processed;
    state.rightInventories = [processed];
  }

  state.shiftPressed = false;
  state.isBusy = false;
};
