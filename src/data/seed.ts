import 'dotenv/config';
import { connectToDatabase } from '@/lib/mongodb';
import { Item } from '@/models/Item';

type CategoryItem = {
    name: string;
    weight: string;
    tags: string[];
};

type CategoryGroup = {
    category: string;
    subcategory: string;
    baseCode: string;
    items: CategoryItem[];
};

const categories: CategoryGroup[] = [
    {
        category: 'food',
        subcategory: 'fish',
        baseCode: 'FISH',
        items: [
            { name: 'Atlantic Salmon Fillet', weight: '200g', tags: ['salmon', 'fish', 'seafood'] },
            { name: 'Sea Bass Fillet', weight: '180g', tags: ['seabass', 'fish', 'whitefish'] },
            { name: 'Trout Fillet', weight: '190g', tags: ['trout', 'fish'] }
        ]
    },
    {
        category: 'food',
        subcategory: 'meat',
        baseCode: 'MEAT',
        items: [
            { name: 'Beef Tenderloin', weight: '250g', tags: ['beef', 'steak', 'meat'] },
            { name: 'Lamb Chop', weight: '220g', tags: ['lamb', 'meat'] },
            { name: 'Chicken Breast', weight: '200g', tags: ['chicken', 'poultry'] }
        ]
    },
    {
        category: 'food',
        subcategory: 'vegetables',
        baseCode: 'VEG',
        items: [
            { name: 'Zucchini', weight: '150g', tags: ['zucchini', 'vegetable'] },
            { name: 'Eggplant', weight: '200g', tags: ['eggplant', 'vegetable'] },
            { name: 'Green Pepper', weight: '100g', tags: ['pepper', 'vegetable'] }
        ]
    },
    {
        category: 'beverage',
        subcategory: 'juice',
        baseCode: 'JUICE',
        items: [
            { name: 'Orange Juice', weight: '250ml', tags: ['orange', 'juice', 'beverage'] },
            { name: 'Apple Juice', weight: '250ml', tags: ['apple', 'juice', 'beverage'] },
            { name: 'Pineapple Juice', weight: '250ml', tags: ['pineapple', 'juice', 'beverage'] }
        ]
    },
    {
        category: 'cleaning',
        subcategory: 'surface-cleaner',
        baseCode: 'CLN',
        items: [
            { name: 'Glass Cleaner', weight: '500ml', tags: ['cleaner', 'glass', 'cleaning'] },
            { name: 'Multi-Surface Cleaner', weight: '750ml', tags: ['cleaner', 'surface'] },
            { name: 'Bathroom Disinfectant', weight: '1L', tags: ['disinfectant', 'bathroom', 'cleaning'] }
        ]
    }
];

const origins = ['Turkey', 'Germany', 'Spain', 'Italy', 'France', 'USA'];
const storages = ['refrigerated', 'frozen', 'dry', 'room temperature'];

function generateItem(base: CategoryGroup, index: number) {
    const id = index.toString().padStart(3, '0');
    const code = `${base.baseCode}${id}`;
    const itemData = base.items[index % base.items.length];

    return {
        code,
        name: itemData.name,
        category: base.category,
        subcategory: base.subcategory,
        description: `Hotel stock item: ${itemData.name}, weight: ${itemData.weight}`,
        alternatives: [],
        specifications: {
            weight: itemData.weight,
            origin: origins[Math.floor(Math.random() * origins.length)],
            storage: storages[Math.floor(Math.random() * storages.length)],
        },
        current_stock: Math.floor(Math.random() * 60) + 10,
        vector_embedding: [Math.random(), Math.random(), Math.random()],
        tags: itemData.tags,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-15')
    };
}

async function seedData() {
    await connectToDatabase();
    await Item.deleteMany({});

    const allItems: any[] = [];

    categories.forEach(category => {
        category.items.forEach((_, i) => {
            allItems.push(generateItem(category, i));
        });
    });

    // Assign alternatives
    allItems.forEach((item, i, arr) => {
        const related = arr.filter(
            x => x.subcategory === item.subcategory && x.code !== item.code
        );
        item.alternatives = related.slice(0, 2).map(x => x.code);
    });

    await Item.insertMany(allItems);
    console.log('✅ Hotel inventory sample data inserted.');
    process.exit(0);
}

seedData().catch(err => {
    console.error('❌ Error inserting data:', err);
    process.exit(1);
});
