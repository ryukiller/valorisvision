import fs from 'fs/promises';
import { NextResponse } from 'next/server';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(req) {
    const fetchCoins = async (pageNum) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${pageNum}&sparkline=false&locale=en`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    let page = 1;
    let coins;

    do {
        coins = await fetchCoins(page);
        if (coins && coins.length > 0) {
            try {
                // Write each page to a separate file
                await fs.writeFile(`./public/data/markets_page_${page}.json`, JSON.stringify(coins));
            } catch (err) {
                console.error('Error writing to file:', err);
                return NextResponse.json({ message: "Error writing to file" }, { status: 500 });
            }
            page++;
            await delay(10000); // Delay to avoid rate limits
        }
    } while (coins && coins.length > 0);

    // If the loop completes without errors
    return NextResponse.json({ message: "Data saved successfully" }, { status: 200 });
}
