import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    category: String,
    subcategory: String,
    description: String,
    alternatives: [String],
    specifications: {
        weight: String,
        origin: String,
        storage: String,
    },
    current_stock: Number,
    vector_embedding: [Number],
    tags: [String],
    created_at: Date,
    updated_at: Date
});

export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
