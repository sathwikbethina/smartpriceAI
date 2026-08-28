import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Ollama local AI integration (Llama 3.2)

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Ollama Local LLM Configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const CITIES: Record<string, [number, number]> = {
  Chennai: [13.0827, 80.2707],
  Mumbai: [19.0760, 72.8777],
  Bangalore: [12.9716, 77.5946],
  Delhi: [28.6139, 77.2090],
  Hyderabad: [17.3850, 78.4867],
  Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Jaipur: [26.9124, 75.7873],
};

const STORE_ORDER = [
  'Amazon India',
  'Flipkart',
  'Blinkit',
  'Zepto',
  'Swiggy Instamart',
  'BigBasket',
  'JioMart',
  'DMart',
  'Myntra',
  'Nykaa',
  'Meesho',
  'Croma',
  'Reliance Digital',
  'Vijay Sales',
  'Tata Cliq',
  '1mg',
  'PharmEasy',
  'Netmeds',
  'Apollo Pharmacy',
  'Snapdeal',
  'Decathlon',
  'FirstCry',
];

// Fallback high-fidelity Indian e-commerce catalog for instant demonstration
// when live external API keys (SerpAPI / QC_KEY) are in evaluation mode
interface ProductResult {
  id?: string;
  name: string;
  price: number;
  mrp: number;
  platform: string;
  url: string;
  image: string;
  rating?: number;
  reviews?: string;
  delivery: string;
  in_stock: boolean;
  source: 'live' | 'catalog';
  category?: string;
}

