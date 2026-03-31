import React from 'react';
import { UserPlus, Circle } from 'lucide-react';

const usersDummy = [
  { id: 1, name: 'CyberShark', online: true, avatar: 'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?w=200&h=200&fit=crop' },
  { id: 2, name: 'NeonSamurai', online: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
  { id: 3, name: 'GlitchTrap', online: false, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop' },
  { id: 4, name: 'VoidWalker', online: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 5, name: 'Akira2049', online: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' }
];

const FriendsList = ({ playHover, playClick }) => {
  return (
    <div className="anime-friends-list glow-border h-full flex-col">
      <div className="anime-panel-header flex-col items-start gap-10">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-orbitron cyber-text-shadow m-0">OPERATORS</h3>
          <span className="online-count text-xs text-primary bg-primary-10 px-5 rounded">3 ONLINE</span>
        </div>
        <button 
          className="create-squad-btn font-orbitron w-full text-xs font-bold py-8 rounded border-none bg-secondary text-white cursor-pointer hover:bg-white hover:text-secondary transition-all"
          onMouseEnter={playHover} onClick={playClick}
        >
           CREATE SQUAD +
        </button>
      </div>

      <div className="friends-list-container custom-scrollbar">
        {usersDummy.map(u => (
          <div key={u.id} className="anime-friend-item" onMouseEnter={playHover} onClick={playClick}>
             <div className="friend-avatar-wrap">
               <img src={u.avatar} alt={u.name} className={`friend-avatar ${u.online ? 'ring-primary' : 'ring-gray'} grayscale-${u.online ? '0' : '100'}`} />
               {u.online && <Circle size={10} className="status-indicator fill-primary" />}
             </div>
             
             <div className="friend-info">
               <span className={`font-montserrat text-sm font-bold ${u.online ? 'text-white' : 'text-gray'}`}>{u.name}</span>
               <span className="font-orbitron text-xs text-secondary">{u.online ? 'IN LOBBY' : 'OFFLINE'}</span>
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
