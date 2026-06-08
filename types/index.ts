import { ObjectId } from "mongoose";

export interface Instrument {
  _id?: string;
  name: string;
  category: string;
  description: string;
  specifications: {
    brand?: string;
    model?: string;
    material?: string;
    color?: string;
    weight?: string;
    dimensions?: string;
  };
  price?: number;
  currency: string;
  rates?: Array<{
    minQuantity: number;
    maxQuantity: number;
    price: number;
  }>;
  greaterThanPrice?: number;
  images: string[];
  mainImage: string;
  available: boolean;
  featured: boolean;
  mostSold: boolean;
  whatsappNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: Date;
}

export interface Admin {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "super_admin";
  createdAt?: Date;
}

export interface Client {
  _id?: string;
  name: string;
  url: string;
  logoUrl: string;
  regularClient: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  search?: string;
}

export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    publicId: string;
  };
  tags: string[];
  category: string;
  author: string;
  status: "draft" | "published";
  readTime: number;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    publicId: string;
  };
  tags: string[];
  category: string;
  author: string;
  status: "draft" | "published";
}
