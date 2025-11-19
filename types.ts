
export enum BookingVibe {
  DASHAIN = 'Dashain Feast',
  TIHAR = 'Tihar Lights',
  LOSAR = 'Losar Energy',
}

export interface Dish {
  id: string;
  name: string;
  nepaliName: string;
  description: string;
  ingredients: string[];
  price: number;
  pairing: string;
  shapeType: 'sphere' | 'torus' | 'cube' | 'cylinder'; // For 3D abstract representation
  category: string;
}

export interface Table {
  id: number;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'reserved';
  seats: number;
  zone: 'Chulo' | 'Prayer Flags' | 'Window';
}

export interface LampStat {
  time: string;
  lamps: number;
}

export interface ThaliItem {
  id: string;
  name: string;
  type: 'rice' | 'dal' | 'curry' | 'achar' | 'sweet';
  color: string;
  spiciness: number;
}

export interface KitchenStatus {
  smokeLevel: number; // 0-100
  temperature: number;
  activeChefs: number;
  lastOrderTime: string;
}
