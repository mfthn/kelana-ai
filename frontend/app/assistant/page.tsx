"use client";

import { useState } from "react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  sources?: string[];
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Halo! Saya Asisten AI Kelana. Tanyakan tentang aturan bea cukai, pembayaran QRIS antarnegara, atau panduan kuliner halal di Jepang.",
    },
  ]);

  const quickPrompts = [
    "Berapa batas pembebasan bea cukai & registrasi IMEI?",
    "Bagaimana cara pakai QRIS Antarnegara di Thailand & Malaysia?",
    "Istilah kanji apa saja yang harus dihindari di Jepang bagi Muslim?",
  ];

  const handleSend = async (queryText?: string) => {
    const question = queryText || input;
    if (!question.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal mendapatkan respon.");

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: `Error: ${err.message || "Gagal terhubung ke server."}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 flex flex-col items-center p-4 md:p-8">
      {/* Header Halaman */}
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Asisten Perjalanan KelanaAI</h1>
        <p className="text-xs text-slate-500 mt-1">
          Jawaban berbasis Knowledge Base terverifikasi (RAG)
        </p>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-4xl flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-br-none shadow-sm"
                    : "bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Badges Sitasi Sumber Dokumen */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-medium text-slate-400">Sumber Referensi:</span>
                  {msg.sources.map((src, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
              <span>Mencari jawaban dalam basis pengetahuan...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition shrink-0 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanyakan aturan perjalanan, bea cukai, atau mata uang..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm transition shadow-sm"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}