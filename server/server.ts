import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import itemRoutes from './routes/itemRoutes';

dotenv.config();

// MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('CRUD API welcomes you');
});

export default app;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});