import 'dotenv/config';
import { connectToDatabase } from '@/lib/mongodb';
import { Item } from '@/models/Item';
// script run npx tsx src/data/seed.ts
const inventory = [
    {
        code: 'FISH001',
        name: 'Sea Bass Fillet',
        category: 'food',
        subcategory: 'fish',
        tags: ['sea bass', 'fish', 'whitefish'],
        description: 'Fresh Mediterranean sea bass fillet.',
        weight: '180g'
    },
    {
        code: 'FISH002',
        name: 'Atlantic Salmon Fillet',
        category: 'food',
        subcategory: 'fish',
        tags: ['salmon', 'fish', 'seafood'],
        description: 'Premium farm-raised Atlantic salmon.',
        weight: '200g'
    },
    {
        code: 'FISH003',
        name: 'Trout Fillet',
        category: 'food',
        subcategory: 'fish',
        tags: ['trout', 'fish'],
        description: 'Delicate freshwater trout fillet.',
        weight: '190g'
    },
    {
        code: 'MEAT001',
        name: 'Chicken Breast',
        category: 'food',
        subcategory: 'meat',
        tags: ['chicken', 'meat', 'poultry'],
        description: 'Boneless skinless chicken breast.',
        weight: '200g'
    },
    {
        code: 'VEG001',
        name: 'Zucchini',
        category: 'food',
        subcategory: 'vegetables',
        tags: ['zucchini', 'vegetable'],
        description: 'Fresh organic zucchini.',
        weight: '150g'
    },
    {
        code: 'JUICE001',
        name: 'Orange Juice',
        category: 'beverage',
        subcategory: 'juice',
        tags: ['orange', 'juice'],
        description: 'Fresh-squeezed orange juice.',
        weight: '250ml'
    }
];

function random<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData() {
    await connectToDatabase();
    await Item.deleteMany({});

    const enriched = inventory.map((item) => ({
        ...item,
        alternatives: inventory
            .filter(i => i.subcategory === item.subcategory && i.code !== item.code)
            .slice(0, 2)
            .map(i => i.code),
        specifications: {
            weight: item.weight,
            origin: random(['Turkey', 'Spain', 'Italy']),
            storage: random(['refrigerated', 'frozen', 'dry']),
        },
        current_stock: Math.floor(Math.random() * 50) + 10,
        vector_embedding: [Math.random(), Math.random(), Math.random()],
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-15')
    }));

    await Item.insertMany(enriched);
    console.log('✅ New inventory seeded');
    process.exit(0);
}

seedData().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
