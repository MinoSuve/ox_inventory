import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { getTargetInventory, itemDurability } from '../helpers';
import { Inventory, SlotWithItem, State } from '../typings';

export const swapSlotsReducer: CaseReducer<
  State,
  PayloadAction<{
    fromSlot: SlotWithItem;
    fromType: Inventory['type'];
    toSlot: SlotWithItem;
    toType: Inventory['type'];
    fromId?: string;
    toId?: string;
  }>
> = (state, action) => {
  const { fromSlot, fromType, toSlot, toType, fromId, toId } = action.payload;
  const { sourceInventory, targetInventory } = getTargetInventory(state, fromType, toType, fromId, toId);
  const curTime = Math.floor(Date.now() / 1000);

  [sourceInventory.items[fromSlot.slot - 1], targetInventory.items[toSlot.slot - 1]] = [
    {
      ...targetInventory.items[toSlot.slot - 1],
      slot: fromSlot.slot,
      durability: itemDurability(toSlot.metadata, curTime),
    },
    {
      ...sourceInventory.items[fromSlot.slot - 1],
      slot: toSlot.slot,
      durability: itemDurability(fromSlot.metadata, curTime),
    },
  ];
};
