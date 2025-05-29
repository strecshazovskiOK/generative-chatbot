'use client';

import { useState } from 'react';

const suggestions = [
    'Do we have any sea bass today?',
    'Show me alternative types of fish and their stock codes',
    'What’s the code for grilled chicken?',
    'List all vegetarian dishes with their codes'
];

export default function Home() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { sender: 'bot', text: data.response || 'No response' }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Error contacting Gemini' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">Hello there!</h1>
                <p className="text-lg text-gray-400 mt-2">How can I help you today?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full mb-10">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        className="p-4 bg-zinc-900 rounded-xl border border-zinc-700 text-left hover:bg-zinc-800 transition"
                        onClick={() => setInput(s)}
                    >
            <span className="font-medium text-white">
              {s.split(' ').slice(0, 4).join(' ')}
            </span>
                        <br />
                        <span className="text-sm text-gray-400">
              {s.split(' ').slice(4).join(' ')}
            </span>
                    </button>
                ))}
            </div>

            {/* Chat window */}
            <div className="w-full max-w-2xl flex flex-col gap-2 mb-6">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-xl max-w-[80%] ${
                            msg.sender === 'user' ? 'bg-blue-600 self-end' : 'bg-zinc-800 self-start'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="p-3 bg-zinc-700 rounded-xl max-w-[80%] self-start animate-pulse text-gray-400">
                        Gemini is typing...
                    </div>
                )}
            </div>

            {/* Input box */}
            <div className="w-full max-w-2xl relative">
                <input
                    type="text"
                    placeholder="Send a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-4 pl-5 pr-12 rounded-xl border border-zinc-700 bg-zinc-900 text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                    onClick={handleSend}
                    className="absolute right-2 top-2.5 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
                >
                    <span>↑</span>
                </button>
            </div>
        </main>
    );
}
