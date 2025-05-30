# 🛎️ AI-Powered Hotel Inventory Chatbot

This project is a dynamic AI-supported chatbot built with [Next.js](https://nextjs.org), MongoDB, and Gemini 2.0 Flash. It allows hotel staff to query stock items using natural language — such as types of fish, vegetarian dishes, or item codes — and get smart responses based on current inventory data.
---
<img width="865" alt="Screenshot 2025-05-30 at 02 14 12" src="https://github.com/user-attachments/assets/9019c846-e224-4979-864f-87030f250aed" />

---

## ⚙️ Features

- ✨ Natural language stock queries
- 🧠 Gemini 2.0 Flash for AI responses
- 📦 MongoDB for inventory storage
- 🔍 Intelligent search + relevant alternatives (RAG-like logic)
- 🎨 Styled with Tailwind CSS
- 🚀 Deployed on [Vercel](https://generative-chatbot-delta.vercel.app)

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Seed the database

Run this once to populate sample hotel inventory:

```bash
npx tsx src/data/seed.ts
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chatbot.

---

## 🧠 AI + RAG Behavior

Instead of loading all stock items into the LLM context, I implemented a **RAG (Retrieval-Augmented Generation)** system. Here's why:

### ✅ Why RAG?

**1. Token Limit of Gemini:** 
-Gemini has a token limit (~32K tokens), so loading all stock data into the prompt is not sustainable as the database grows.

**2. Dynamic Data Handling:**
- The hotel stock system changes frequently.
- LLM alone cannot reflect real-time inventory.
- With RAG, I fetch the most recent item info directly from MongoDB.

**3. Scalability:**
- Inventory may grow beyond LLM context window limits.
- RAG allows fetching only relevant items based on query.
- This is cost-efficient and reliable.

**4. Technical Design:**
- Items are stored in MongoDB.
- When a user asks something, the backend queries relevant items.
- These are injected into the AI prompt context for Gemini to reason accurately.
```ts
// Query MongoDB
const items = await getRelevantItems(userMessage);

// Format for LLM
const context = items.map(item => `- ${item.code}: ${item.name}`).join('\n');

// Inject into LLM prompt
const finalPrompt = \`
User asked: "${userMessage}"
Stock items:
${context}
Answer based ONLY on the above items.
\`;
```

---

## 🧩 Technologies Used

### ⚒️ Core Stack
- **Next.js 15 App Router** – frontend and API routing
- **React 19** – user interface
- **TypeScript** – static type checking
- **MongoDB (with Mongoose)** – inventory data storage
- **Gemini 2.0 Flash API** – LLM responses
- **Tailwind CSS & shadcn/ui** – clean, modern styling

### 🧠 AI & Dev Tools
- **OpenAI GPT-4** – prompt engineering and prototype logic
- **Claude AI** – architecture suggestions and early reasoning
- **Cursor IDE Agent** – code structuring and optimization
- **V0.dev** - Used for generating initial UI layouts and components. It accelerated the prototyping process and helped establish a consistent visual structure in the early development phase.



---

## 📄 License

MIT — feel free to use and modify.
