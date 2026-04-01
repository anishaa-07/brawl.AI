import React from 'react';
import { UserPlus } from 'lucide-react';

const usersDummy = [
  { id: 1, name: 'CyberShark', online: true, status: 'IN MATCH', avatar: 'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?w=200&h=200&fit=crop' },
  { id: 2, name: 'NeonSamurai', online: true, status: 'IN LOBBY', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
  { id: 3, name: 'GlitchTrap', online: false, status: 'OFFLINE', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop' },
  { id: 4, name: 'VoidWalker', online: false, status: 'OFFLINE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 5, name: 'Akira2049', online: true, status: 'IDLE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' }
];

const FriendsList = ({ playHover, playClick }) => {
  return (
    <div className="anime-friends-list glow-border h-full flex-col">
      <div className="anime-panel-header flex-col items-start gap-10">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-orbitron cyber-text-shadow m-0" style={{ fontSize: '0.85rem' }}>OPERATORS</h3>
          <span className="online-count text-xs text-primary bg-primary-10 px-5 rounded" style={{ padding: '3px 10px' }}>3 ONLINE</span>
        </div>
        <button 
          className="create-squad-btn font-orbitron w-full text-xs font-bold py-8 rounded border-none bg-secondary text-white cursor-pointer hover:bg-white hover:text-secondary transition-all"
          onMouseEnter={playHover} onClick={playClick}
          style={{ padding: '10px', transition: 'all 0.3s' }}
        >
           CREATE SQUAD +
        </button>
      </div>

      <div className="friends-list-container custom-scrollbar">
        {usersDummy.map((u, i) => (
          <div 
            key={u.id} 
            className="anime-friend-item friend-item-animate" 
            onMouseEnter={playHover} 
            onClick={playClick}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
             <div className="friend-avatar-wrap">
               <img src={u.avatar} alt={u.name} className={`friend-avatar ${u.online ? 'ring-primary' : 'ring-gray'}`} style={{ filter: u.online ? 'none' : 'grayscale(1)' }} />
               <div className={`friend-status-dot ${u.online ? 'online-pulse' : 'offline-dot'}`}></div>
             </div>
             
             <div className="friend-info">
               <span className={`font-montserrat text-sm font-bold ${u.online ? 'text-white' : 'text-gray'}`}>{u.name}</span>
               <span className="font-orbitron" style={{ fontSize: '0.65rem', color: u.online ? (u.status === 'IN MATCH' ? 'var(--neon)' : 'var(--secondary)') : '#555' }}>{u.status}</span>
             </div>
             
             <button className="invite-btn-anime" disabled={!u.online}>
               <UserPlus size={16} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
