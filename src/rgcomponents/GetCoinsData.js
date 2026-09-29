'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn, gtagEvent } from "@/lib/utils"
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




const GetCoinsData = ({ onCoinSelect, fieldName }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState([])

    const [coins, setCoins] = useState([]);
    const [lastPage, setLastPage] = useState(false);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const displayRef = useRef(null);
    const lastCoinRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(new AbortController());

    // Keep a separate ref for the debounced search timer. Previously this ref was
    // also used as the CommandInput ref, so React overwrote it with the DOM node
    // and clearTimeout() silently no-op'd.
    const searchTimerRef = useRef(null);

    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const [isLoading, setIsLoading] = useState(false)


    const fetchCoins = async (pageNum, search = '') => {
        setIsLoading(true)
        try {
            abortControllerRef.current.abort(); // Abort previous fetch
            abortControllerRef.current = new AbortController();
            const query = `?page=${pageNum}&limit=12${search ? `&searchTerm=${search}` : ''}`;
            const response = await fetch(`/api/getdata${query}`, { signal: abortControllerRef.current.signal });
            const data = await response.json();
            setIsLoading(false)
            return data.coins;
        } catch (err) {
            setIsLoading(false)
            // Handle errors
            return [];
        }
    };

    useEffect(() => {
        // Reset search/pagination when selection changes (intentional)
        console.log('val changed')
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchTerm('')
        setPage(1)
    }, [value])

    useEffect(() => {
        if (initialFetchDone && !searchTerm) {
            // Async data load on page change (intentional)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCoins(page).then(newCoins => {
                setCoins(prevCoins => [...prevCoins, ...newCoins]);
            });
        }
    }, [page, searchTerm, initialFetchDone]);

    const initiateFetch = () => {
        if (!initialFetchDone) {
            setInitialFetchDone(true);
            setPage(1); // Or any initial page you want to start with
        }
    };

    const handleSearch = (values) => {
        setSearchTerm(values);
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }
        searchTimerRef.current = setTimeout(() => {
            performSearch(values);
        }, 500); // Debounce for 500ms
    };

    const performSearch = async (searchValue) => {
        if (searchValue) {
            const searchResults = await fetchCoins(1, searchValue);
            setFilteredCoins(searchResults);
            gtagEvent({
                action: 'click',
                params: { actionType: 'searchedCoins', value: searchValue }
            })
        } else {
            setFilteredCoins([]);
        }
    };

    const handleScroll = (e) => {
        if (initialFetchDone && !searchTerm && displayRef.current && !lastPage) {
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) {
                setPage(prevPage => prevPage + 1);
                gtagEvent({
                    action: 'scroll',
                    params: { actionType: 'scrolledCoins' }
                })
            }
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
                    name={fieldName}
                    aria-label={fieldName}
                    onClick={initiateFetch}
                >
                    <div className="flex flex-row items-center justify-center gap-2 text-ellipsis overflow-hidden">
                        {value.image ? (
                            <Image className="rounded-full bg-white p-[2px]" src={value.image !== 'missing_large.png' ? value.image : '/logoicon.svg'} width={20} height={20} alt={value.name} />
                        ) : (
                            <Image className="rounded-full bg-white p-[2px]" src="/logoicon.svg" width={20} height={20} alt="ValorisVisio" />
                        )}
                        <span className="text-ellipsis overflow-hidden w-full">{value.name ? value.name : "Select Coin..."}</span>
                    </div>
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[280px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search Coin..."
                        className="h-9"
                        onValueChange={handleSearch}
                        ref={searchTimerRef}
                        isLoading={isLoading}
                    />
                    {filteredCoins.length === 0 && searchTerm && <CommandEmpty>No Coin found.</CommandEmpty>}
                    <CommandGroup
                        ref={displayRef}
                        onScroll={handleScroll}
                        className="max-h-[250px] overflow-scroll"
                    >
                        {(searchTerm ? filteredCoins : coins).map((coin, index) => {
                            // NOTE: the item must NOT be wrapped in another Radix primitive
                            // (e.g. HoverCard). Radix renders a <span> trigger wrapper that
                            // intercepts the pointer event, and cmdk 1.x only fires its
                            // selection when the event target is the item itself -> clicks
                            // and Enter never selected anything.
                            return (
                                <CommandItem
                                    ref={index === (searchTerm ? filteredCoins : coins).length - 1 ? lastCoinRef : null}
                                    key={index}
                                    value={coin.name}
                                    onSelect={() => {
                                        setValue(coin);
                                        onCoinSelect(coin);
                                        setOpen(false);
                                    }}
                                    className="flex flex-row items-center gap-2"
                                >
                                    <Image className="rounded-full bg-white p-[2px]" src={coin.image !== 'missing_large.png' ? coin.image : '/logoicon.svg'} width={24} height={24} alt={coin.name} />
                                    <span className="text-ellipsis overflow-hidden">{coin.name}</span>
                                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                                        ${Number(coin.current_price ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </span>
                                    <CheckIcon
                                        className={cn(
                                            "h-4 w-4 shrink-0",
                                            value?.name?.toLowerCase() === coin.name.toLowerCase() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
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
