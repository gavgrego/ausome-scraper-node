import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import products from './config/products.json';
import { scrapeWebsite } from './services/scraper';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const scrapeProducts = async () => {
  console.log('Starting to scrape products...');
  for (const product of products) {
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(
          `Scraping product: ${product} (${retries} attempts remaining)`
        );
        const data = await scrapeWebsite(product);
        console.log(`Successfully scraped: ${data.name}`);
        // avoiding rate limiting
        await new Promise((resolve) => setTimeout(resolve, 5000));
        break;
      } catch (error) {
        retries--;
        console.error(`Failed to scrape ${product}:`, error);
        if (retries > 0) {
          console.log(`Retrying in 10 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }
    }
  }
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  scrapeProducts();
});
