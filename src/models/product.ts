import pool from '../config/database';
import { Product } from '../types/types';

export const getProducts = async (): Promise<Product[]> => {
  const query = 'SELECT * FROM products ORDER BY last_scraped DESC';
  const { rows } = await pool.query(query);
  return rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

export const createProductFromScraper = async (
  product: Product
): Promise<Product> => {
  const query =
    'INSERT INTO products (name, price, last_scraped, url) VALUES ($1, $2, $3, $4) RETURNING *';
  const { rows } = await pool.query(query, [
    product.name,
    product.price,
    product.last_scraped,
    product.url,
  ]);
  return rows[0];
};
