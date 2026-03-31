import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Smile } from 'lucide-react';

const ChatBox = ({ playHover, playClick }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the global comms channel.', isSystem: true },
    { id: 2, sender: 'Akira2049', text: 'Anyone up for 1v1?' },
    { id: 3, sender: 'CyberShark', text: 'Just ranked up to Platinum!!' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  
  const quickMessages = ['GG', 'Well Played!', 'Let\'s Go!', 'Rush B', 'Heal Me'];

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    playClick();
    setMessages([...messages, { id: Date.now(), sender: 'You', text }]);
    setInput('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="anime-chat-box glow-border h-full flex-col relative">
      <div className="anime-panel-header">
        <h3 className="font-orbitron cyber-text-shadow"><Terminal size={14} className="inline mr-5" /> GLOBAL COMMS</h3>
      </div>
      
      <div className="chat-msg-area custom-scrollbar flex-1 p-15">
        {messages.map((m) => (
          <div key={m.id} className={`chat-line-anime ${m.isSystem ? 'system-msg' : ''}`}>
             {!m.isSystem && <span className={`chat-sender-anime ${m.sender === 'You' ? 'text-primary' : 'text-neon'}`}>[{m.sender}]</span>}
             <span className="chat-text-anime">{m.text}</span>
          </div>
        ))}
         <div ref={chatEndRef} />
      </div>

      <div className="quick-messages-bar flex items-center gap-10 px-15 py-5 overflow-x-auto hide-scrollbar" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
         {quickMessages.map((qm, i) => (
           <button 
             key={i} 
             onClick={() => handleSend(qm)} 
             className="quick-msg-btn font-montserrat text-[10px] bg-black-50 text-gray hover-text-white border border-gray rounded px-10 py-5 whitespace-nowrap cursor-pointer transition-colors hover:border-primary"
             onMouseEnter={playHover}
           >
             {qm}
           </button>
         ))}
      </div>

      <form onSubmit={onSubmit} className="chat-input-form mt-auto rounded-b-xl border-t border-gray bg-black-50 p-10 flex">
        <button type="button" className="emoji-btn text-secondary bg-transparent border-none cursor-pointer pr-10 hover:text-white transition-colors" title="Emoji menu unavailable">
           <Smile size={18} />
        </button>
        <input 
          type="text"
          placeholder="Transmit comms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input-anime font-montserrat text-sm bg-transparent flex-1 border-none text-white outline-none placeholder-gray"
        />
        <button type="submit" className="chat-send-btn-anime w-8 h-8 rounded border border-gray bg-transparent text-white cursor-pointer transition-all hover-bg-secondary hover-text-white ml-10 flex justify-center items-center" onMouseEnter={playHover}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
