import {
  getProducts,
  getProductById,
  createProductFromScraper,
} from '../models/product';
import { Product } from '../types/types';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProduct = async (id: number): Promise<Product | null> => {
  try {
    return await getProductById(id);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

export const createProduct = async (product: Product): Promise<Product> => {
  try {
    return await createProductFromScraper(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};
