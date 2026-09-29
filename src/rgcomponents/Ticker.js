'use client';

import { useEffect, useState } from 'react';

const FALLBACK = [
    { name: 'BITCOIN', symbol: 'BTC', current_price: 67250, price_change_percentage_24h: 2.31 },
    { name: 'ETHEREUM', symbol: 'ETH', current_price: 3480, price_change_percentage_24h: -1.12 },
    { name: 'SOLANA', symbol: 'SOL', current_price: 172.4, price_change_percentage_24h: 5.87 },
    { name: 'XRP', symbol: 'XRP', current_price: 0.62, price_change_percentage_24h: 0.44 },
    { name: 'DOGE', symbol: 'DOGE', current_price: 0.158, price_change_percentage_24h: -3.28 },
    { name: 'ADA', symbol: 'ADA', current_price: 0.44, price_change_percentage_24h: 1.02 },
    { name: 'AVAX', symbol: 'AVAX', current_price: 37.9, price_change_percentage_24h: 2.75 },
    { name: 'LINK', symbol: 'LINK', current_price: 15.2, price_change_percentage_24h: -0.86 },
];

function TickerItem({ coin, live }) {
    const up = coin.price_change_percentage_24h >= 0;
    return (
        <span className="inline-flex items-center gap-2 px-5 whitespace-nowrap">
            <span className="text-neon-cyan/80">{coin.symbol}</span>
            <span>${Number(coin.current_price ?? 0).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
            <span className={up ? 'text-neon-acid' : 'text-neon-magenta'}>
                {up ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
            </span>
            {live && <span className="text-muted-foreground/40">·</span>}
        </span>
    );
}

export default function Ticker() {
    const [coins, setCoins] = useState(FALLBACK);

    useEffect(() => {
        let alive = true;
        fetch('/api/getdata?page=1&limit=10')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (alive && data?.coins?.length) setCoins(data.coins);
            })
            .catch(() => {});
        return () => { alive = false; };
    }, []);

    const doubled = [...coins, ...coins];

    return (
        <div className="overflow-hidden border-t border-line bg-void/60 h-7 flex items-center">
            <div className="animate-marquee w-max flex items-center will-change-transform">
                {doubled.map((coin, i) => (
                    <TickerItem key={`${coin.symbol}-${i}`} coin={coin} live />
                ))}
            </div>
        </div>
    );
}
