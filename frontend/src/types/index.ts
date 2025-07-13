export interface ContainerHouse {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  images: string[];
  specifications: {
    surface: number;
    bedrooms: number;
    bathrooms: number;
    containers: number;
    livingRoom: boolean;
    kitchen: boolean;
  };
  colors: Color[];
  sizes: Size[];
  features: string[];
  category: 'residential' | 'commercial' | 'office' | 'vacation';
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  priceModifier: number;
}

export interface Size {
  id: string;
  name: string;
  dimensions: string;
  priceModifier: number;
}

export interface CartItem {
  id: string;
  houseId: string;
  houseName: string;
  colorId: string;
  colorName: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface Quote {
  id: string;
  userId: string;
  houseId: string;
  houseName: string;
  colorId: string;
  sizeId: string;
  customizations: string[];
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  notes?: string;
}