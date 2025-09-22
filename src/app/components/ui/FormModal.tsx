'use client';

import React, { useState } from "react";
import { API } from "../../../services/api";
import Cookies from "js-cookie";
import "./form.css"

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

  const token = Cookies.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

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
        return;
      }

      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setIsOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
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
            <h3 className="text-lg font-bold mb-4 text-glow text-center">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mb-2 p-2 rounded border border-white/30 bg-white/10 placeholder-gray-300 text-white"
                required
              />
              <textarea
                placeholder="Message"
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
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
