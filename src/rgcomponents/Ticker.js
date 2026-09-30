'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const FALLBACK = [
    { name: 'BITCOIN', symbol: 'BTC', current_price: 67250, price_change_percentage_24h: 2.31, image: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png' },
    { name: 'ETHEREUM', symbol: 'ETH', current_price: 3480, price_change_percentage_24h: -1.12, image: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png' },
    { name: 'SOLANA', symbol: 'SOL', current_price: 172.4, price_change_percentage_24h: 5.87, image: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png' },
    { name: 'XRP', symbol: 'XRP', current_price: 0.62, price_change_percentage_24h: 0.44, image: 'https://coin-images.coingecko.com/coins/images/44/small/xrp-symbol-white_128.png' },
    { name: 'DOGE', symbol: 'DOGE', current_price: 0.158, price_change_percentage_24h: -3.28, image: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png' },
    { name: 'ADA', symbol: 'ADA', current_price: 0.44, price_change_percentage_24h: 1.02, image: 'https://coin-images.coingecko.com/coins/images/975/small/cardano.png' },
    { name: 'AVAX', symbol: 'AVAX', current_price: 37.9, price_change_percentage_24h: 2.75, image: 'https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { name: 'LINK', symbol: 'LINK', current_price: 15.2, price_change_percentage_24h: -0.86, image: 'https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
];

const ICON_SIZE = 14;

function resolveImageSrc(image) {
    if (!image || image === 'missing_large.png') return null;
    return image;
}

function TokenIcon({ coin }) {
    const src = resolveImageSrc(coin.image);
    const [failed, setFailed] = useState(false);
    const showImage = Boolean(src) && !failed;
    const symbol = (coin.symbol || '?').toString().toUpperCase();

    return (
        <span
            className="inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-white/10"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            aria-hidden="true"
        >
            {showImage ? (
                <Image
                    src={src}
                    alt=""
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    className="rounded-full bg-white/90"
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                    loading="lazy"
                    decoding="async"
                    unoptimized
                    onError={() => setFailed(true)}
                />
            ) : (
                <span className="text-[8px] font-semibold leading-none text-neon-cyan/70">
                    {symbol.slice(0, 1)}
                </span>
            )}
        </span>
    );
}

function TickerItem({ coin, live }) {
    const up = coin.price_change_percentage_24h >= 0;
    const symbol = (coin.symbol || '').toString().toUpperCase();

    return (
        <span className="inline-flex items-center gap-1.5 px-5 whitespace-nowrap">
            <TokenIcon coin={coin} />
            <span className="text-neon-cyan/80">{symbol}</span>
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
