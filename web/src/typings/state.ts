import { Inventory } from './inventory';
import { Slot } from './slot';

export type State = {
  leftInventory: Inventory;
  rightInventory: Inventory;
  rightInventories: Inventory[];
  itemAmount: number;
  shiftPressed: boolean;
  isBusy: boolean;
  filterText: string;
  additionalMetadata: Array<{ metadata: string; value: string }>;
  history?: {
    leftInventory: Inventory;
    rightInventory: Inventory;
    rightInventories: Inventory[];
  };
};
