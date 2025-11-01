/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, BotIcon, XIcon } from './icons';
import Spinner from './Spinner';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatPanelProps {
  onClose?: () => void;
  isMobile?: boolean;
  language: Language;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose, isMobile = false, language }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: t.chatSystemInstruction,
      },
    });
    setChat(chatSession);
    setMessages([{ role: 'model', text: t.chatWelcome }]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage.text });
      const botMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { role: 'model', text: t.chatError };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatInterface = (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
            <BotIcon className="w-6 h-6 text-gray-700"/>
            <h2 className="text-xl font-serif tracking-wider text-gray-800">{t.aiAssistant}</h2>
        </div>
        {!isMobile && onClose && (
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <XIcon className="w-6 h-6"/>
            </button>
        )}
      </header>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100">
                <Spinner />
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.typeYourMessage}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-800 transition-shadow"
          disabled={isLoading}
        />
        <button type="submit" className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:bg-gray-300 transition-colors" disabled={isLoading || !input.trim()}>
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );

  if (isMobile) {
    return chatInterface;
  }

  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
    >
        {chatInterface}
    </motion.div>
  );
};

export default ChatPanel;
