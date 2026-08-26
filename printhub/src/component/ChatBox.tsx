'use client';

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id?: string;
  print_order_id: string;
  sender_id: string;
  sender_role: 'customer' | 'shop';
  message: string;
  image_url?: string | null;
  timestamp?: string;
}

interface ChatBoxProps {
  orderId: string;
  currentUserId: string;
  currentUserRole: 'customer' | 'shop';
}

const ChatBox: React.FC<ChatBoxProps> = ({ orderId, currentUserId, currentUserRole }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ลงล่างสุดเมื่อมีข้อความใหม่
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 1. ดึงประวัติแชตจาก MongoDB Backend
    if (orderId) {
      fetch(`http://localhost:5000/api/chat/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMessages(data);
        })
        .catch((err) => console.error('Error fetching chat history:', err));
    }

    // 2. เชื่อมต่อ Socket.io
    const newSocket: Socket = io('http://localhost:5000');
    setSocket(newSocket);

    // เข้าร่วมห้องเฉพาะของออเดอร์นี้
    newSocket.emit('join_room', orderId);

    // 3. รอรับข้อความ Real-time
    newSocket.on('chat message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && input.trim()) {
      const msgData: Message = {
        print_order_id: orderId,
        sender_id: currentUserId,
        sender_role: currentUserRole,
        message: input.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // ยิงข้อความไป Backend (ไม่ต้อง setMessages เอง เดี๋ยว Socket จะกระจายกลับมาให้อัตโนมัติ)
      socket.emit('chat message', msgData);
      setInput('');
    }
  };

  return (
    <div className="chat-box border rounded-xl p-4 bg-white shadow-md max-w-md w-full flex flex-col h-[500px]">
      <div className="border-b pb-3 mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">
            {currentUserRole === 'customer' ? 'ห้องพูดคุยกับร้านค้า' : 'ห้องพูดคุยกับลูกค้า'}
          </h3>
          <p className="text-xs text-slate-500">ออเดอร์ #{orderId}</p>
        </div>
      </div>

      {/* ข้อความในห้องแชต */}
      <div className="messages overflow-y-auto flex-1 mb-3 space-y-3 pr-1">
        {messages.map((m, index) => {
          const isMe = m.sender_role === currentUserRole;
          return (
            <div
              key={m.id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                {isMe ? 'คุณ' : m.sender_role === 'shop' ? 'ร้านค้า' : 'ลูกค้า'}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {m.message}
              </div>
              {m.timestamp && (
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                  {m.timestamp}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ฟอร์มพิมพ์ข้อความ */}
      <form onSubmit={sendMessage} className="flex gap-2 border-t pt-3">
        <input
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          className="border border-slate-300 rounded-full px-4 py-2 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="พิมพ์ข้อความ..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition font-medium"
        >
          ส่ง
        </button>
      </form>
    </div>
  );
};

export default ChatBox;