import { useState, useRef, useEffect } from "react";
import kbData from "../utils/index.json";

// ── PASTE YOUR GEMINI API KEY HERE ──────────────────────────────
const API_KEY = "AIzaSyDzH-S5GJZXmJte-HuJwzJbCuABy0Ho5hk";
// ────────────────────────────────────────────────────────────────

// Serialize the imported JSON once at module level
const KB = JSON.stringify(kbData);

const SYSTEM_PROMPT = `
You are a Healthcare Supportive System chatbot.

Your role is to assist users (patients, providers, or emergency users) by providing accurate, helpful, and polite responses based ONLY on the given knowledge base.

Instructions:
- Answer the user's questions in a clear, friendly, and professional manner.
- Only use the information available in the knowledge base.
- Do NOT generate or assume information outside the knowledge base.
- If the question is not related to healthcare support or not available in the knowledge base, respond with:
  "Sorry, I don't have information about that. Please contact support or ask a healthcare-related question."

Capabilities:
- Help users with appointment booking, viewing, canceling, and rescheduling
- Provide emergency support guidance
- Share health tips and general health information
- Assist with login, registration, and profile management
- Guide users to find nearby hospitals (based on system data)

Behavior:
- Be polite and supportive
- Keep answers short and clear
- Prioritize user safety in emergency-related queries

Knowledge Base:
${KB}
`;

const suggestions = [
  "How to avoid diseases?",
  "Book an appointment",
  "Emergency support",
  "Find nearby hospitals",
  "Health tips for today",
];

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
    <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M12 2v4M9 11V8a3 3 0 016 0v3" strokeLinecap="round" />
    <circle cx="9" cy="16" r="1" fill="currentColor" />
    <circle cx="15" cy="16" r="1" fill="currentColor" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

const HeartPulse = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HealthcareChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! 👋 I'm your Healthcare Support Assistant. How can I help you today?",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", text: userText, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const newHistory = [...history, { role: "user", parts: [{ text: userText }] }];

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: newHistory,
          }),
        }
      );
      const response = await res.json(); // renamed from 'data' to avoid conflict with import
      if (response.error) throw new Error(response.error.message);
      const botText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", text: botText, ts: new Date() }]);
      setHistory([...newHistory, { role: "model", parts: [{ text: botText }] }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ " + err.message, ts: new Date(), isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmtTime = (d) =>
    d?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 70% 10%, #071828 0%, #050c14 55%, #000 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050c14; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        .msg-enter { animation: fadeUp .25s ease; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .send-btn:hover:not(:disabled) { background: linear-gradient(135deg,#00c8c8,#0090c0) !important; box-shadow: 0 0 20px rgba(0,200,200,0.35); transform: scale(1.05); }
        .send-btn { transition: all .18s; }
        .chip:hover { background: rgba(0,210,210,0.15) !important; border-color: rgba(0,210,210,0.45) !important; color: #00d2d2 !important; transform: translateY(-1px); }
        .chip { transition: all .15s; }
        .input-wrap:focus-within { border-color: rgba(0,210,210,0.4) !important; box-shadow: 0 0 0 2px rgba(0,210,210,0.08); }
        .dot-pulse { display:flex; gap:4px; align-items:center; }
        .dot-pulse span { width:6px; height:6px; border-radius:50%; background:#00d2d2; animation:blink 1.2s infinite; }
        .dot-pulse span:nth-child(2){ animation-delay:.2s; }
        .dot-pulse span:nth-child(3){ animation-delay:.4s; }
        @keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        textarea { resize: none; }
        textarea:focus { outline: none; }
      `}</style>

      {/* Header */}
      <header
        className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(0,210,210,0.1)",
          background: "rgba(5,12,20,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "rgba(0,210,210,0.12)", color: "#00d2d2" }}
        >
          <HeartPulse />
        </div>
        <div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#f0f6fc",
              letterSpacing: "-0.02em",
            }}
          >
            MediAssist AI
          </h1>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                boxShadow: "0 0 6px #22c55e",
              }}
            />
            <span style={{ fontSize: "0.7rem", color: "#4a7c9e" }}>
              Online · Healthcare Support
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{
          maxWidth: 780,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 msg-enter ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl"
              style={{
                background: m.role === "bot" ? "rgba(0,210,210,0.12)" : "rgba(99,102,241,0.15)",
                color: m.role === "bot" ? "#00d2d2" : "#818cf8",
              }}
            >
              {m.role === "bot" ? <BotIcon /> : <UserIcon />}
            </div>
            <div style={{ maxWidth: "75%" }}>
              <div
                style={{
                  padding: "10px 14px",
                  background: m.role === "bot" ? "rgba(13,24,38,0.9)" : "rgba(30,58,95,0.6)",
                  border:
                    m.role === "bot"
                      ? "1px solid rgba(0,210,210,0.12)"
                      : "1px solid rgba(99,102,241,0.2)",
                  color: m.isError ? "#f87171" : "#c9d1d9",
                  fontSize: "0.9rem",
                  lineHeight: "1.65",
                  borderRadius:
                    m.role === "bot" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "#2d4a6b",
                  marginTop: 4,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                {fmtTime(m.ts)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 msg-enter">
            <div
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl"
              style={{ background: "rgba(0,210,210,0.12)", color: "#00d2d2" }}
            >
              <BotIcon />
            </div>
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(13,24,38,0.9)",
                border: "1px solid rgba(0,210,210,0.12)",
                borderRadius: "4px 18px 18px 18px",
              }}
            >
              <div className="dot-pulse">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {/* Suggestion chips */}
        {messages.length === 1 && !loading && (
          <div style={{ paddingTop: 4 }}>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#2d4a6b",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Suggested
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="chip"
                  style={{
                    background: "rgba(0,210,210,0.06)",
                    border: "1px solid rgba(0,210,210,0.2)",
                    color: "#7aaccf",
                    fontSize: "0.78rem",
                    padding: "6px 14px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="px-4 pb-5 pt-2 flex-shrink-0"
        style={{ maxWidth: 780, width: "100%", margin: "0 auto" }}
      >
        <div
          className="input-wrap flex items-end gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(13,24,38,0.95)",
            border: "1px solid rgba(30,58,95,0.7)",
            transition: "border-color .2s, box-shadow .2s",
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Ask about appointments, health tips, emergencies…"
            disabled={loading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#c9d1d9",
              fontSize: "0.9rem",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: "1.5",
              maxHeight: 120,
              overflowY: "auto",
              paddingTop: 2,
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="send-btn flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background:
                input.trim() && !loading
                  ? "linear-gradient(135deg,#00b4b4,#0077b6)"
                  : "rgba(30,58,95,0.4)",
              color: input.trim() && !loading ? "#fff" : "#2d4a6b",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
            }}
          >
            <SendIcon />
          </button>
        </div>
        <p
          style={{
            fontSize: "0.65rem",
            color: "#1e3a5f",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          MediAssist AI · Powered by Gemini 2.5 Flash · For informational use only
        </p>
      </div>
    </div>
  );
}