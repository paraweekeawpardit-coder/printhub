'use client';

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  _id?: string;
  id?: string;
  print_order_id: string;
  sender_id?: string;
  sender_role?: 'customer' | 'shop';
  sender: 'customer' | 'shop'; // ตรงกับ Mongoose Schema
  message?: string;
  text?: string; // รองรับกรณี Schema ใช้ text
  image_url?: string | null;
  time?: string;
  createdAt?: string;
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!orderId) return;

    // 1. ดึงประวัติแชตจาก API ล่าสุด (/api/chat/history/:print_order_id)
    fetch(`http://localhost:5000/api/chat/history/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) => console.error('Error fetching chat history:', err));

    // 2. เชื่อมต่อ Socket.io
    const newSocket: Socket = io('http://localhost:5000');
    setSocket(newSocket);

    // 3. เข้าร่วมห้องเฉพาะออเดอร์ (ตรงกับ Backend: join_order_chat)
    newSocket.emit('join_order_chat', orderId);

    // 4. รอรับข้อความ Real-time (ตรงกับ Backend: receive_message)
    newSocket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.off('receive_message');
      newSocket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && input.trim()) {
      const msgData = {
        print_order_id: orderId,
        sender_id: currentUserId,
        sender: currentUserRole, // ส่งไปตรงกับ Mongoose Schema
        message: input.trim(),
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // ยิงข้อความไป Backend (ตรงกับ Backend: send_message)
      socket.emit('send_message', msgData);
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
          const senderRole = m.sender || m.sender_role;
          const isMe = senderRole === currentUserRole;
          const msgText = m.message || m.text;
          const displayTime = m.time || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

          return (
            <div
              key={m._id || m.id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                {isMe ? 'คุณ' : senderRole === 'shop' ? 'ร้านค้า' : 'ลูกค้า'}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {msgText}
              </div>
              {displayTime && (
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                  {displayTime}
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