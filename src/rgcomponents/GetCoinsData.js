'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"



function CoinInfo({ info, children }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex ga-3 space-x-4">
                    <Avatar>
                        <AvatarImage src={info.image} />
                        <AvatarFallback>{info.symbol}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{info.name}</h4>
                        <p className="text-xs">
                            Current Price: ${info.current_price}
                        </p>
                        <p className="text-xs">
                            Market Cap: ${info.market_cap?.toLocaleString()}
                        </p>
                        <p className="text-xs">
                            24h Change: {info.price_change_percentage_24h?.toFixed(2)}%
                        </p>
                        <p className="text-xs">
                            Circulating Supply: {info.circulating_supply?.toLocaleString()}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}




const GetCoinsData = ({ onCoinSelect }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState([])

    const [coins, setCoins] = useState([]);
    const [lastPage, setLastPage] = useState(false);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const displayRef = useRef(null);
    const lastCoinRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(new AbortController());

    const fetchCoins = async (pageNum, search = '') => {
        if (!lastPage) {
            try {
                abortControllerRef.current.abort(); // Abort previous fetch
                abortControllerRef.current = new AbortController();
                const response = await fetch(`/data/markets_page_${pageNum}.json`, { signal: abortControllerRef.current.signal });
                const data = await response.json();
                if (search) {
                    return data.filter(coin => coin.name.includes(search));
                }
                return data;
            } catch (err) {
                if (err.status == "404") {
                    setLastPage(true)
                }
                if (err.name !== 'AbortError') {
                    setLastPage(true)
                    console.log(err);
                }
                return [];
            }
        } else {
            console.log('last page hit')
        }
    };

    useEffect(() => {
        console.log(value)
        if (!searchTerm) {
            fetchCoins(page).then(newCoins => {
                setCoins(prevCoins => [...prevCoins, ...newCoins]);
            });
        }
    }, [page, searchTerm]);

    const handleSearch = (values) => {
        console.log(values)
        setSearchTerm(values);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(values);
        }, 500); // Debounce for 500ms
    };

    const performSearch = async (searchValue) => {
        if (searchValue) {
            let searchResults = [];
            let currentPage = 1;
            let data = [];
            do {
                data = await fetchCoins(currentPage, searchValue);
                searchResults = [...searchResults, ...data];
                currentPage++;
            } while (data.length > 0 && !lastPage);
            setFilteredCoins(searchResults);
        } else {
            setFilteredCoins([]);
        }
    };

    const handleScroll = (e) => {
        if (!searchTerm && displayRef.current && !lastPage) {
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <div className="flex flex-row items-center justify-center gap-2">
                        {value.image ? (
                            <Image className="rounded-full bg-white p-[2px]" src={value.image !== 'missing_large.png' ? value.image : '/logoicon.svg'} width={20} height={20} alt={value.name} />
                        ) : (
                            <Image className="rounded-full bg-white p-[2px]" src="/logoicon.svg" width={20} height={20} alt="ValorisVisio" />
                        )}
                        {value.name ? value.name : "Select Coin..."}
                    </div>
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search Coin..."
                        className="h-9"
                        //onValueChange={handleSearch}
                        ref={searchTimeoutRef}
                    />
                    {filteredCoins.length === 0 && searchTerm && <CommandEmpty>No Coin found.</CommandEmpty>}
                    <CommandGroup
                        ref={displayRef}
                        onScroll={handleScroll}
                        className="max-h-[250px] overflow-scroll"
                    >
                        {(searchTerm ? filteredCoins : coins).map((coin, index) => {
                            //console.log(coin)
                            return (
                                <CoinInfo
                                    info={coin}>
                                    <CommandItem
                                        ref={index === (searchTerm ? filteredCoins : coins).length - 1 ? lastCoinRef : null}
                                        key={index}
                                        value={coin.name}
                                        onSelect={() => {
                                            setValue(coin);
                                            onCoinSelect(coin);
                                            setOpen(false);
                                        }}
                                        className="flex flex-row items-center justify-center gap-2"
                                    >
                                        <Image className="rounded-full bg-white p-1" src={coin.image !== 'missing_large.png' ? coin.image : '/logoicon.svg'} width={30} height={30} alt={coin.name} />
                                        {coin.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value?.name?.toLowerCase() === coin.name.toLowerCase() ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                </CoinInfo>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
        // <div className="container mx-auto">
        //     <Input
        //         name={fieldName}
        //         type="text"
        //         placeholder="Search coins..."
        //         value={searchTerm}
        //         onChange={handleSearch}
        //         className="form-input block w-full mt-1 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
        //     />
        //     <div ref={displayRef} onScroll={handleScroll} className="overflow-scroll h-[300px] block w-full mt-1 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm">
        //         {(searchTerm ? filteredCoins : coins).map((coin, index) => (
        //             <div key={index} ref={index === (searchTerm ? filteredCoins : coins).length - 1 ? lastCoinRef : null} className="p-2 border-b border-gray-200">
        //                 {coin.name}
        //             </div>
        //         ))}
        //         {searchTerm && filteredCoins.length === 0 && <div className="p-2 text-center">No results found</div>}
        //     </div>
        // </div>
    );
};

export default GetCoinsData;
