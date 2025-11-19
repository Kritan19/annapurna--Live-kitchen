
import { BookingVibe, Dish, Table, ThaliItem } from './types';

export const CATEGORIES = [
  "Himalayan Mains",
  "Sweet Summits",
  "Elixirs"
];

export const MENU_ITEMS: Dish[] = [
  // 1. Signature Jhol Momo (Himalayan Mains)
  {
    id: 'm1', category: 'Himalayan Mains', name: 'Signature Jhol Momo', nepaliName: 'झोल मोमो',
    description: 'Steamed dumplings floating in a spicy sesame-tomato-hogplum broth. The soul of Kathmandu.',
    ingredients: ['Buffalo/Veg', 'Sesame', 'Tomato', 'Hogplum', 'Szechuan Pepper'], price: 18, pairing: 'Chyang', shapeType: 'sphere'
  },
  // 2. Classic Steam Momo (Himalayan Mains)
  {
    id: 'm2', category: 'Himalayan Mains', name: 'Classic Steam Momo', nepaliName: 'स्टीम मोमो',
    description: 'Hand-wrapped parcels of joy that open to reveal juicy filling.',
    ingredients: ['Minced Meat', 'Ginger', 'Garlic', 'Spring Onion'], price: 16, pairing: 'Lager', shapeType: 'sphere'
  },
  // 3. Lamb Sekuwa (Himalayan Mains)
  {
    id: 'f1', category: 'Himalayan Mains', name: 'Lamb Sekuwa', nepaliName: 'भेडाको सेकुवा',
    description: 'Skewered lamb marinated in mountain spices and roasted over open wood fire.',
    ingredients: ['Lamb', 'Yogurt', 'Cumin', 'Wood Smoke', 'Mustard Oil'], price: 22, pairing: 'Raksi', shapeType: 'cylinder'
  },
  // 4. Dal Bhat Thali (Himalayan Mains)
  {
    id: 't1', category: 'Himalayan Mains', name: 'Dal Bhat Thali', nepaliName: 'दाल भात',
    description: 'Customisable set. Drag bowls of black lentil, mustard greens, and pickles.',
    ingredients: ['Black Lentil', 'Basmati Rice', 'Mustard Greens', 'Ghee', 'Pickles'], price: 28, pairing: 'Butter Tea', shapeType: 'cylinder'
  },
  // 5. Sel Roti (Sweet Summits - or placed in Mains if savory/sweet mix, putting in Sweets for balance)
  {
    id: 'b1', category: 'Sweet Summits', name: 'Sel Roti Gold', nepaliName: 'सेल रोटी',
    description: 'Crispy, ring-shaped sweet rice bread fried in ghee. Dusted with 24k gold.',
    ingredients: ['Rice Flour', 'Ghee', 'Sugar', 'Cardamom', 'Gold Dust'], price: 12, pairing: 'Masala Chiya', shapeType: 'torus'
  },
  // 6. Juju Dhau (Sweet Summits)
  {
    id: 's1', category: 'Sweet Summits', name: 'Juju Dhau', nepaliName: 'जुजु धौ',
    description: 'The "King of Curds". Thick, creamy, buffalo milk yogurt in a wobbling clay pot.',
    ingredients: ['Buffalo Milk', 'Honey', 'Saffron', 'Cardamom', 'Cloves'], price: 14, pairing: 'Dessert Wine', shapeType: 'sphere'
  },
  // 7. Yomari (Sweet Summits)
  {
    id: 's2', category: 'Sweet Summits', name: 'Yomari', nepaliName: 'योमरी',
    description: 'Steamed rice flour fig-shaped dumpling filled with molten chaku (molasses).',
    ingredients: ['Rice Flour', 'Molasses', 'Sesame', 'Coconut'], price: 14, pairing: 'Coffee', shapeType: 'sphere'
  },
  // 8. Chyang (Elixirs)
  {
    id: 'd1', category: 'Elixirs', name: 'Chyang', nepaliName: 'च्याङ',
    description: 'Traditional cloudy rice beer with rising bubbles. Sweet, sour, and sparkling.',
    ingredients: ['Rice', 'Fermentation Starter', 'Mountain Water'], price: 10, pairing: 'Spicy Choila', shapeType: 'cylinder'
  },
];

export const TABLES_DATA: Table[] = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const radius = 35; 
  return {
    id: i + 1,
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
    status: Math.random() > 0.7 ? 'occupied' : 'available',
    seats: i % 4 === 0 ? 6 : 2,
    zone: i % 3 === 0 ? 'Window' : i % 2 === 0 ? 'Prayer Flags' : 'Chulo'
  };
});

export const VIBE_DESCRIPTIONS = {
  [BookingVibe.DASHAIN]: "A feast fit for kings. Red tones, gold accents, and generous sharing platters.",
  [BookingVibe.TIHAR]: "The festival of lights. Intimate, romantic, surrounded by thousands of candles.",
  [BookingVibe.LOSAR]: "Tibetan New Year energy. Colorful, vibrant, loud, and celebratory."
};

export const THALI_ITEMS: ThaliItem[] = [
    { id: 't1', name: 'Basmati Rice', type: 'rice', color: '#F5F6F5', spiciness: 0 },
    { id: 't2', name: 'Black Lentil Dal', type: 'dal', color: '#3E2723', spiciness: 2 },
];
