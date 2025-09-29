"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react"; // Removed Bot import since we use image now
import { useTranslation } from "react-i18next"; // ✅ Import i18n hook

// ✅ Use i18n keys for questions and answers
const FAQS: Record<string, string> = {
  where_is_your_shop: "answer_where_is_your_shop",
  what_are_your_timings: "answer_what_are_your_timings",
  do_you_provide_eye_testing: "answer_do_you_provide_eye_testing",
  do_you_sell_prescription_glasses: "answer_do_you_sell_prescription_glasses",
  do_you_sell_branded_frames: "answer_do_you_sell_branded_frames",
  do_you_have_budget_frames: "answer_do_you_have_budget_frames",
  do_you_sell_contact_lenses: "answer_do_you_sell_contact_lenses",
  do_you_sell_colored_lenses: "answer_do_you_sell_colored_lenses",
  do_you_provide_home_delivery: "answer_do_you_provide_home_delivery",
  how_long_does_it_take_to_make_glasses: "answer_how_long_does_it_take_to_make_glasses",
  do_you_repair_glasses: "answer_do_you_repair_glasses",
  do_you_replace_lenses_in_existing_frames: "answer_do_you_replace_lenses_in_existing_frames",
  do_you_have_kids_frames: "answer_do_you_have_kids_frames",
  do_you_provide_blue_light_filter_glasses: "answer_do_you_provide_blue_light_filter_glasses",
  do_you_sell_sunglasses: "answer_do_you_sell_sunglasses",
  can_i_get_progressive_lenses: "answer_can_i_get_progressive_lenses",
  do_you_provide_warranty: "answer_do_you_provide_warranty",
  do_you_accept_digital_payments: "answer_do_you_accept_digital_payments",
  do_you_provide_discounts: "answer_do_you_provide_discounts",
  do_you_have_corporate_tie_ups: "answer_do_you_have_corporate_tie_ups",
  can_i_book_an_appointment: "answer_can_i_book_an_appointment",
};

export default function ChatBotButton() {
  const { t } = useTranslation(); // ✅ Initialize i18n
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string | ReactNode }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fallbackReply = (
    <span>
      {t("for_further_queries_please")}{" "}
      <a href="tel:+918299562428" className="text-cyan-400 underline">
        📞 {t("call_us")}
      </a>{" "}
      {t("or")}{" "}
      <a
        href="https://wa.me/918299562428"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 underline"
      >
        💬 {t("whatsapp_us")}
      </a>
      .
    </span>
  );

  const handleSend = (text?: string, fromSuggestion = false) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage) return;

    // ✅ Display translated question if clicked from suggestion
    const displayUserMessage = fromSuggestion ? t(userMessage) : userMessage;

    setMessages((prev) => [...prev, { from: "user", text: displayUserMessage }]);

    let reply: string | ReactNode = fallbackReply;
    if (fromSuggestion) {
      const key = Object.keys(FAQS).find((k) => k === text);
      if (key) {
        reply = t(FAQS[key]); // ✅ Use i18n key for answer
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
        className="fixed bottom-4 right-4 z-50 w-16 h-16 p-0 rounded-full shadow-lg overflow-hidden transition-all hover:scale-105"
      >
        <img 
          src="/pictures/chatBot.png"  // replace with your image in public folder
          alt="Chat Bot"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Side Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full sm:w-96 bg-gray-900 text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-bold">{t("chat_assistant")}</h2>
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
                  {t(q)}
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
                placeholder={t("ask_me_something")}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-md focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
              >
                {t("send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
