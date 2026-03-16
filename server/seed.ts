import mongoose from 'mongoose';
import { Item } from './models/Item';
import dotenv from 'dotenv';

dotenv.config();

const sampleItems = [
  {
    name: 'Laptop',
    description: '16GB RAM, 512GB SSD, Core i7',
    price: 65000,
    category: 'electronics'
  },
  {
    name: 'Smartphone',
    description: '6.5 inch display, 128GB storage',
    price: 25000,
    category: 'electronics'
  },
  {
    name: 'Novel',
    description: 'Bestseller fiction book',
    price: 350,
    category: 'books'
  },
  {
    name: 'T-Shirt',
    description: 'Cotton, round neck, black',
    price: 899,
    category: 'clothing'
  },
  {
    name: 'Jeans',
    description: 'Slim fit, blue',
    price: 1999,
    category: 'clothing'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/crud-app');
    console.log('MongoDB connected');

    await Item.deleteMany({});
    console.log('Old items deleted');

    await Item.insertMany(sampleItems);
    console.log('5 new items added!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

seedDB();