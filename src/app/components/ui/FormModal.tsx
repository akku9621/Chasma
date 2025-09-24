'use client';

import React, { useState } from "react";
import { API } from "../../../services/api";
import Cookies from "js-cookie";
import "./form.css"
import { useTranslation } from "react-i18next";

interface ModalProps {
  linkText?: string;
}

export default function FormModal({ linkText = "Contact Us" }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // ADDED: State for status message
  const { t } = useTranslation(); 

  const token = Cookies.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setStatusMessage(""); // Clear previous message

    try {
      // form-urlencoded encoding
      const body = new URLSearchParams();
      body.append("name", name);
      body.append("subject", subject);
      body.append("message", message);
      if (email) body.append("email", email);
      if (phone) body.append("phone", phone);

      const res = await fetch(API.FORM.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: body.toString(),
      });

      if (!res.ok) {
        console.error("Failed to submit:", await res.text());
        setStatusMessage(t("failed_to_submit")); // MODIFIED: Set failure message
        return;
      }

      // MODIFIED: Handle successful submission
      setStatusMessage(t("submitted")); 
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      
      setTimeout(() => {
        setIsOpen(false); // Close modal after 3 seconds
        setStatusMessage(""); // Clear message
      }, 3000);

    } catch (err) {
      console.error("Submit error:", err);
      setStatusMessage(t("failed_to_submit")); // MODIFIED: Set failure message
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Link in navbar */}
      <span
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-gray-300 hover:text-cyan-400 hover:glass-effect px-4 py-2 rounded-lg transition-all"
      >
        {linkText}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed mt-50 inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="relative bg-black bg-opacity-30 border border-white/20 backdrop-blur-md p-6 rounded-lg max-w-md w-full text-white mx-4">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4 text-glow text-center">{t("send_a_message")}</h3>

            {/* ADDED: Display status message */}
            {statusMessage && (
                <div 
                    className={`p-3 mb-4 rounded text-center font-semibold ${
                        statusMessage === t("submitted") 
                            ? 'bg-green-500/20 text-green-300 border border-green-500' 
                            : 'bg-red-500/20 text-red-300 border border-red-500'
                    }`}
                >
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t("name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                required
              />
              <input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
              />
              <input
                type="tel"
                placeholder={t("phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                maxLength={10}
                pattern="\d{10}"
                required
              />

              {/* Subject Dropdown */}
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 text-white placeholder-gray-300 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-300 bg-gray-900">{t("select_subject")}</option>
                <option value="Book" className="text-white bg-gray-900">{t("book")}</option>
                <option value="Call Me" className="text-white bg-gray-900">{t("call_me")}</option>
                <option value="Query" className="text-white bg-gray-900">{t("query")}</option>
                <option value="Other" className="text-white bg-gray-900">{t("other")}</option>
              </select>

              <textarea
                placeholder={t("message")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-glow font-semibold"
                disabled={loading}
              >
                 {loading ? t("submitting") : t("submit")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}