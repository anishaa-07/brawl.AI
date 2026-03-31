import React from 'react';
import { ShoppingCart, Coins, Shield } from 'lucide-react';

const Store = ({ playHover, playClick }) => {
  const items = [
    { title: 'Neon Ronin Skin', price: 5000, type: 'Skin', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop' },
    { title: 'Glitch Core Aura', price: 2500, type: 'Aura', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&h=300&fit=crop' },
    { title: 'Mecha Samurai Avatar', price: 1500, type: 'Avatar', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop' },
    { title: 'Electric Blade Power-up', price: 500, type: 'Item', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop' },
  ];

  return (
    <div className="anime-store-panel glow-border flex-col h-full w-full mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
      <div className="anime-panel-header p-20 border-b border-gray flex justify-between items-center">
         <h2 className="font-orbitron cyber-text-shadow text-white text-xl m-0 flex items-center gap-10">
           <ShoppingCart className="text-secondary" /> BLACK MARKET
         </h2>
         <div className="coins-display font-orbitron flex items-center gap-5 text-gold text-lg font-bold">
           <Coins size={18} /> 12,450 CR
         </div>
      </div>

      <div className="store-grid p-20 flex-1 overflow-y-auto custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {items.map((item, i) => (
          <div key={i} className="store-item-card flex-col border border-gray rounded bg-black-50 transition-all hover-border-primary" style={{ cursor: 'pointer' }} onMouseEnter={playHover} onClick={playClick}>
            <div className="item-img-wrapper" style={{ height: '200px', width: '100%', overflow: 'hidden', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', position: 'relative' }}>
               <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover-scale-img" />
               <span className="font-orbitron text-xs font-bold text-white bg-black-70 px-10 py-5 absolute top-10 left-10 rounded border border-gray">{item.type}</span>
            </div>
            
            <div className="item-info p-15 flex-col flex-1">
              <h3 className="font-orbitron text-white m-0 tracking-wide text-sm">{item.title}</h3>
              <div className="price-tag flex items-center gap-5 mt-auto pt-15 w-full">
                 <button className="buy-btn flex items-center justify-center gap-5 w-full font-orbitron text-xs font-bold bg-primary text-black py-10 rounded border-none cursor-pointer transition-all hover-white">
                   <Coins size={14} /> {item.price.toLocaleString()}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
