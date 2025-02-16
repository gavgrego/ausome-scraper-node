import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { createProduct } from './product';

export async function scrapeWebsite(url: string) {
  let driver: WebDriver | null = null;

  try {
    console.log(`Starting to fetch ${url}`);

    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    options.addArguments(
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().setTimeouts({ pageLoad: 60000 });

    await driver.get(url);

    await driver.wait(until.elementLocated(By.css('h1')), 10000);

    const productData = {
      name: await driver.findElement(By.css('h1')).getText(),
      price: await driver
        .findElement(By.css('.product-price .your-price .currency'))
        .getText(),
      productId: await driver
        .findElement(By.css('[data-sku]'))
        .getAttribute('data-sku'),
      description: await driver.findElement(By.css('.pdp-features')).getText(),
      available:
        (await driver.findElements(By.css('.out-of-stock'))).length === 0,
      lastScraped: new Date().toISOString(),
    };

    const product = await createProduct({
      name: productData.name,
      price: '4', //once i implement logging in to view price, fix
      url: url,
      last_scraped: new Date(),
    });

    console.log('Scraped product data:', product);
    return productData;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
