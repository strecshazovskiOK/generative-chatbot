// src/app/api/chat/route.ts
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    const { userMessage } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userMessage }]
                    }
                ]
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

    return new Response(JSON.stringify({ response: result.choices?.[0]?.message?.content || result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
