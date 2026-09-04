"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Selain nilai, berat juga merupakan faktor yang perlu dipertimbangkan saat membawa barang dari Indonesia ke Jepang. Meskipun ada aturan mengenai nilai barang yang diizinkan tanpa dikenakan bea cukai, tidak ada batasan berat yang resmi diberlakukan untuk barang pribadi yang dibawa selama berada dalam batas nilai yang diizinkan (100.000 Yen).

Namun, ada beberapa hal penting yang perlu Anda ketahui:

1. **Pengecekan Berat**: Meskipun tidak ada batasan resmi, beberapa maskapai penerbangan mungkin memiliki batasan berat bagasi yang berbeda. Pastikan untuk memeriksa dengan maskapai penerbangan Anda tentang batasan berat bagasi untuk menghindari biaya tambahan atau penolakan saat check-in.

2. **Berat Maksimal Bagasi**: Kebanyakan maskapai penerbangan internasional mengizinkan berat bagasi tertentu untuk tiap kelas penumpang:
   - **Kelas Ekonomi**: Biasanya sekitar 20-23 kg.
   - **Kelas Bisnis**: Biasanya sekitar 30-32 kg.
   - **Kelas Executive/First**: Biasanya sekitar 32-40 kg.

3. **Bagasi Terlalu Berat**: Jika barang Anda melebihi batasan berat yang ditetapkan maskapai penerbangan, Anda mungkin dikenakan biaya tambahan untuk bagasi berlebih. Biaya ini bisa sangat mahal dan bervariasi tergantung maskapai dan rute penerbangan.

### Tips untuk Mengelola Berat Bagasi:
- **Perencanaan**: Perencanaan bagasi Anda dengan cermat. Pertimbangkan untuk membawa hanya yang diperlukan.
- **Pengemasan**: Gunakan kotak dan kemasan yang ringan dan kokoh untuk meminimalkan berat.
- **Bagasi Tambahan**: Jika Anda merasa perlu membawa banyak barang, pertimbangkan untuk mengirim paket sebelumnya melalui layanan pengiriman.`,
      timestamp: "04:29 PM",
    },
    {
      id: "2",
      role: "user",
      content: "Kalau beratnya berapa?",
      timestamp: "05:24 PM",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [historyList] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Istilah kanji apa saja yang ha...",
      timestamp: "04:29 PM",
    },
    {
      id: "2",
      title: "Aturan Bagasi & Cukai Jepang",
      timestamp: "Kemarin",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Simulasi Response AI
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `### Informasi Tambahan\n\nCatatan Anda mengenai **"${query}"** telah dicatat oleh sistem RAG. \n\n* **Status**: Terverifikasi via Knowledge Base\n* **Rekomendasi**: Periksa kembali dokumen resmi bea cukai sebelum keberangkatan.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div className="p-4 space-y-4">
          
          {/* Header Sidebar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-emerald-400 text-base">
                KelanaAI
              </span>
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Memory
              </span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Baru
            </button>
          </div>

          {/* List Sesi Chat */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Riwayat Obrolan
            </p>
            {historyList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition flex flex-col gap-1 border ${
                  activeChatId === chat.id
                    ? "bg-slate-800/90 border-slate-700 text-emerald-300 font-medium shadow-sm"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate pr-2">{chat.title}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">{chat.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Sidebar Info */}
        <div className="p-4 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            RAG System Ready
          </span>
          <span>v1.0</span>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col bg-slate-900 relative">
        
        {/* Top Header Panel */}
        <header className="h-14 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Istilah kanji apa saja yang ha...
              <button className="text-slate-500 hover:text-slate-300 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </h1>
          </div>
          <span className="text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Knowledge Base RAG
          </span>
        </header>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-inner ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-emerald-400 border border-slate-700"
                }`}
              >
                {msg.role === "user" ? "U" : "🤖"}
              </div>

              {/* Message Bubble Container */}
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    /* MARKDOWN RENDERER UTAMA */
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-extrabold text-slate-900 mt-4 mb-2 border-b pb-1">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-bold text-emerald-800 mt-4 mb-2 border-b border-emerald-100 pb-1 flex items-center gap-1">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0 leading-relaxed text-slate-700">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900 bg-emerald-50 px-1 py-0.5 rounded text-emerald-950">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-outside ml-5 space-y-1 my-2 text-slate-700">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-outside ml-5 space-y-1 my-2 text-slate-700">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="pl-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-slate-100 text-emerald-700 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {/* Timestamp */}
                <span
                  className={`text-[10px] text-slate-500 px-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Animation Indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center text-xs font-bold">
                🤖
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area & Quick Suggestions */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
          
          {/* Quick Suggestion Chips */}
          <div className="flex gap-2 overflow-x-auto text-[11px] pb-1 scrollbar-none">
            {[
              "Berapa batas pembebasan bea cukai & registrasi IMEI?",
              "Bagaimana cara pakai QRIS Ant negara di Thailand & Malaysia?",
              "Istilah kanji apa saja yang harus dihindari di Jepang bagi Muslim?",
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 hover:border-emerald-500/50 text-slate-300 whitespace-nowrap transition border border-slate-700/60 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-2xl p-2 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan aturan perjalanan, bea cukai, atau mata uang..."
              className="flex-1 bg-transparent px-3 py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <span>Kirim</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}