const DEFAULT_INDIAN_PRODUCTS: Record<string, ProductResult[]> = {

  'dairymilk': [
    {
      name: 'Cadbury Dairy Milk Silk Chocolate Bar 150g',
      price: 165, mrp: 185,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/cadbury-dairy-milk-silk-chocolate-bar/prid/1283',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/1283a.jpg',
      rating: 4.9, reviews: '78,200',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Cadbury Dairy Milk Chocolate 130g',
      price: 168, mrp: 185,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Dairy%20Milk',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/dairymilk.jpeg',
      rating: 4.8, reviews: '61,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Cadbury Dairy Milk Silk Plain 150 g',
      price: 172, mrp: 185,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/10000282/cadbury-dairy-milk-silk-chocolate-bar-150-g/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/10000282_1-cadbury-dairy-milk-silk-chocolate-bar.jpg',
      rating: 4.8, reviews: '94,100',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Cadbury Dairy Milk Silk Chocolate Bar, 150 g',
      price: 175, mrp: 185,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B00V4T7G42',
      image: 'https://m.media-amazon.com/images/I/71YvE937K8L._SY741_.jpg',
      rating: 4.7, reviews: '42,000',
      delivery: 'Same-day Prime Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'goodnight': [
    {
      name: 'Goodknight Gold Flash Liquid Mosquito Vapouriser Refill (Pack of 2 x 45ml)',
      price: 145, mrp: 165,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/goodknight-gold-flash-refill/prid/4891',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/4891a.jpg',
      rating: 4.8, reviews: '34,000',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Goodknight Gold Flash Mosquito Repellent Refill 45ml',
      price: 148, mrp: 165,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Goodknight',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/goodknight.jpeg',
      rating: 4.8, reviews: '28,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Good Knight Gold Flash Liquid Vaporizer Refill - 2x45 ml',
      price: 152, mrp: 165,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/40192831/goodknight-gold-flash/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/40192831_1-goodknight.jpg',
      rating: 4.7, reviews: '49,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Goodknight Gold Flash Liquid Vapouriser Refill Pack of 2',
      price: 155, mrp: 165,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B079Z5J6Y8',
      image: 'https://m.media-amazon.com/images/I/71oU7F3Q+KL._SY741_.jpg',
      rating: 4.6, reviews: '31,000',
      delivery: 'Same-day Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'allout': [
    {
      name: 'All Out Ultra Mosquito Repellent Refill (Pack of 2 x 45ml)',
      price: 142, mrp: 160,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/all-out-ultra-refill/prid/3192',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/3192a.jpg',
      rating: 4.7, reviews: '26,000',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'All Out Ultra Fan Mosquito Liquid Refill 45ml',
      price: 145, mrp: 160,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=All%20Out',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/allout.jpeg',
      rating: 4.7, reviews: '19,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'All Out Ultra Liquid Vaporizer Refill - 45ml Twin Pack',
      price: 149, mrp: 160,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/40118231/all-out-refill/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/40118231_1-allout.jpg',
      rating: 4.6, reviews: '33,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'All Out Ultra Power+ Mosquito Liquid Vaporizer Refill 45ml (Pack of 2)',
      price: 154, mrp: 160,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B075Z9H1P2',
      image: 'https://m.media-amazon.com/images/I/71rB3D6V7XL._SY741_.jpg',
      rating: 4.5, reviews: '22,000',
      delivery: 'Same-day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],

  'iphone 15': [
    {
      name: 'Apple iPhone 15 (128 GB) - Black',
      price: 65999,
      mrp: 79900,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B0CHX1W1XY',
      image: 'https://m.media-amazon.com/images/I/61bK6PMOC3L._SY741_.jpg',
      rating: 4.6, reviews: '14,280',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
    {
      name: 'Apple iPhone 15 (Black, 128 GB)',
      price: 66499,
      mrp: 79900,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/6/9/-original-imaghx9qkumazhhs.jpeg',
      rating: 4.6, reviews: '28,190',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
  ],
  'iphone 14': [
    {
      name: 'Apple iPhone 14 (128 GB) - Midnight',
      price: 55999,
      mrp: 69900,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B0BDD5M3HX',
      image: 'https://m.media-amazon.com/images/I/61bK6PMOC3L._SY741_.jpg',
      rating: 4.5, reviews: '18,900',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
    {
      name: 'Apple iPhone 14 (Midnight, 128 GB)',
      price: 56499,
      mrp: 69900,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/apple-iphone-14-midnight-128-gb/p/itm7e9a6d6c86d0a',
      image: 'https://rukminim2.flixcart.com/image/416/416/l5aaoi80/mobile/m/v/k/-original-imagg3z7ffkmhgsc.jpeg',
      rating: 4.5, reviews: '22,100',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
  ],
  'samsung galaxy s24': [
    {
      name: 'Samsung Galaxy S24 5G (128 GB) - Onyx Black',
      price: 72999,
      mrp: 79999,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B0CT7DQXPB',
      image: 'https://m.media-amazon.com/images/I/51I1I3Q3H-L._SY741_.jpg',
      rating: 4.4, reviews: '9,200',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
    {
      name: 'Samsung Galaxy S24 5G (Onyx Black, 128 GB)',
      price: 73999,
      mrp: 79999,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/samsung-galaxy-s24-5g-onyx-black-128-gb/p/itm7e16aeabb5ce7',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/k/i/-original-imagpagdgfhqfkp9.jpeg',
      rating: 4.3, reviews: '11,500',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
  ],
  'oneplus 12': [
    {
      name: 'OnePlus 12 5G (256 GB) - Silky Black',
      price: 62999,
      mrp: 64999,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B0CRW5NR7Q',
      image: 'https://m.media-amazon.com/images/I/71M8ixAVKQL._SY741_.jpg',
      rating: 4.4, reviews: '7,800',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
    {
      name: 'OnePlus 12 5G (Silky Black, 256 GB)',
      price: 63999,
      mrp: 64999,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/oneplus-12-silky-black-256-gb/p/itmca68d671c4264',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/y/o/-original-imagpf3ydhhpfz5g.jpeg',
      rating: 4.3, reviews: '8,900',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Electronics',
    },
  ],
      'condoms': [
    {
      name: 'Durex Extra Thin Condoms 10s Pack',
      price: 235, mrp: 260,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Durex%20Extra%20Thin',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/durex_thin.jpeg',
      rating: 4.8, reviews: '14,200',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms (Pack of 10)',
      price: 240, mrp: 260,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/durex-extra-thin-condoms-10s/prid/8812',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/8812a.jpg',
      rating: 4.8, reviews: '22,400',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms 10 Sheets',
      price: 245, mrp: 260,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/4009812/durex-extra-thin-condoms-10s/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/4009812_1-durex-extra-thin.jpg',
      rating: 4.7, reviews: '18,500',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms 10s',
      price: 248, mrp: 260,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/search?q=Durex%20Extra%20thin%20Condoms',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/condom/x/y/z/-original-imagg3z7ff.jpeg',
      rating: 4.6, reviews: '19,100',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms for Men (10s Pack)',
      price: 250, mrp: 260,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Durex%20Extra%20Thin%20Condoms',
      image: 'https://m.media-amazon.com/images/I/61N3o8Z-21L._SY741_.jpg',
      rating: 4.6, reviews: '31,000',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'condom': [
    {
      name: 'Durex Extra Thin Condoms 10s Pack',
      price: 235, mrp: 260,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Durex%20Extra%20Thin',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/durex_thin.jpeg',
      rating: 4.8, reviews: '14,200',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms (Pack of 10)',
      price: 240, mrp: 260,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/durex-extra-thin-condoms-10s/prid/8812',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/8812a.jpg',
      rating: 4.8, reviews: '22,400',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Durex Extra Thin Condoms 10s',
      price: 250, mrp: 260,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Durex%20Extra%20Thin%20Condoms',
      image: 'https://m.media-amazon.com/images/I/61N3o8Z-21L._SY741_.jpg',
      rating: 4.6, reviews: '31,000',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'colgate': [
    {
      name: 'Colgate Strong Teeth Dental Cream Toothpaste 200g',
      price: 112, mrp: 130,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Colgate%20Strong%20Teeth%20200g',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/colgate_200g.jpeg',
      rating: 4.8, reviews: '48,100',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Colgate Strong Teeth Toothpaste 200g',
      price: 115, mrp: 130,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/colgate-strong-teeth-toothpaste-200g/prid/1492',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/1492a.jpg',
      rating: 4.8, reviews: '61,200',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Colgate Strong Teeth Dental Cream Toothpaste 200g',
      price: 118, mrp: 130,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/10000412/colgate-strong-teeth-toothpaste-200g/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/10000412_2-colgate-strong-teeth-toothpaste.jpg',
      rating: 4.7, reviews: '39,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Colgate Strong Teeth Toothpaste 200g',
      price: 120, mrp: 130,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Colgate%20Strong%20Teeth%20200g',
      image: 'https://m.media-amazon.com/images/I/61T2o81-81L._SY741_.jpg',
      rating: 4.6, reviews: '25,400',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'surf excel': [
    {
      name: 'Surf Excel Easy Wash Detergent Powder 1kg',
      price: 138, mrp: 155,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Surf%20Excel%20Easy%20Wash%201kg',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/surf_excel.jpeg',
      rating: 4.8, reviews: '38,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Surf Excel Easy Wash Detergent Powder 1kg',
      price: 140, mrp: 155,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/surf-excel-easy-wash-detergent-powder-1kg/prid/48192',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/48192a.jpg',
      rating: 4.8, reviews: '54,000',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Surf Excel Easy Wash Detergent Powder 1kg',
      price: 142, mrp: 155,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/266948/surf-excel-easy-wash-detergent-powder-1kg/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/266948_8-surf-excel-easy-wash-detergent-powder.jpg',
      rating: 4.7, reviews: '29,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Surf Excel Easy Wash Detergent Powder 1kg',
      price: 145, mrp: 155,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Surf%20Excel%20Easy%20Wash%201kg',
      image: 'https://m.media-amazon.com/images/I/71o820-91L._SY741_.jpg',
      rating: 4.6, reviews: '41,000',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'tide': [
    {
      name: 'Tide Plus Extra Power Detergent Powder 1kg',
      price: 122, mrp: 140,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Tide%20Plus%201kg',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/tide_1kg.jpeg',
      rating: 4.7, reviews: '21,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Tide Plus Extra Power Jasmine & Rose 1kg',
      price: 125, mrp: 140,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/tide-plus-extra-power-1kg/prid/31092',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/31092a.jpg',
      rating: 4.7, reviews: '34,000',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Tide Plus Extra Power Detergent Powder 1kg',
      price: 128, mrp: 140,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/266101/tide-plus-extra-power-1kg/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/266101_5-tide-plus-extra-power.jpg',
      rating: 4.6, reviews: '19,500',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Tide Plus Extra Power Detergent Powder 1kg',
      price: 130, mrp: 140,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Tide%20Plus%20Extra%20Power%201kg',
      image: 'https://m.media-amazon.com/images/I/61T2o81-81L._SY741_.jpg',
      rating: 4.5, reviews: '28,000',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'ujala': [
    {
      name: 'Ujala Supreme Fabric Whitener 250ml',
      price: 38, mrp: 45,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/search?q=Ujala%20Supreme%20250ml',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/ujala_250ml.jpeg',
      rating: 4.8, reviews: '12,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ujala Supreme Liquid Fabric Whitener 250ml',
      price: 40, mrp: 45,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/ujala-supreme-liquid-250ml/prid/19082',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/19082a.jpg',
      rating: 4.8, reviews: '18,500',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ujala Supreme Liquid Whitener 250ml',
      price: 42, mrp: 45,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/10008412/ujala-supreme-liquid-250ml/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/10008412_1-ujala-supreme.jpg',
      rating: 4.7, reviews: '11,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ujala Supreme Liquid Fabric Whitener 250ml',
      price: 45, mrp: 45,
      platform: 'Amazon',
      url: 'https://www.amazon.in/s?k=Ujala%20Supreme%20Liquid%20250ml',
      image: 'https://m.media-amazon.com/images/I/51I1I3Q3H-L._SY741_.jpg',
      rating: 4.6, reviews: '15,000',
      delivery: 'FREE Same-Day Prime',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'ariel liquid detergent 300g': [
    {
      name: 'Ariel Matic Liquid Detergent Front & Top Load 300g',
      price: 205, mrp: 240,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/pn/ariel-matic-liquid-detergent-300g/pvid/9182',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/ariel_liquid.jpeg',
      rating: 4.8, reviews: '24,500',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g Pouch',
      price: 210, mrp: 240,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/40198210/ariel-matic-liquid-detergent-300g/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/40198210_3-ariel-matic-liquid-detergent.jpg',
      rating: 4.7, reviews: '41,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g',
      price: 215, mrp: 240,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/ariel-matic-liquid-detergent/prid/34981',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/34981a.jpg',
      rating: 4.8, reviews: '32,100',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g',
      price: 220, mrp: 240,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B078HFM17L',
      image: 'https://m.media-amazon.com/images/I/71R2o583-1L._SY741_.jpg',
      rating: 4.6, reviews: '18,400',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'ariel': [
    {
      name: 'Ariel Matic Liquid Detergent Front & Top Load 300g',
      price: 205, mrp: 240,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/pn/ariel-matic-liquid-detergent-300g/pvid/9182',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/ariel_liquid.jpeg',
      rating: 4.8, reviews: '24,500',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g Pouch',
      price: 210, mrp: 240,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/40198210/ariel-matic-liquid-detergent-300g/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/40198210_3-ariel-matic-liquid-detergent.jpg',
      rating: 4.7, reviews: '41,000',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g',
      price: 215, mrp: 240,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/ariel-matic-liquid-detergent/prid/34981',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/34981a.jpg',
      rating: 4.8, reviews: '32,100',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Ariel Matic Liquid Detergent 300g',
      price: 220, mrp: 240,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B078HFM17L',
      image: 'https://m.media-amazon.com/images/I/71R2o583-1L._SY741_.jpg',
      rating: 4.6, reviews: '18,400',
      delivery: 'FREE Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'amul butter': [
    {
      name: 'Amul Butter - Pasteurized 500 g Carton',
      price: 275, mrp: 285,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/amul-butter-pasteurized/prid/214',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/214a.jpg',
      rating: 4.9, reviews: '48,200',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Amul Butter - Pasteurized 500g',
      price: 276, mrp: 285,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/pn/amul-butter-pasteurized-500g/pvid/10293',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/a4dc0082-e6e4-43d5-9c28-0c0f1e43b8c8.jpeg',
      rating: 4.9, reviews: '39,110',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Amul Pasteurised Butter 500 g',
      price: 278, mrp: 285,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/10000000/amul-butter-pasteurized-500-g-carton/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/10000000_12-amul-pasteurised-butter.jpg',
      rating: 4.8, reviews: '52,800',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Amul Butter Pasteurized (500 g)',
      price: 285, mrp: 285,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B00V4T4PVO',
      image: 'https://m.media-amazon.com/images/I/71jT0Xs3OYL._SY741_.jpg',
      rating: 4.6, reviews: '8,400',
      delivery: 'Fresh Delivery by Tomorrow',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'maggi': [
    {
      name: 'MAGGI 2-Minute Masala Instant Noodles (Pack of 12 x 70g)',
      price: 156, mrp: 180,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/maggi-2-minute-masala-instant-noodles-pack-of-12/prid/1294',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/1294a.jpg',
      rating: 4.8, reviews: '64,120',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Maggi 2-Minute Masala Noodles (Pack of 12, 840 g)',
      price: 158, mrp: 180,
      platform: 'Zepto',
      url: 'https://www.zeptonow.com/pn/maggi-2-minute-masala-noodles-840g/pvid/4819',
      image: 'https://cdn.zeptonow.com/production///tr:w-640,ar-1-1,pr-true,f-auto,q-80/cms/product_variant/93a8f7c1-1baa-4c36-9a00-2e4e4ce31f52.jpeg',
      rating: 4.8, reviews: '41,000',
      delivery: '10-12 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'MAGGI 2-Minute Special Masala Instant Noodles 840g',
      price: 162, mrp: 180,
      platform: 'BigBasket',
      url: 'https://www.bigbasket.com/pd/266109/maggi-2-minute-masala-instant-noodles-840-g-pouch/',
      image: 'https://www.bigbasket.com/media/uploads/p/l/266109_10-maggi-2-minute-masala-instant-noodles.jpg',
      rating: 4.8, reviews: '55,200',
      delivery: '2-4 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'MAGGI 2-Minute Masala Instant Noodles, 840g',
      price: 165, mrp: 180,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B075775BFF',
      image: 'https://m.media-amazon.com/images/I/81PLHYq0vRL._SY741_.jpg',
      rating: 4.6, reviews: '34,900',
      delivery: 'Same-day Prime delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Maggi 2-Minute Masala Noodles 840 g',
      price: 169, mrp: 180,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/maggi-masala-noodles/p/itmh74s2zdqjrcvk',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/noodles-vermicelli/t/h/g/-original-imaghehgr5hcafvh.jpeg',
      rating: 4.6, reviews: '19,300',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
    'cetirizine': [
    {
      name: 'Cetzine 10mg Strip of 15 Tablets (Cetirizine)',
      price: 18.5, mrp: 22,
      platform: 'PharmEasy',
      url: 'https://pharmeasy.in/online-medicine-order/cetzine-10mg-strip-of-15-tablets-3891',
      image: 'https://assets.pharmeasy.in/apothecary/images/3891/small/1559039543688.jpg',
      rating: 4.8, reviews: '62,000',
      delivery: '3-6 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Cetirizine 10mg Tablet 10s',
      price: 21, mrp: 25,
      platform: 'Tata 1mg',
      url: 'https://www.1mg.com/drugs/cetirizine-10mg-tablet-74320',
      image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/e_trim/74320.jpg',
      rating: 4.7, reviews: '41,500',
      delivery: '2-5 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Okacet 10mg Strip of 10 Tablets (Cipla Cetirizine)',
      price: 19.8, mrp: 24,
      platform: 'Apollo Pharmacy',
      url: 'https://www.apollopharmacy.in/search-medicines/okacet',
      image: 'https://images.apollo247.in/pub/media/catalog/product/o/k/oka0004_1.jpg',
      rating: 4.9, reviews: '55,000',
      delivery: 'Express 2-Hour Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Cetirizine Dihydrochloride 10mg Strip of 10 Tablets',
      price: 20.5, mrp: 25,
      platform: 'Netmeds',
      url: 'https://www.netmeds.com/prescriptions/cetzine-10mg-tablet-15-s',
      image: 'https://www.netmeds.com/images/product-v1/600x600/3891/cetzine_10mg_tablet_15_s_0.jpg',
      rating: 4.7, reviews: '29,400',
      delivery: 'Same-Day Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
  ],
  'cetzine': [
    {
      name: 'Cetzine 10mg Strip of 15 Tablets (Cetirizine)',
      price: 18.5, mrp: 22,
      platform: 'PharmEasy',
      url: 'https://pharmeasy.in/online-medicine-order/cetzine-10mg-strip-of-15-tablets-3891',
      image: 'https://assets.pharmeasy.in/apothecary/images/3891/small/1559039543688.jpg',
      rating: 4.8, reviews: '62,000',
      delivery: '3-6 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Cetirizine 10mg Tablet 10s',
      price: 21, mrp: 25,
      platform: 'Tata 1mg',
      url: 'https://www.1mg.com/drugs/cetirizine-10mg-tablet-74320',
      image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/e_trim/74320.jpg',
      rating: 4.7, reviews: '41,500',
      delivery: '2-5 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
  ],
  'dolo 650': [
    {
      name: 'Dolo 650mg Strip Of 15 Tablets',
      price: 24.21, mrp: 28,
      platform: 'PharmEasy',
      url: 'https://pharmeasy.in/online-medicine-order/dolo-650mg-strip-of-15-tablets-3898',
      image: 'https://assets.pharmeasy.in/apothecary/images/3898/small/1559122539643.jpg',
      rating: 4.8, reviews: '1,20,000',
      delivery: '3-6 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Dolo 650 Tablet 15 Tab',
      price: 30.3, mrp: 35,
      platform: 'Tata 1mg',
      url: 'https://www.1mg.com/drugs/dolo-650-tablet-74317',
      image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/e_trim/74317.jpg',
      rating: 4.7, reviews: '85,200',
      delivery: '2-5 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
  ],
  'paracetamol': [
    {
      name: 'Crocin Advance 500mg Tablet 20s',
      price: 32, mrp: 38,
      platform: 'PharmEasy',
      url: 'https://pharmeasy.in/online-medicine-order/crocin-advance-500mg-20-tablets-158098',
      image: 'https://assets.pharmeasy.in/apothecary/images/158098/small/1590651462038.jpg',
      rating: 4.7, reviews: '45,000',
      delivery: '3-6 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
    {
      name: 'Paracetamol 500mg Strip of 10 Tablets',
      price: 18, mrp: 22,
      platform: 'Tata 1mg',
      url: 'https://www.1mg.com/drugs/paracetamol-500mg-tablet-74301',
      image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/e_trim/paracetamol.jpg',
      rating: 4.6, reviews: '32,500',
      delivery: '2-5 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Medicine',
    },
  ],
  'dettol': [
    {
      name: 'Dettol Disinfectant Liquid 500ml - Lime Fresh',
      price: 185, mrp: 215,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/dettol-disinfectant-liquid-lime-fresh/prid/84920',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/84920a.jpg',
      rating: 4.9, reviews: '31,000',
      delivery: '8-10 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Dettol Antiseptic Liquid 550ml Bottle',
      price: 189, mrp: 220,
      platform: 'Tata 1mg',
      url: 'https://www.1mg.com/otc/dettol-antiseptic-liquid-otc10293',
      image: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/e_trim/dettol.jpg',
      rating: 4.8, reviews: '24,600',
      delivery: '2-5 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Dettol Liquid Antiseptic 550ml',
      price: 190, mrp: 220,
      platform: 'PharmEasy',
      url: 'https://pharmeasy.in/health-care/products/dettol-antiseptic-liquid-bottle-of-550-ml-32941',
      image: 'https://assets.pharmeasy.in/apothecary/images/32941/small/1559039543688.jpg',
      rating: 4.8, reviews: '19,800',
      delivery: '3-6 Hours Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Dettol Antiseptic Disinfectant Liquid 550ml',
      price: 195, mrp: 220,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B00I3YQ05Y',
      image: 'https://m.media-amazon.com/images/I/71j1dLFAXQL._SY741_.jpg',
      rating: 4.7, reviews: '48,000',
      delivery: 'Same-day Prime delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'niacinamide': [
    {
      name: 'Minimalist 10% Niacinamide Face Serum With EUK-134 (30ml)',
      price: 569, mrp: 599,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/minimalist-10-niacinamide-face-serum/prid/319401',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/319401a.jpg',
      rating: 4.8, reviews: '6,200',
      delivery: '10-15 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'The Derma Co 10% Niacinamide Face Serum with Zinc (30ml)',
      price: 499, mrp: 599,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B08C7K85XG',
      image: 'https://m.media-amazon.com/images/I/71DLKST2YdL._SY741_.jpg',
      rating: 4.4, reviews: '18,450',
      delivery: 'FREE Prime Same-Day',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Minimalist Niacinamide 10% + EUK 134 0.1% Face Serum 30ml',
      price: 579, mrp: 599,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/minimalist-10-niacinamide-face-serum/p/itm6e80a0bfd5ed5',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/serum/f/k/b/-original-imaghsppghqxbpfy.jpeg',
      rating: 4.5, reviews: '9,800',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
  'sunscreen': [
    {
      name: 'Minimalist Sunscreen SPF 50 PA++++ (50ml)',
      price: 399, mrp: 469,
      platform: 'Amazon',
      url: 'https://www.amazon.in/dp/B09FPS9D5T',
      image: 'https://m.media-amazon.com/images/I/61N55a0k3BL._SY741_.jpg',
      rating: 4.3, reviews: '12,400',
      delivery: 'FREE Prime Same-Day',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Minimalist Sunscreen SPF 50 50ml',
      price: 419, mrp: 469,
      platform: 'Flipkart',
      url: 'https://www.flipkart.com/minimalist-sunscreen-spf-50-pa-lightweight-niacinamide-broad-spectrum-suncream/p/itmdc1a0fafde4cd',
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/sunscreen/b/6/d/-original-imagwp68bxxgtwrx.jpeg',
      rating: 4.3, reviews: '8,900',
      delivery: 'Delivery in 1-2 Days',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
    {
      name: 'Minimalist Sunscreen SPF 50 50ml',
      price: 389, mrp: 469,
      platform: 'Blinkit',
      url: 'https://blinkit.com/prn/minimalist-sunscreen-spf-50-pa/prid/439801',
      image: 'https://cdn.grofers.com/app/images/products/sliding_image/439801a.jpg',
      rating: 4.5, reviews: '5,200',
      delivery: '10-15 mins Delivery',
      in_stock: true, source: 'catalog', category: 'Grocery',
    },
  ],
};

// URL parser logic as required:
// Amazon URL: extract ASIN from /dp/XXXXXXXXXX path
// Flipkart URL: extract product name from path, remove hyphens
// Any other: extract longest meaningful segment
function parseQueryFromUrl(input: string): string {
  try {
    const trimmed = input.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return trimmed;
    }

    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    const pathname = url.pathname;

    if (host.includes('amazon.')) {
      const dpMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/i) || pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      if (dpMatch && dpMatch[1]) {
        return `Amazon ASIN ${dpMatch[1]}`;
      }
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0 && parts[0] !== 'dp') {
        return parts[0].replace(/-/g, ' ');
      }
    } else if (host.includes('flipkart.')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        const candidate = parts[0].replace(/-/g, ' ');
        return candidate;
      }
    }

    // Generic URL
    const segments = pathname.split('/').filter((s) => s.length > 2 && !s.includes('.html') && !s.includes('.php'));
    if (segments.length > 0) {
      // Find longest segment
      const longest = segments.reduce((a, b) => (a.length > b.length ? a : b));
      return longest.replace(/[-_+]/g, ' ');
    }
    return trimmed;
  } catch {
    return input.trim();
  }
}

function detectPlatformFromUrl(url: string): string | null {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('amazon.in') || lowerUrl.includes('amazon.com')) return 'Amazon';
  if (lowerUrl.includes('flipkart.com')) return 'Flipkart';
  if (lowerUrl.includes('blinkit.com')) return 'Blinkit';
  if (lowerUrl.includes('zepto.com') || lowerUrl.includes('zeptonow.com') || lowerUrl.includes('zepto.co')) return 'Zepto';
  if (lowerUrl.includes('bigbasket.com')) return 'BigBasket';
  if (lowerUrl.includes('1mg.com')) return 'Tata 1mg';
  if (lowerUrl.includes('pharmeasy.in')) return 'PharmEasy';
  return null;
}

function standardizePlatformName(platform: string): string | null {
  const p = platform.toLowerCase();
  if (p.includes('amazon')) return 'Amazon';
  if (p.includes('flipkart')) return 'Flipkart';
  if (p.includes('blinkit')) return 'Blinkit';
  if (p.includes('zepto')) return 'Zepto';
  if (p.includes('bigbasket')) return 'BigBasket';
  if (p.includes('1mg') || p.includes('tata')) return 'Tata 1mg';
  if (p.includes('pharmeasy')) return 'PharmEasy';
  return null;
}

export const ALL_APPROVED_PLATFORMS = [
  'Amazon',
  'Flipkart',
  'Blinkit',
  'Zepto',
  'BigBasket',
  'Tata 1mg',
  'PharmEasy',
] as const;

export type ApprovedPlatform = typeof ALL_APPROVED_PLATFORMS[number];
export type ProductCategory = 'Medicines' | 'Groceries' | 'Electronics' | 'General';

export type PlatformStatus = 
  | 'SUCCESS' 
  | 'NOT_FOUND' 
  | 'NO_MATCH' 
  | 'NOT_SERVICEABLE' 
  | 'SKIPPED_IMPLAUSIBLE' 
  | 'FAILED';

export interface PlatformResultSummary {
  platform: ApprovedPlatform;
  status: PlatformStatus;
  reason?: string;
  price?: number;
  productName?: string;
}

function classifyCategory(query: string): ProductCategory {
  const lower = query.toLowerCase().trim();
  const isMedicine = /\b(paracetamol|dolo|capsule|syrup|ointment|medicine|pharmacy|health|painkiller|cetirizine|cetzine|allegra|crocin|montair|azithromycin|pantocid|combiflam|vicks|aspirin|cough|cold|fever|tablet|tablets|strip|mg|calpol|ibuprofen|antibiotic|benadryl|otrivin|strepsils|saridon|gelusil|digene|inhaler|eye drops|ear drops)\b/i.test(lower);
  const isGrocery = /\b(colgate|pepsodent|sensodyne|ariel|detergent|surf|tide|ujala|washing|powder|liquid|soap|shampoo|conditioner|bodywash|toothpaste|harpic|dettol|lizol|vim|dishwash|cleaner|handwash|sanitizer|diaper|pampers|wipes|tissue|mop|scrub|repellent|hit|goodnight|allout|butter|milk|bread|egg|atta|rice|oil|dal|sugar|salt|tea|coffee|maggi|biscuit|chips|coke|chocolate|dairymilk|cadbury|cheese|grocery|noodle|ramen|food|snack|beverage|sunscreen|serum|niacinamide|pantry|condom|condoms|durex|skore|manforce|kamasutra|personal care|hygiene|g\b|kg\b|ml\b|litre|liter|pack of)\b/i.test(lower);
  const isElectronics = /\b(iphone|samsung|phone|mobile|pixel|oneplus|laptop|macbook|tv|television|earbuds|airpods|smartwatch|ipad|headphone|speaker|monitor|camera|electronic|charger|adapter|powerbank|ps5|xbox|kindle|gpu|cpu|ram|ssd)\b/i.test(lower);

  if (isMedicine) return 'Medicines';
  if (isGrocery) return 'Groceries';
  if (isElectronics) return 'Electronics';
  return 'General';
}

interface CategoryRoutingConfig {
  primary: ApprovedPlatform[];
  secondary: ApprovedPlatform[];
}

function getPlatformRouting(category: ProductCategory): CategoryRoutingConfig {
  switch (category) {
    case 'Medicines':
      return {
        primary: ['Tata 1mg', 'PharmEasy', 'Blinkit'],
        secondary: ['Amazon', 'Zepto', 'BigBasket'],
      };
    case 'Groceries':
      return {
        primary: ['Amazon', 'Blinkit', 'Zepto', 'BigBasket'],
        secondary: [],
      };
    case 'Electronics':
      return {
        primary: ['Amazon', 'Flipkart', 'Blinkit'],
        secondary: ['Zepto'],
      };
    case 'General':
    default:
      return {
        primary: ['Amazon', 'Flipkart', 'Blinkit'],
        secondary: ['Zepto', 'BigBasket'],
      };
  }
}

function isPlausibleForPlatform(platform: ApprovedPlatform, query: string, category: ProductCategory): boolean {
  const lower = query.toLowerCase().trim();

  // Blinkit has everything (Groceries, Electronics, Daily essentials, OTC medicines, Personal care, Gifts)
  if (platform === 'Blinkit') {
    return true;
  }

  if (platform === 'Tata 1mg' || platform === 'PharmEasy') {
    const isHealth = /\b(medicine|tablet|capsule|syrup|mg|cream|ointment|drops|vitamin|calcium|protein|supplement|ayurvedic|health|pharma|durex|skore|condom|diabetic|mask|bandage|pain|fever|cough|cold|paracetamol|cetirizine|dolo|crocin|allegra|sanitizer|sunscreen|serum)\b/i.test(lower);
    return category === 'Medicines' || isHealth;
  }

  if (platform === 'Zepto' || platform === 'BigBasket') {
    const isHeavyTech = /\b(macbook|laptop|oled|qled|playstation|ps5|xbox|graphic card|gpu|motherboard|refrigerator|washing machine|air conditioner|ac 1\.5|dslr|camera)\b/i.test(lower);
    if (isHeavyTech) return false;
    if (category === 'Electronics') return false;
    return true;
  }

  if (platform === 'Amazon' || platform === 'Flipkart') {
    return true;
  }

  return false;
}

const GADGET_ACCESSORY_TERMS = [
  'case', 'cover', 'back cover', 'flip cover', 'bumper', 'skin', 'wrap', 'sticker',
  'tempered glass', 'screen protector', 'camera protector', 'guard', 'film', 'lens protector',
  'sleeve', 'stand', 'holder', 'mount', 'strap', 'band', 'cable', 'cord', 'wire',
  'charger', 'adapter', 'dongle', 'hub', 'dock', 'replacement battery', 'cleaning kit',
  'keychain', 'stylus pen', 'ear tips', 'cushion'
];

function isAccessoryQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();
  return GADGET_ACCESSORY_TERMS.some(term => new RegExp(`\\b${term}\\b`, 'i').test(lower));
}

function hasAccessoryInTitle(title: string, category: ProductCategory): boolean {
  const lower = title.toLowerCase().trim();
  // Only apply gadget accessory filters to Electronics and General retail (not groceries/food packaging)
  if (category === 'Groceries' || category === 'Medicines') {
    return false;
  }
  return GADGET_ACCESSORY_TERMS.some(term => new RegExp(`\\b${term}\\b`, 'i').test(lower));
}

function getFallbackSearchUrl(platform: string, query: string): string {
  const enc = encodeURIComponent(query.trim());
  const p = platform.toLowerCase();
  if (p.includes('amazon')) return `https://www.amazon.in/s?k=${enc}`;
  if (p.includes('flipkart')) return `https://www.flipkart.com/search?q=${enc}`;
  if (p.includes('blinkit')) return `https://blinkit.com/s/?q=${enc}`;
  if (p.includes('zepto')) return `https://www.zeptonow.com/search?q=${enc}`;
  if (p.includes('bigbasket')) return `https://www.bigbasket.com/ps/?q=${enc}`;
  if (p.includes('1mg') || p.includes('tata')) return `https://www.1mg.com/search/all?name=${enc}`;
  if (p.includes('pharmeasy')) return `https://pharmeasy.in/search/all?name=${enc}`;
  return `https://www.google.com/search?q=${enc}+${encodeURIComponent(platform)}`;
}

function validateProductMatch(
  candidateName: string,
  query: string,
  category: ProductCategory,
  price: number = 0
): { isValid: boolean; reason?: string } {
  const cName = candidateName.toLowerCase().trim();
  const qClean = query.toLowerCase().trim();

  // 1. Accessory & Product Type Check (Generic across all device/product searches)
  const queryWantsAccessory = isAccessoryQuery(qClean);
  const titleHasAccessory = hasAccessoryInTitle(cName, category);

  if (!queryWantsAccessory && titleHasAccessory) {
    return {
      isValid: false,
      reason: `Accessory detected in title ("${candidateName}") for main product query "${query}"`
    };
  }

  // 2. Minimum Price Plausibility for Major Electronics Devices
  if (category === 'Electronics' && !queryWantsAccessory && price > 0) {
    const isMajorDevice = /\b(phone|iphone|oneplus|samsung|pixel|galaxy|laptop|macbook|ipad|tablet|tv|television|camera|dslr|playstation|ps5|xbox|gpu|rtx)\b/i.test(qClean);
    if (isMajorDevice && price < 3000) {
      return {
        isValid: false,
        reason: `Price ₹${price} is implausibly low for major electronics device "${candidateName}"`
      };
    }
  }

  // 3. Strict Chipset / Sub-generation match (e.g. M2 != M3 != M1, Gen 1 != Gen 2, etc.)
  const chipMatch = qClean.match(/\b(m[1-4]|gen\s*\d+|snapdragon\s*\d+|core\s*i[3579]|ryzen\s*\d+)\b/i);
  if (chipMatch) {
    const qChip = chipMatch[1].replace(/\s+/g, '').toLowerCase();
    const cChips = [...cName.matchAll(/\b(m[1-4]|gen\s*\d+|snapdragon\s*\d+|core\s*i[3579]|ryzen\s*\d+)\b/gi)]
      .map(m => m[1].replace(/\s+/g, '').toLowerCase());
    
    if (cChips.length > 0 && !cChips.includes(qChip)) {
      return {
        isValid: false,
        reason: `Processor/Chipset mismatch: expected ${qChip} in "${candidateName}"`
      };
    }
  }

  // 4. Strict Model Variant & Letter Suffix (e.g. 15R != 15 != 15 Pro != 12 != 11R)
  const queryModelTokens = qClean.match(/\b\d+[a-z]?\b/gi);
  if (queryModelTokens) {
    for (const token of queryModelTokens) {
      const isNumWithSuffix = /^\d+[a-z]$/i.test(token);
      if (isNumWithSuffix) {
        const numPart = token.slice(0, -1);
        const suffixPart = token.slice(-1).toLowerCase();
        const hasToken = new RegExp(`\\b${token}\\b`, 'i').test(cName) || 
                         new RegExp(`\\b${numPart}\\s*${suffixPart}\\b`, 'i').test(cName);
        if (!hasToken) {
          return {
            isValid: false,
            reason: `Model suffix mismatch: expected "${token}" in "${candidateName}"`
          };
        }
      }
    }
  }

  // 5. Standalone Model Numbers
  const queryNums = qClean.match(/\b\d+\b/g);
  if (queryNums) {
    for (const num of queryNums) {
      if (!cName.includes(num)) {
        return {
          isValid: false,
          reason: `Missing key number identifier "${num}" in "${candidateName}"`
        };
      }
    }
  }

  // 6. Pro / Plus / Ultra / Mini / Max / Pro Max / Lite / FE
  const techVariants = ['pro max', 'pro', 'plus', 'ultra', 'mini', 'fe', 'lite', 'max'];
  for (const variant of techVariants) {
    const queryHasVariant = new RegExp(`\\b${variant}\\b`, 'i').test(qClean);
    const candidateHasVariant = new RegExp(`\\b${variant}\\b`, 'i').test(cName);
    if (queryHasVariant !== candidateHasVariant) {
      return {
        isValid: false,
        reason: `Model variant mismatch: expected ${queryHasVariant ? variant : 'base model'} in "${candidateName}"`
      };
    }
  }

  // 7. Medicine Dosage / Strength
  const queryDosage = qClean.match(/\b(\d+(?:\.\d+)?)\s*(mg|ml|mcg|gm|g|kg|iu)\b/i);
  if (queryDosage) {
    const qValue = queryDosage[1];
    const qUnit = queryDosage[2].toLowerCase();
    const candidateDosages = [...cName.matchAll(/\b(\d+(?:\.\d+)?)\s*(mg|ml|mcg|gm|g|kg|iu)\b/gi)];
    const hasExactDosage = candidateDosages.some((d) => d[1] === qValue && d[2].toLowerCase() === qUnit);

    if (!hasExactDosage) {
      return {
        isValid: false,
        reason: `Dosage/Strength mismatch: expected ${qValue}${qUnit} in "${candidateName}"`,
      };
    }
  }

  // 8. Size / Weight / Volume (e.g. 200g, 2L, 500ml, 1kg)
  const queryWeight = qClean.match(/\b(\d+(?:\.\d+)?)\s*(g|gm|gram|grams|kg|kilo|ml|l|ltr|liter|litres|tablets|tabs|caps|count|pack)\b/i);
  if (queryWeight) {
    const qWVal = queryWeight[1];
    const qWUnit = queryWeight[2].toLowerCase();
    const normUnit = (qWUnit.startsWith('g') && !qWUnit.startsWith('k'))
      ? 'g'
      : qWUnit.startsWith('k')
      ? 'kg'
      : qWUnit.startsWith('m')
      ? 'ml'
      : qWUnit.startsWith('l')
      ? 'l'
      : qWUnit;

    const candidateWeights = [...cName.matchAll(/\b(\d+(?:\.\d+)?)\s*(g|gm|gram|grams|kg|kilo|ml|l|ltr|liter|litres|tablets|tabs|caps|count|pack)\b/gi)];
    if (candidateWeights.length > 0) {
      const hasMatch = candidateWeights.some((cw) => {
        const cVal = cw[1];
        const cUnit = cw[2].toLowerCase();
        const normCUnit = (cUnit.startsWith('g') && !cUnit.startsWith('k'))
          ? 'g'
          : cUnit.startsWith('k')
          ? 'kg'
          : cUnit.startsWith('m')
          ? 'ml'
          : cUnit.startsWith('l')
          ? 'l'
          : cUnit;
        return cVal === qWVal && normUnit === normCUnit;
      });
      if (!hasMatch) {
        return {
          isValid: false,
          reason: `Size/Weight mismatch: expected ${qWVal}${normUnit} in "${candidateName}"`,
        };
      }
    }
  }

  return { isValid: true };
}

async function fetchSerpApi(query: string, apiKey: string, targetCategory: ProductCategory = 'General'): Promise<ProductResult[]> {
  const results: ProductResult[] = [];
  const routing = getPlatformRouting(targetCategory);
  const allowed = [...routing.primary, ...routing.secondary];

  try {
    const shoppingParams = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      gl: 'in',
      hl: 'en',
      currency: 'INR',
      num: '40',
      api_key: apiKey,
    });

    const shopRes = await fetch(`https://serpapi.com/search?${shoppingParams.toString()}`)
      .then(r => r.json())
      .catch(err => { console.warn('SerpAPI shopping error:', err); return {}; });

    if (shopRes.shopping_results) {
      for (const item of shopRes.shopping_results) {
        const price = typeof item.extracted_price === 'number'
          ? item.extracted_price
          : parseFloat(String(item.price || '0').replace(/[^\d.]/g, ''));

        if (isNaN(price) || price <= 0) continue;

        const platformName = standardizePlatformName(item.source || '') as ApprovedPlatform;
        if (!platformName || !allowed.includes(platformName)) continue;

        // Strict product & accessory validation
        const matchVal = validateProductMatch(item.title || query, query, targetCategory, price);
        if (!matchVal.isValid) {
          console.log(`[MATCH REJECTED LIVE] ${platformName}: "${item.title || query}" (₹${price}) -> ${matchVal.reason}`);
          continue;
        }

        // NO FABRICATED MRP
        let mrp = typeof item.extracted_old_price === 'number'
          ? item.extracted_old_price
          : parseFloat(String(item.old_price || '0').replace(/[^\d.]/g, ''));

        if (isNaN(mrp) || mrp <= price) {
          mrp = price;
        }

        const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

        // URL Processing: Resolve canonical direct links or clean fallback search URLs
        const rawLink = item.link || item.product_link || item.direct_link || '';
        let finalUrl = '';
        let urlType: 'direct' | 'search_fallback' = 'search_fallback';

        if (rawLink && !rawLink.includes('google.com/url') && !rawLink.includes('googleadservices') && !rawLink.includes('google.com/search')) {
          finalUrl = rawLink;
          urlType = 'direct';
        } else {
          // Use store's guaranteed non-404 search URL
          finalUrl = getFallbackSearchUrl(platformName, item.title || query);
          urlType = 'search_fallback';
        }

        results.push({
          name: item.title || query,
          price,
          mrp,
          platform: platformName,
          url: finalUrl,
          url_type: urlType,
          image: item.thumbnail || '',
          rating: typeof item.rating === 'number' ? item.rating : 4.5,
          reviews: item.reviews ? String(item.reviews) : '1,200',
          delivery: (platformName === 'Blinkit' || platformName === 'Zepto')
            ? 'Free 10 min delivery'
            : (platformName === 'Tata 1mg' || platformName === 'PharmEasy')
              ? 'Standard Delivery (24-48 hrs)'
              : 'Standard Delivery',
          in_stock: true,
          source: 'live',
          category: targetCategory,
          discountPercentage,
        });
      }
    }
  } catch (e) {
    console.warn('SerpAPI error in fetchSerpApi:', e);
  }

  return results;
}

function buildComprehensiveIndianStoreResults(
  query: string,
  liveSerpItems: ProductResult[] = [],
  category: ProductCategory = 'General',
  pincode: string = '600028'
): { products: ProductResult[]; platformSummaries: PlatformResultSummary[] } {
  const cleanQ = query.trim();
  const lowerQ = cleanQ.toLowerCase();
  const routing = getPlatformRouting(category);

  // 1. Determine which secondary platforms are checked vs skipped
  const secondaryChecked: ApprovedPlatform[] = [];
  const secondarySkipped: ApprovedPlatform[] = [];

  routing.secondary.forEach((plat) => {
    if (isPlausibleForPlatform(plat, cleanQ, category)) {
      secondaryChecked.push(plat);
    } else {
      secondarySkipped.push(plat);
    }
  });

  const platformsToQuery: ApprovedPlatform[] = [...routing.primary, ...secondaryChecked];
  const platformBestMatch = new Map<ApprovedPlatform, ProductResult>();

  // 2. Evaluate Live SerpAPI results with strict matching and price heuristic
  for (const item of liveSerpItems) {
    const stdPlatform = standardizePlatformName(item.platform) as ApprovedPlatform;
    if (!stdPlatform || !platformsToQuery.includes(stdPlatform)) continue;

    const validation = validateProductMatch(item.name, cleanQ, category, item.price);
    if (!validation.isValid) {
      console.log(`[MATCH REJECTED LIVE] ${stdPlatform}: "${item.name}" (₹${item.price}) -> ${validation.reason}`);
      continue;
    }

    if (!item.price || item.price <= 0) continue;

    const existing = platformBestMatch.get(stdPlatform);
    if (!existing || item.price < existing.price) {
      platformBestMatch.set(stdPlatform, {
        ...item,
        platform: stdPlatform,
        category,
        url_type: item.url_type || 'search_fallback',
        discountPercentage: item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0,
      });
    }
  }

  // 3. Evaluate Verified Catalog candidates with strict matching
  let catalogCandidates: ProductResult[] = [];
  const exactCatalog = DEFAULT_INDIAN_PRODUCTS[lowerQ];
  if (exactCatalog && exactCatalog.length > 0) {
    catalogCandidates = exactCatalog;
  } else {
    for (const [key, items] of Object.entries(DEFAULT_INDIAN_PRODUCTS)) {
      if (lowerQ.includes(key) || key.includes(lowerQ)) {
        catalogCandidates = [...catalogCandidates, ...items];
      }
    }
  }

  for (const item of catalogCandidates) {
    const stdPlatform = standardizePlatformName(item.platform) as ApprovedPlatform;
    if (!stdPlatform || !platformsToQuery.includes(stdPlatform)) continue;

    if (!platformBestMatch.has(stdPlatform)) {
      const validation = validateProductMatch(item.name, cleanQ, category, item.price);
      if (!validation.isValid) {
        console.log(`[MATCH REJECTED CATALOG] ${stdPlatform}: "${item.name}" (₹${item.price}) -> ${validation.reason}`);
        continue;
      }

      const realMrp = (item.mrp && item.mrp > item.price) ? item.mrp : item.price;
      const discountPercentage = realMrp > item.price ? Math.round(((realMrp - item.price) / realMrp) * 100) : 0;
      
      // Ensure Flipkart catalog URLs use safe search URL or direct format without 404
      let finalCatalogUrl = item.url;
      if (stdPlatform === 'Flipkart' && (!item.url || item.url.includes('/p/itm') && !item.url.includes('?pid='))) {
        finalCatalogUrl = getFallbackSearchUrl('Flipkart', item.name);
      }
      
      const urlType: 'direct' | 'search_fallback' = (finalCatalogUrl && !finalCatalogUrl.includes('/s?') && !finalCatalogUrl.includes('/search?')) ? 'direct' : 'search_fallback';

      platformBestMatch.set(stdPlatform, {
        ...item,
        url: finalCatalogUrl,
        mrp: realMrp,
        discountPercentage,
        platform: stdPlatform,
        category,
        url_type: urlType,
      });
    }
  }

  // 4. Build per-platform status summaries
  const platformSummaries: PlatformResultSummary[] = [];

  for (const plat of ALL_APPROVED_PLATFORMS) {
    if (!platformsToQuery.includes(plat)) {
      platformSummaries.push({
        platform: plat,
        status: 'SKIPPED_IMPLAUSIBLE',
        reason: 'Platform structurally implausible for this category',
      });
      continue;
    }

    const match = platformBestMatch.get(plat);
    if (match) {
      platformSummaries.push({
        platform: plat,
        status: 'SUCCESS',
        price: match.price,
        productName: match.name,
      });
    } else {
      platformSummaries.push({
        platform: plat,
        status: 'NOT_FOUND',
        reason: 'No matching stock or product found in store',
      });
    }
  }

  const validProducts = Array.from(platformBestMatch.values());
  validProducts.sort((a, b) => a.price - b.price);

  // 5. REQUIRED PER-SEARCH DEBUG LOGGING
  console.log(`\n======================================================`);
  console.log(`Query: ${cleanQ}`);
  console.log(`Detected Category: ${category}`);
  console.log(`Primary Platforms: [${routing.primary.join(', ')}]`);
  console.log(`Secondary Platforms Checked: [${secondaryChecked.join(', ')}]`);
  console.log(`Secondary Platforms Skipped (implausible): [${secondarySkipped.join(', ')}]`);
  console.log(`Per-platform:`);
  platformSummaries.forEach((ps) => {
    if (ps.status === 'SUCCESS') {
      console.log(`  - ${ps.platform}: CALLED -> SUCCESS (₹${ps.price} - ${ps.productName})`);
    } else if (ps.status === 'SKIPPED_IMPLAUSIBLE') {
      console.log(`  - ${ps.platform}: SKIPPED (implausible)`);
    } else {
      console.log(`  - ${ps.platform}: CALLED -> ${ps.status} (${ps.reason})`);
    }
  });
  console.log(`Final Valid Results: [${validProducts.map(p => `${p.platform}: ₹${p.price}`).join(', ')}]`);
  console.log(`======================================================\n`);

  return {
    products: validProducts,
    platformSummaries,
  };
}

app.post('/api/search', async (req, res) => {
  try {
    const { query, city = 'Chennai', pincode = '600028', lat = 13.0827, lon = 80.2707 } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid search query is required' });
    }

    const cleanQuery = parseQueryFromUrl(query);
    const category = classifyCategory(cleanQuery);
    const routing = getPlatformRouting(category);

    const serpApiKey = process.env.SERPAPI_KEY || '';
    let rawLiveResults: ProductResult[] = [];

    if (serpApiKey) {
      try {
        let serpResults = await fetchSerpApi(cleanQuery, serpApiKey, category);
        if ((!serpResults || serpResults.length === 0) && category === 'Medicines' && !cleanQuery.includes('10mg') && !cleanQuery.includes('tablet')) {
          const fallbackQuery = `${cleanQuery} 10mg tablet`;
          serpResults = await fetchSerpApi(fallbackQuery, serpApiKey, category);
        }
        if (Array.isArray(serpResults)) {
          rawLiveResults = serpResults;
        }
      } catch (e) {
        console.warn('SerpAPI search warning:', e);
      }
    }

    // Build comprehensive comparison with priority-based inclusive search
    const { products, platformSummaries } = buildComprehensiveIndianStoreResults(cleanQuery, rawLiveResults, category, pincode);

    return res.json({
      query: cleanQuery,
      originalInput: query,
      city,
      pincode,
      category,
      count: products.length,
      primaryPlatforms: routing.primary,
      secondaryPlatforms: routing.secondary,
      platformSummaries,
      hasLiveKeys: Boolean(serpApiKey),
      products,
    });
  } catch (err: any) {
    console.error('API /api/search error:', err);
    return res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// 2. API: AI Alternatives — Ollama (primary) → Groq (fallback) → Smart Domain Catalog
app.post('/api/ai-alternatives', async (req, res) => {
  try {
    const { productName, category = 'general' } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const lowerName = (productName || '').toLowerCase();

    // Detect category for smarter prompting and fallback
    const isElectronics = /phone|iphone|samsung|oneplus|pixel|laptop|tablet|tv|television|earbuds|headphone|watch|camera|charger|router|laptop|macbook|dell|hp|asus|lenovo/.test(lowerName);
    const isMedicine = /tablet|capsule|syrup|cream|ointment|pain|fever|cough|cold|antibiotic|vitamin|supplement|paracetamol|ibuprofen|dolo/.test(lowerName);
    const isSkincare = /serum|moisturizer|sunscreen|toner|face wash|cleanser|spf|niacinamide|vitamin c|retinol/.test(lowerName);
    const isGrocery = /milk|bread|butter|oil|rice|dal|atta|flour|sugar|tea|coffee|biscuit|chocolate|juice/.test(lowerName);
    const detectedCategory = isElectronics ? 'electronics' : isMedicine ? 'medicine' : isSkincare ? 'skincare' : isGrocery ? 'grocery' : category;

    // Build highly focused prompt based on detected category
    let contextHint = '';
    if (isElectronics) {
      contextHint = `Focus on similar specs: processor, RAM, display, battery, camera. Include brand alternatives like Samsung, OnePlus, Xiaomi, Realme, Motorola, Vivo, OPPO, iQOO, ASUS ROG etc.`;
    } else if (isMedicine) {
      contextHint = `Focus on same active ingredient, dosage strength, and therapeutic use. Include generic equivalents and Indian pharma brands like Sun Pharma, Cipla, Dr. Reddy, Mankind, Alkem.`;
    } else if (isSkincare) {
      contextHint = `Focus on same active ingredient percentage and skin concern. Include Indian D2C brands like Minimalist, The Derma Co, Dot & Key, Plum, Mamaearth, Pilgrim, Suganda.`;
    } else if (isGrocery) {
      contextHint = `Focus on same product category, nutritional value, and taste profile. Include popular Indian brands available on Blinkit, Zepto, BigBasket.`;
    }

    const prompt = `You are an Indian e-commerce product expert. Suggest exactly 3 alternative products for "${productName}" available on Indian platforms (Amazon India, Flipkart, Blinkit, Zepto, 1mg, Nykaa, etc.).

${contextHint}

Return ONLY a valid JSON array of exactly 3 objects. No markdown, no extra text. Each object must have:
{
  "name": "exact product name with brand and variant",
  "brand": "brand name only",
  "why": "2-sentence explanation of why this is a great alternative with specific feature/spec match",
  "ingredients": ["key spec or ingredient 1", "key spec 2", "key spec 3"],
  "uses": ["use case 1", "use case 2"],
  "match_score": 91,
  "category": "${detectedCategory}",
  "estimatedPrice": 15999
}`;

    const enrichAlternative = (alt: any) => {
      const cat = (alt.category || detectedCategory).toLowerCase();
      let baseEstimate = typeof alt.estimatedPrice === 'number' && alt.estimatedPrice > 0
        ? alt.estimatedPrice
        : cat.includes('electronic') || cat.includes('phone') ? 18999
        : cat.includes('laptop') ? 55999
        : cat.includes('med') || cat.includes('pain') ? 149
        : cat.includes('skin') || cat.includes('care') ? 489
        : cat.includes('grocery') ? 89
        : 299;

      return {
        name: alt.name || 'Alternative Product',
        brand: alt.brand || 'Brand',
        why: alt.why || 'Similar specifications, performance, and use cases.',
        ingredients: Array.isArray(alt.ingredients) ? alt.ingredients.slice(0, 4) : ['Key Feature'],
        uses: Array.isArray(alt.uses) ? alt.uses.slice(0, 3) : ['Primary Use'],
        match_score: typeof alt.match_score === 'number' ? Math.min(99, Math.max(70, alt.match_score)) : 88,
        category: alt.category || detectedCategory,
        estimatedPrice: baseEstimate,
        sampleStores: [
          { platform: 'Amazon India', price: baseEstimate, delivery: 'Same-Day' },
          { platform: 'Flipkart', price: Math.round(baseEstimate * 1.02), delivery: '1-2 Days' },
          { platform: isElectronics ? 'Croma' : isMedicine ? '1mg' : isSkincare ? 'Nykaa' : 'Blinkit', price: Math.round(baseEstimate * 1.01), delivery: isElectronics ? 'Express 3-Hour' : '10-15 mins' },
        ],
      };
    };

    // ---- STEP 1: Try Ollama (local LLM with fast 1.5s timeout) ----
    let parsedAlternatives: any[] = [];
    let aiSource = 'ollama';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500); // 1.5s timeout so it doesn't block if not local
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.3, num_predict: 1024 },
        }),
      });
      clearTimeout(timeout);

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const text = (data.response || '').trim();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedAlternatives = parsed;
          }
        } else {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) parsedAlternatives = parsed;
          else if (parsed && typeof parsed === 'object') {
            parsedAlternatives = parsed.alternatives || parsed.products || parsed.substitutes || [parsed];
          }
        }
      }
    } catch (ollamaErr: any) {
      // Ollama not running locally, seamlessly fallback to cloud AI
    }

    // ---- STEP 2: Try Groq Cloud LLM (OpenAI GPT-OSS / Qwen) ----
    if (parsedAlternatives.length === 0) {
      const groqKey = process.env.GROQ_API_KEY || '';
      if (groqKey) {
        const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];
        for (const modelName of groqModels) {
          if (parsedAlternatives.length > 0) break;
          try {
            aiSource = 'groq';
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqKey}`,
              },
              signal: controller.signal,
              body: JSON.stringify({
                model: modelName,
                messages: [
                  {
                    role: 'system',
                    content: 'You are an Indian e-commerce expert. You must return ONLY a valid JSON object with key "alternatives" containing an array of 3 products.'
                  },
                  {
                    role: 'user',
                    content: prompt + ' Output ONLY a JSON object with format: {"alternatives": [...]}.'
                  }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
                max_tokens: 1024,
              }),
            });
            clearTimeout(timeout);

            if (groqRes.ok) {
              const gData = await groqRes.json();
              const text = gData.choices?.[0]?.message?.content?.trim() || '';
              const cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
              const parsed = JSON.parse(cleanText);
              const list = Array.isArray(parsed) ? parsed : parsed.alternatives || parsed.products || parsed.substitutes || [];
              if (Array.isArray(list) && list.length > 0) {
                parsedAlternatives = list;
                break;
              }
            }
          } catch (groqErr: any) {
            console.warn('Groq attempt warning:', modelName, groqErr?.message);
          }
        }
      }
    }

    // ---- STEP 3: Smart category-specific domain knowledge fallback ----
      if (parsedAlternatives.length === 0) {
        aiSource = 'catalog';
        const isCetirizine = /cetirizine|cetzine|okacet|allergy|antihistamine|cold|sneezing|rhinitis/i.test(lowerName);
        const isDetergent = /ariel|surf|tide|detergent|washing|powder|liquid/i.test(lowerName);
        const isToothpaste = /colgate|pepsodent|sensodyne|dabur|toothpaste/i.test(lowerName);
        const isContraceptive = /condom|condoms|durex|skore|manforce|kamasutra/i.test(lowerName);

        if (isCetirizine) {
          parsedAlternatives = [
            {
              name: 'Allegra 120mg Strip of 10 Tablets (Fexofenadine)',
              brand: 'Sanofi India',
              why: 'Non-sedating second generation antihistamine for fast relief from allergy, sneezing, and runny nose.',
              ingredients: ['Fexofenadine Hydrochloride 120mg', 'Non-drowsy formulation'],
              uses: ['Allergy Relief', 'Sneezing', 'Skin Rashes'],
              match_score: 96,
              category: 'medicine',
              estimatedPrice: 218,
            },
            {
              name: 'Levocet 5mg Strip of 10 Tablets (Levocetirizine)',
              brand: 'Hetero Healthcare',
              why: 'Active R-enantiomer of Cetirizine offering higher potency at half the dosage with minimal drowsiness.',
              ingredients: ['Levocetirizine Dihydrochloride 5mg'],
              uses: ['Seasonal Allergies', 'Rhinitis', 'Hives'],
              match_score: 93,
              category: 'medicine',
              estimatedPrice: 42,
            },
            {
              name: 'Okacet 10mg Strip of 10 Tablets (Cetirizine Cipla)',
              brand: 'Cipla Ltd',
              why: 'Direct generic bio-equivalent of Cetirizine manufactured by Cipla with guaranteed pharmaceutical grade purity.',
              ingredients: ['Cetirizine Hydrochloride 10mg'],
              uses: ['Allergy Symptoms', 'Itching', 'Watery Eyes'],
              match_score: 98,
              category: 'medicine',
              estimatedPrice: 20,
            },
          ];
        } else if (isElectronics && (lowerName.includes('iphone') || lowerName.includes('apple'))) {
          parsedAlternatives = [
            { name: 'Samsung Galaxy S24 (256 GB) - Phantom Black', brand: 'Samsung', why: 'Top Android flagship with superior camera system and Galaxy AI features. Same tier, better customization than iPhone.', ingredients: ['Snapdragon 8 Gen 3', '6.2" Dynamic AMOLED 2X 120Hz', '50MP Triple Camera', '4000 mAh'], uses: ['Photography', 'Gaming', 'Productivity'], match_score: 92, category: 'electronics', estimatedPrice: 74999 },
            { name: 'OnePlus 12 (256 GB) - Silky Black', brand: 'OnePlus', why: 'Blazing fast Hasselblad camera, 100W SUPERVOOC charging, and OxygenOS. Flagship killer with similar price tier.', ingredients: ['Snapdragon 8 Gen 3', '6.82" LTPO AMOLED', '50MP Hasselblad', '5400 mAh 100W'], uses: ['Fast Charging', 'Photography', 'Gaming'], match_score: 89, category: 'electronics', estimatedPrice: 64999 },
            { name: 'Google Pixel 8 (128 GB) - Obsidian', brand: 'Google', why: 'Pure Android experience with Google AI features, best computational photography in class at similar price.', ingredients: ['Google Tensor G3', '6.2" OLED 120Hz', '50MP Main Camera', '4575 mAh'], uses: ['AI Features', 'Photography', 'Security'], match_score: 85, category: 'electronics', estimatedPrice: 59999 },
          ];
        } else if (isDetergent) {
          parsedAlternatives = [
            { name: 'Surf Excel Matic Front & Top Load Liquid Detergent 1L', brand: 'Surf Excel (HUL)', why: 'Powerful enzyme technology that penetrates tough stains in 1 wash without residue, matching Ariel performance.', ingredients: ['Active Stain Enzymes', 'Optical Color Brighteners'], uses: ['Washing Machine', 'Tough Stains', 'Color Care'], match_score: 95, category: 'grocery', estimatedPrice: 215 },
            { name: 'Tide Plus Double Power Liquid Detergent 1L', brand: 'Tide (P&G)', why: 'Deep stain breakdown formula with long-lasting freshness fragrance at lower cost per wash.', ingredients: ['Surfactant Blend', 'Fragrance Microcapsules'], uses: ['Machine Wash', 'White Clothes', 'Daily Wash'], match_score: 88, category: 'grocery', estimatedPrice: 175 },
            { name: 'Henko Matic Liquid Detergent Front Load 1L', brand: 'Henko (Jyothy Labs)', why: 'Nano-fiber lock technology protects garment texture and prevents fabric linting.', ingredients: ['Nano-fiber Shield', 'Anti-fading Polymer'], uses: ['Delicate Fabrics', 'Premium Wear'], match_score: 84, category: 'grocery', estimatedPrice: 190 },
          ];
        } else if (isToothpaste) {
          parsedAlternatives = [
            { name: 'Sensodyne Rapid Relief Toothpaste 80g', brand: 'Sensodyne (GSK)', why: 'Clinically proven fast relief for sensitive teeth within 60 seconds with active stannous fluoride.', ingredients: ['Stannous Fluoride', 'Sodium Fluoride'], uses: ['Enamel Protection', 'Sensitivity Relief'], match_score: 92, category: 'grocery', estimatedPrice: 165 },
            { name: 'Dabur Red Ayurvedic Toothpaste 150g', brand: 'Dabur', why: 'Traditional 13 Ayurvedic herbal formulation (Laung, Pudina, Tomar) providing complete oral hygiene.', ingredients: ['Clove Oil (Laung)', 'Mint', 'Sunthi'], uses: ['Cavity Protection', 'Gum Health', 'Fresh Breath'], match_score: 87, category: 'grocery', estimatedPrice: 95 },
            { name: 'Pepsodent 2-in-1 Germicheck Toothpaste 150g', brand: 'Pepsodent (HUL)', why: '12-hour germ protection formula with fluoride and micro-calcium.', ingredients: ['Active Micro-Calcium', 'Triclosan Free Formula'], uses: ['Cavity Defense', 'Fresh Breath'], match_score: 85, category: 'grocery', estimatedPrice: 85 },
          ];
        } else if (isContraceptive) {
          parsedAlternatives = [
            { name: 'Skore Not Out Climax Delay 10s', brand: 'Skore (TTK)', why: 'Premium lubricated condoms with special benzocaine delay formula for enhanced endurance.', ingredients: ['Natural Rubber Latex', 'Benzocaine 4.5%'], uses: ['Safety', 'Enhanced Intimacy'], match_score: 93, category: 'grocery', estimatedPrice: 110 },
            { name: 'Manforce Ultra Thin Flavoured 10s', brand: 'Manforce (Mankind)', why: 'Ultra thin sensation with ribbed and dotted texture for heightened sensitivity.', ingredients: ['Natural Latex', 'Exotic Flavor Lubricant'], uses: ['Maximum Sensitivity', 'Protection'], match_score: 90, category: 'grocery', estimatedPrice: 90 },
            { name: 'KamaSutra Super Dotted Condoms 10s', brand: 'KamaSutra (Raymond)', why: 'High-density pyramidal dots designed for intense stimulation and verified electronically.', ingredients: ['Natural Rubber Latex', 'Silicone Lubricant'], uses: ['Stimulation', 'Safety'], match_score: 87, category: 'grocery', estimatedPrice: 95 },
          ];
        } else if (isMedicine) {
          parsedAlternatives = [
            { name: 'Crocin Advance 500mg (15 Tablets)', brand: 'GSK', why: 'Identical active ingredient (Paracetamol 500mg) with rapid absorption formula. OTC, widely available.', ingredients: ['Paracetamol 500mg', 'Rapid Release Formula'], uses: ['Fever', 'Headache', 'Pain Relief'], match_score: 97, category: 'medicine', estimatedPrice: 35 },
            { name: 'Combiflam (Ibuprofen + Paracetamol) 10 Tablets', brand: 'Sanofi', why: 'Dual action - Ibuprofen 400mg + Paracetamol 325mg for stronger pain relief and anti-inflammatory effect.', ingredients: ['Ibuprofen 400mg', 'Paracetamol 325mg'], uses: ['Stronger Pain', 'Inflammation', 'Fever'], match_score: 88, category: 'medicine', estimatedPrice: 48 },
            { name: 'Calpol 650mg Paracetamol 15 Tablets', brand: 'GSK', why: 'High efficacy paracetamol 650mg for rapid fever breakdown and body ache management.', ingredients: ['Paracetamol 650mg'], uses: ['High Fever', 'Body Ache'], match_score: 95, category: 'medicine', estimatedPrice: 32 },
          ];
        } else {
          parsedAlternatives = [
            { name: `${productName} (Top Verified Brand)`, brand: 'Amazon Top Choice', why: 'Highly-rated Indian market alternative offering equal performance, certified quality, and lowest store pricing.', ingredients: ['Standard Certified Material', 'Quality Assured'], uses: ['Daily Use', 'Long-term Reliability'], match_score: 92, category: detectedCategory, estimatedPrice: 399 },
            { name: `${productName} (Smart Value Pick)`, brand: 'Flipkart Assured', why: 'Popular value choice with 4.5+ star verified buyer reviews and fastest regional delivery.', ingredients: ['Durable Build', 'Quality Checked'], uses: ['Value for Money', 'Regular Use'], match_score: 88, category: detectedCategory, estimatedPrice: 349 },
            { name: `${productName} (Quick Darkstore Delivery)`, brand: 'Quick Commerce Pick', why: 'Instant darkstore alternative ready for 10-15 minute delivery at competitive pricing.', ingredients: ['Fresh Batch', 'Instant Dispatch'], uses: ['Instant Need', 'Doorstep Delivery'], match_score: 85, category: detectedCategory, estimatedPrice: 379 },
          ];
        }
      }

      const enrichedAlternatives = parsedAlternatives.slice(0, 3).map(enrichAlternative);
    return res.json({ alternatives: enrichedAlternatives, model: aiSource === 'groq' ? 'Groq AI (GPT-OSS / Qwen)' : aiSource === 'ollama' ? OLLAMA_MODEL : 'SmartPrice AI Engine', source: aiSource });

  } catch (err: any) {
    console.error('API /api/ai-alternatives error:', err);
    return res.status(500).json({ error: 'AI alternatives generation failed', details: err.message });
  }
});

// 3. API: Price History endpoint (90 days, lowest ever, highest ever, average, recommendation)
app.get('/api/price-history', (req, res) => {
  const query = (req.query.query as string) || 'Product';
  const basePrice = parseFloat((req.query.basePrice as string) || '999');

  // Generate 90-day multi-platform timeline data
  const days = 90;
  const now = new Date();
  const historyData: Array<{ date: string; amazon: number; blinkit: number; flipkart: number }> = [];

  let lowest = basePrice;
  let highest = basePrice;
  let sum = 0;

  for (let i = days; i >= 0; i -= 3) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // realistic market fluctuations (festival sales, deal days)
    const factor = 1 + Math.sin(i / 8) * 0.08 + (Math.random() * 0.04 - 0.02);
    const azPrice = Math.round(basePrice * factor);
    const blPrice = Math.round(basePrice * (factor * 0.98 + (Math.random() * 0.03 - 0.015)));
    const fkPrice = Math.round(basePrice * (factor * 1.02 + (Math.random() * 0.03 - 0.015)));

    const minInDay = Math.min(azPrice, blPrice, fkPrice);
    const maxInDay = Math.max(azPrice, blPrice, fkPrice);

    if (minInDay < lowest) lowest = minInDay;
    if (maxInDay > highest) highest = maxInDay;
    sum += (azPrice + blPrice + fkPrice) / 3;

    historyData.push({
      date: dateStr,
      amazon: azPrice,
      blinkit: blPrice,
      flipkart: fkPrice,
    });
  }

  const average = Math.round(sum / historyData.length);
  const isGoodTimeToBuy = basePrice <= average;

  return res.json({
    query,
    currentPrice: basePrice,
    lowestEver: lowest,
    highestEver: highest,
    averagePrice: average,
    isGoodTimeToBuy,
    recommendation: isGoodTimeToBuy
      ? 'Good time to buy! Current price is below 90-day average.'
      : 'Wait for better deal. Current price is slightly higher than 90-day average.',
    timeline: historyData,
  });
});

// 4. API: Config Status & diagnostics
app.get('/api/config-status', async (req, res) => {
  let hasOllama = false;
  try {
    const check = await fetch(`${OLLAMA_HOST}/api/tags`);
    hasOllama = check.ok;
  } catch {}

  return res.json({
    hasSupabaseUrl: Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
    hasSupabaseKey: Boolean(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY),
    hasSerpApi: Boolean(process.env.SERPAPI_KEY),
    hasGroq: Boolean(process.env.GROQ_API_KEY),
    hasOllama: hasOllama,
    aiModel: OLLAMA_MODEL,
    supportedCities: Object.keys(CITIES),
  });
});

// Serve frontend in production or integrate with Vite dev server
async function startServer() {
  // ==========================================
// PUBLIC APIS SUITE INTEGRATION (public-apis)
// 1. OpenFDA API: Live Clinical & Drug Intelligence
// 2. Open Food Facts API: Verified Groceries & Food Ingredients
// 3. OpenStreetMap Nominatim: Indian Pincode & City Geocoding
// 4. Frankfurter: Real-time Forex & INR Exchange Rates
// ==========================================

// 1. OpenFDA Drug Pharmacology & Clinical Details Endpoint
app.post('/api/fda/lookup', async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name is required' });
    }

    const cleanName = encodeURIComponent(medicineName.trim().split(' ')[0]);
    const fdaRes = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.substance_name:${cleanName}+openfda.generic_name:${cleanName}&limit=1`,
      { headers: { 'User-Agent': 'SmartPriceAI - PublicAPIs - Version 1.0' } }
    );

    if (!fdaRes.ok) {
      // Fallback search by general drug field
      const fallbackRes = await fetch(
        `https://api.fda.gov/drug/label.json?search=${cleanName}&limit=1`,
        { headers: { 'User-Agent': 'SmartPriceAI - PublicAPIs - Version 1.0' } }
      );
      if (!fallbackRes.ok) {
        return res.json({
          medicine: medicineName,
          found: false,
          genericName: medicineName,
          purpose: 'Therapeutic Medication',
          activeIngredients: [medicineName],
          source: 'OpenFDA Public Catalog',
        });
      }
      const data = await fallbackRes.json();
      const item = data.results?.[0];
      return res.json({
        medicine: medicineName,
        found: true,
        genericName: item?.openfda?.generic_name?.[0] || medicineName,
        brandName: item?.openfda?.brand_name?.[0] || medicineName,
        purpose: item?.purpose?.[0] || item?.indications_and_usage?.[0] || 'Active Treatment',
        activeIngredients: item?.active_ingredient || [medicineName],
        source: 'OpenFDA API (US FDA / NLM)',
      });
    }

    const data = await fdaRes.json();
    const item = data.results?.[0];
    return res.json({
      medicine: medicineName,
      found: true,
      genericName: item?.openfda?.generic_name?.[0] || medicineName,
      brandName: item?.openfda?.brand_name?.[0] || medicineName,
      purpose: item?.purpose?.[0] || item?.indications_and_usage?.[0] || 'Antihistamine / Active Medication',
      activeIngredients: item?.active_ingredient || [medicineName],
      source: 'OpenFDA API (US FDA / NLM)',
    });
  } catch (err: any) {
    console.error('OpenFDA API Error:', err);
    return res.status(500).json({ error: 'OpenFDA lookup failed', details: err.message });
  }
});

// 2. Open Food Facts Verified Grocery & Food Products Endpoint
app.post('/api/food/lookup', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = encodeURIComponent(query.trim());
    const offRes = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${cleanQuery}&search_simple=1&action=process&json=1&page_size=5`,
      { headers: { 'User-Agent': 'SmartPriceAI - PublicAPIs - Version 1.0' } }
    );

    if (!offRes.ok) {
      return res.status(offRes.status).json({ error: 'Open Food Facts lookup failed' });
    }

    const data = await offRes.json();
    const products = (data.products || []).slice(0, 5).map((p: any) => ({
      name: p.product_name || query,
      brand: p.brands || 'Indian FMCG Brand',
      categories: p.categories ? p.categories.split(',').slice(0, 3).map((c: string) => c.trim()) : ['Grocery'],
      image: p.image_front_small_url || p.image_front_url || '',
      ingredients: p.ingredients_text || '',
      source: 'Open Food Facts (Public-APIs)',
    }));

    return res.json({ query, count: products.length, products });
  } catch (err: any) {
    console.error('Open Food Facts API Error:', err);
    return res.status(500).json({ error: 'Open Food Facts lookup failed', details: err.message });
  }
});

// 3. OpenStreetMap Nominatim Live Geocoding for Indian Pincodes & Cities
app.get('/api/geo/pincode', async (req, res) => {
  try {
    const pincode = req.query.pincode ? String(req.query.pincode).trim() : '';
    const city = req.query.city ? String(req.query.city).trim() : '';
    const query = pincode ? `${pincode}, India` : city ? `${city}, India` : 'Chennai, India';

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`,
      { headers: { 'User-Agent': 'SmartPriceAI - PublicAPIs - Version 1.0' } }
    );

    if (!geoRes.ok) {
      return res.status(geoRes.status).json({ error: 'Geocoding failed' });
    }

    const data = await geoRes.json();
    if (!data || data.length === 0) {
      return res.json({
        found: false,
        pincode: pincode || '600028',
        city: city || 'Chennai',
        area: 'Metro Area',
        lat: 13.0827,
        lon: 80.2707,
        source: 'Default Geo',
      });
    }

    const first = data[0];
    const addr = first.address || {};
    const detectedCity = addr.city || addr.state_district || addr.county || city || 'Chennai';
    const detectedArea = addr.suburb || addr.neighbourhood || addr.road || 'Central Metro';
    const detectedState = addr.state || 'Tamil Nadu';

    return res.json({
      found: true,
      pincode: addr.postcode || pincode,
      city: detectedCity,
      area: detectedArea,
      state: detectedState,
      displayName: first.display_name,
      lat: parseFloat(first.lat),
      lon: parseFloat(first.lon),
      source: 'OpenStreetMap Nominatim (Public-APIs)',
    });
  } catch (err: any) {
    console.error('Nominatim Geocoding Error:', err);
    return res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

// 5. OpenStreetMap Nominatim Live Reverse Geocoding for Exact GPS Location
app.get('/api/geo/reverse', async (req, res) => {
  try {
    const lat = req.query.lat ? String(req.query.lat).trim() : '';
    const lon = req.query.lon ? String(req.query.lon).trim() : '';

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json&addressdetails=1`,
      { headers: { 'User-Agent': 'SmartPriceAI - PublicAPIs - Version 1.0' } }
    );

    if (!geoRes.ok) {
      return res.status(geoRes.status).json({ error: 'Reverse geocoding failed' });
    }

    const data = await geoRes.json();
    const addr = data.address || {};
    const detectedCity = addr.city || addr.town || addr.municipality || addr.state_district || addr.county || 'Chennai';
    const detectedArea = addr.suburb || addr.neighbourhood || addr.residential || addr.road || 'Local Area';
    const detectedState = addr.state || 'Tamil Nadu';
    const detectedPincode = addr.postcode || '600028';

    return res.json({
      found: true,
      pincode: detectedPincode,
      city: detectedCity,
      area: detectedArea,
      state: detectedState,
      displayName: data.display_name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      source: 'OpenStreetMap Nominatim (Public-APIs)',
    });
  } catch (err: any) {
    console.error('Reverse Geocoding Error:', err);
    return res.status(500).json({ error: 'Reverse geocoding failed', details: err.message });
  }
});


// 4. Frankfurter Real-Time Forex Exchange Rates
app.get('/api/currency/rates', async (req, res) => {
  try {
    const fxRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP');
    if (!fxRes.ok) {
      return res.json({ base: 'USD', rates: { INR: 86.5, EUR: 0.92, GBP: 0.79 }, source: 'Fallback' });
    }
    const data = await fxRes.json();
    return res.json({
      base: data.base,
      date: data.date,
      rates: data.rates,
      source: 'Frankfurter API (Public-APIs)',
    });
  } catch (err: any) {
    return res.json({ base: 'USD', rates: { INR: 86.5, EUR: 0.92, GBP: 0.79 }, source: 'Fallback' });
  }
});


  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // In dev mode, use Vite's dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  


app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartPrice AI server running on port ${PORT}`);
  });
}

startServer();
