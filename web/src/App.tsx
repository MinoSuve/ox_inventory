import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';

// Debug data with multiple right inventories for browser testing
debugData([
  {
    action: 'setInventoryVisible',
    data: true,
  },
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'player-2027',
        type: 'player',
        slots: 30,
        label: 'HOTBAR',
        icon: 'player',
        maxWeight: 250000,
        items: [
          {
            slot: 1,
            name: 'pistol',
            weight: 2500,
            count: 1,
            metadata: {
              durability: 85,
              serial: 'WPN-38291',
              ammo: 12,
              rarity: 'rare',
            },
          },
          {
            slot: 2,
            name: 'bandage',
            weight: 100,
            count: 10,
            metadata: {
              durability: 100,
              description: 'Medical bandages to stop bleeding.',
              rarity: 'common',
            },
          },
          {
            slot: 3,
            name: 'vest',
            weight: 5000,
            count: 1,
            metadata: {
              durability: 62,
              rarity: 'uncommon',
            },
          },
          {
            slot: 4,
            name: 'lockpick',
            weight: 200,
            count: 4,
            metadata: {
              durability: 40,
            },
          },
          {
            slot: 5,
            name: 'phone',
            weight: 200,
            count: 1,
            metadata: {
              durability: 95,
              rarity: 'epic',
            },
          },
          {
            slot: 6,
            name: 'iron',
            weight: 3000,
            count: 5,
            metadata: {
              description: 'Refined iron ingots.',
            },
          },
          {
            slot: 7,
            name: 'copper',
            weight: 1200,
            count: 12,
            metadata: { type: 'Special' },
          },
          {
            slot: 8,
            name: 'water',
            weight: 500,
            count: 10,
            metadata: {},
          },
          {
            slot: 9,
            name: 'sandwich',
            weight: 300,
            count: 10,
            metadata: {
              description: 'A delicious turkey sandwich.',
            },
          },
          {
            slot: 10,
            name: 'radio',
            weight: 600,
            count: 1,
            metadata: {
              durability: 78,
              rarity: 'uncommon',
            },
          },
          {
            slot: 11,
            name: 'soda',
            weight: 350,
            count: 10,
            metadata: {
              label: 'eCola',
              rarity: 'common',
            },
          },
          {
            slot: 12,
            name: 'medkit',
            weight: 800,
            count: 3,
            metadata: {
              description: 'Comprehensive medical kit.',
              rarity: 'rare',
            },
          },
          {
            slot: 13,
            name: 'flashlight',
            weight: 400,
            count: 1,
            metadata: {
              durability: 90,
            },
          },
          {
            slot: 14,
            name: 'powersaw',
            weight: 4000,
            count: 1,
            metadata: {
              durability: 55,
              rarity: 'legendary',
            },
          },
          {
            slot: 15,
            name: 'screwdriver',
            weight: 300,
            count: 1,
            metadata: {
              durability: 70,
            },
          },
          {
            slot: 16,
            name: 'rope',
            weight: 800,
            count: 3,
            metadata: {},
          },
          {
            slot: 17,
            name: 'ammo-9',
            weight: 200,
            count: 120,
            metadata: {},
          },
          {
            slot: 18,
            name: 'backwoods',
            weight: 100,
            count: 2,
            metadata: {
              label: 'Russian Cream',
              rarity: 'gold',
            },
          },
        ],
      },
      rightInventories: [
        {
          id: 'ground-3308',
          type: 'container',
          slots: 12,
          label: 'GROUND',
          icon: 'ground',
          maxWeight: 1000000,
          items: [
            {
              slot: 1,
              name: 'water',
              weight: 500,
              count: 2,
              metadata: {},
            },
            {
              slot: 4,
              name: 'sandwich',
              weight: 300,
              count: 1,
              metadata: {},
            },
          ],
        },
        {
          id: 'lockbox-B948K79',
          type: 'container',
          slots: 8,
          label: 'POLICE LOCKBOX',
          icon: 'lockbox',
          maxWeight: 150000,
          items: [
            {
              slot: 1,
              name: 'pistol',
              weight: 2500,
              count: 1,
              metadata: {
                durability: 100,
                serial: 'PD-19283',
                ammo: 17,
                rarity: 'rare',
              },
            },
            {
              slot: 2,
              name: 'ammo-9',
              weight: 200,
              count: 60,
              metadata: {},
            },
            {
              slot: 3,
              name: 'vest',
              weight: 5000,
              count: 1,
              metadata: {
                durability: 100,
                rarity: 'uncommon',
              },
            },
          ],
        },
        {
          id: 'trunk-B948K79',
          type: 'container',
          slots: 12,
          label: 'TRUNK',
          icon: 'trunk',
          maxWeight: 150000,
          items: [
            {
              slot: 1,
              name: 'medkit',
              weight: 800,
              count: 5,
              metadata: {
                description: 'Emergency medical kit.',
                rarity: 'rare',
              },
            },
            {
              slot: 2,
              name: 'flashlight',
              weight: 400,
              count: 2,
              metadata: {
                durability: 88,
              },
            },
            {
              slot: 5,
              name: 'rope',
              weight: 800,
              count: 10,
              metadata: {},
            },
          ],
        },
      ],
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
