import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";

export async function POST(req: Request) {
    const { userMessage } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    await connectToDatabase();

    // ✅ 1. Ana ürünleri bul
    const mainItems = await Item.find({
        $or: [
            { name: { $regex: userMessage, $options: "i" } },
            { tags: { $in: userMessage.toLowerCase().split(/\s+/) } }
        ]
    }).lean();

    // ✅ 2. Alternatifleri bul
    let allItems = [...mainItems];

    for (const item of mainItems) {
        const altItems = await Item.find({
            code: { $in: item.alternatives || [] }
        }).lean();

        allItems.push(...altItems);
    }

    // ✅ 3. Aynı ürünler tekrar gelmesin
    const uniqueMap = new Map();
    allItems.forEach(i => uniqueMap.set(i.code, i));
    const uniqueItems = Array.from(uniqueMap.values());

    // ✅ 4. Gemini için veri oluştur
    const itemDetails = uniqueItems.length
        ? uniqueItems.map(i => `- ${i.name} (Code: ${i.code})`).join("\n")
        : "No relevant items were found in the stock database.";

    const finalPrompt = `
You are a helpful AI assistant for hotel inventory management.

A staff member asked: "${userMessage}"

Here are the matching items from the stock database:
${itemDetails}

Answer based ONLY on the inventory list provided. If the item is not found, explain that. Suggest close alternatives if available.
`;

    // ✅ 5. Gemini API çağrısı
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: finalPrompt }] }],
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        console.error("Gemini error:", result);
        return new Response(JSON.stringify({ error: "Gemini API error", details: result }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const geminiText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini";

    return new Response(JSON.stringify({ response: geminiText }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
