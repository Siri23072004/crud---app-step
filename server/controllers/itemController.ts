import { Request, Response } from 'express';
import { Item } from '../models/Item';

// GET all items
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET single item
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// POST create item
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    
    const newItem = new Item({
      name,
      description,
      price,
      category
    });
    
    const savedItem = await newItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// PUT update item
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// DELETE item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deletedItem = await Item.findByIdAndDelete(id);
    
    if (!deletedItem) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};