"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bot, X } from "lucide-react";

const FAQS: Record<string, string> = {
  "where is your shop": "Our optical shop is JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR which is located at College Road Zamania Railway Station, Ghazipur, UP, India, Pin 232331",
  "what are your timings": "We are open daily from 08 AM to 08 PM.",
  "do you provide eye testing": "Yes, we offer free computerized eye testing in-store.",
  "do you sell prescription glasses": "Yes, we provide prescription glasses with single vision, bifocal, and progressive lenses.",
  "do you sell branded frames": "Yes, we stock brands like Ray-Ban, Oakley, Fastrack, Vogue, and more.",
  "do you have budget frames": "Yes, we have stylish frames starting from just Rs. 300.",
  "do you sell contact lenses": "Yes, we sell daily, monthly, and yearly contact lenses from leading brands.",
  "do you sell colored lenses": "Yes, colored cosmetic lenses are available in multiple shades.",
  "do you provide home delivery": "Yes, we provide home delivery for glasses and lenses within the city.",
  "how long does it take to make glasses": "It usually takes 1–3 days depending on the lens type.",
  "do you repair glasses": "Yes, we provide frame adjustments and minor repairs.",
  "do you replace lenses in existing frames": "Yes, bring your frame and we will fit new lenses.",
  "do you have kids frames": "Yes, we have a wide collection of lightweight and durable kids’ frames.",
  "do you provide blue light filter glasses": "Yes, we have anti-glare and blue light blocking lenses for computer/mobile use.",
  "do you sell sunglasses": "Yes, we stock polarized and UV-protected sunglasses in many styles.",
  "can i get progressive lenses": "Yes, progressive / multifocal lenses are available.",
  "do you provide warranty": "Yes, most frames and lenses come with warranty.",
  "do you accept digital payments": "Yes, we accept UPI, debit/credit cards, and net banking.",
  "do you provide discounts": "Yes, we have seasonal discounts and special offers on select brands.",
  "do you have corporate tie-ups": "Yes, we offer bulk/corporate packages for companies.",
  "can i book an appointment": "Yes, you can call or WhatsApp us to book an eye test appointment.",
};

export default function ChatBotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string | JSX.Element }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fallbackReply = (
    <span>
      For further queries, please{" "}
      <a href="tel:+918299562428" className="text-cyan-400 underline">
        📞 Call us
      </a>{" "}
      or{" "}
      <a
        href="https://wa.me/918299562428"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 underline"
      >
        💬 WhatsApp us
      </a>
      .
    </span>
  );

  const handleSend = (text?: string, fromSuggestion = false) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    let reply: string | JSX.Element = fallbackReply;
    if (fromSuggestion) {
      const lower = userMessage.toLowerCase();
      for (const q in FAQS) {
        if (lower.includes(q)) {
          reply = FAQS[q];
          break;
        }
      }
    }

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setInput("");
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Side Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full sm:w-96 bg-gray-900 text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-bold">Chat Assistant</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    m.from === "user"
                      ? "bg-blue-600 ml-auto text-right"
                      : "bg-gray-700 mr-auto"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {Object.keys(FAQS).map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q, true)}
                  className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded-lg"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me something..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-md focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
