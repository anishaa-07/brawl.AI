import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Smile } from 'lucide-react';

const ChatBox = ({ playHover, playClick }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to the global comms channel.', isSystem: true },
    { id: 2, sender: 'Akira2049', text: 'Anyone up for 1v1?' },
    { id: 3, sender: 'CyberShark', text: 'Just ranked up to Platinum!!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  const quickMessages = [
    { text: 'GG', emoji: '🔥' },
    { text: 'Well Played!', emoji: '👏' },
    { text: "Let's Go!", emoji: '⚡' },
    { text: 'Rush B', emoji: '💀' },
    { text: 'Heal Me', emoji: '💊' }
  ];

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate someone typing periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMessages = [
          { sender: 'NeonSamurai', text: 'Anyone for ranked?' },
          { sender: 'VoidWalker', text: 'GG that was intense!' },
          { sender: 'PhantomBlade', text: 'New patch is 🔥' },
        ];
        const msg = botMessages[Math.floor(Math.random() * botMessages.length)];
        setMessages(prev => [...prev, { id: Date.now(), ...msg }]);
      }, 2000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

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
        <h3 className="font-orbitron cyber-text-shadow" style={{ margin: 0, fontSize: '0.85rem' }}>
          <Terminal size={14} className="inline" style={{ marginRight: '6px' }} /> GLOBAL COMMS
        </h3>
        {isTyping && (
          <div className="chat-typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
      </div>
      
      <div className="chat-msg-area custom-scrollbar flex-1 p-15">
        {messages.map((m, i) => (
          <div 
            key={m.id} 
            className={`chat-line-anime chat-msg-animate ${m.isSystem ? 'system-msg' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
             {!m.isSystem && <span className={`chat-sender-anime ${m.sender === 'You' ? 'text-primary' : 'text-neon'}`}>[{m.sender}]</span>}
             <span className="chat-text-anime">{m.text}</span>
          </div>
        ))}
         <div ref={chatEndRef} />
      </div>

      {/* Quick Reaction Buttons */}
      <div className="quick-messages-bar flex items-center gap-10 px-15 py-5 custom-scrollbar" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.3)', overflowX: 'auto', paddingBottom: '8px' }}>
         {quickMessages.map((qm, i) => (
           <button 
             key={i} 
             onClick={() => handleSend(`${qm.emoji} ${qm.text}`)} 
             className="quick-msg-btn font-montserrat bg-black-50 text-gray hover-text-white border border-gray rounded px-10 py-5 cursor-pointer transition-colors quick-react-btn"
             style={{ whiteSpace: 'nowrap', fontSize: '10px' }}
             onMouseEnter={playHover}
           >
             <span style={{ marginRight: '4px' }}>{qm.emoji}</span>{qm.text}
           </button>
         ))}
      </div>

      <form onSubmit={onSubmit} className="chat-input-form mt-auto bg-black-50 p-10 flex" style={{ borderTop: '1px solid #333', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
        <button type="button" className="emoji-btn text-secondary bg-transparent border-none cursor-pointer hover:text-white transition-colors" style={{ paddingRight: '10px' }} title="Emoji menu">
           <Smile size={18} />
        </button>
        <input 
          type="text"
          placeholder="Transmit comms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input-anime font-montserrat text-sm bg-transparent flex-1 border-none text-white outline-none placeholder-gray"
        />
        <button type="submit" className="chat-send-btn-anime rounded border border-gray bg-transparent text-white cursor-pointer transition-all hover-bg-secondary hover-text-white flex justify-center items-center" style={{ width: '32px', height: '32px', marginLeft: '10px' }} onMouseEnter={playHover}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
