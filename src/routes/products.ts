import { Router } from 'express';
import { getAllProducts, getProduct } from '../services/product';
const productRoutes = Router();

productRoutes.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

productRoutes.get('/products/:id', async (req, res) => {
  try {
    const product = await getProduct(Number(req.params.id));
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default productRoutes;
