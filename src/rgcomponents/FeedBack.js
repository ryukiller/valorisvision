"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { HelpingHand, Bug, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';

import { useToast } from "@/components/ui/use-toast"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useState } from "react";


const FeedBackForm = () => {

    const [open, setOpen] = useState(false)

    const { toast } = useToast()

    const FormSchema = z.object({
        email: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        subject: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        feedback: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            subject: "",
            feedback: "",
        },
    })

    function onSubmit(data) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })

        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white dark:bg-slate-800">
                    <Bug size={32} strokeWidth={1.5} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
                    <span className="sr-only">Share Your FeedBack</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Give us your FeedBack</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="me@gmail.com" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Input your email address
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="subject" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter a subject for the feedback
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="feedback"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Feedback</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Feedback..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter your feedback
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                        Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}


const TokenItem = ({ title, addrs }) => {

    const { toast } = useToast()

    const icons = {
        eth: {
            "title": "Etheruem",
            "ticker": "ETH",
            "img": "/eth.png"
        },
        btc: {
            "title": "Bitcoin",
            "ticker": "BTC",
            "img": "/btc.png"
        },
        sui: {
            "title": "Sui Network",
            "ticker": "SUI",
            "img": "/sui.png"
        },

    }

    const copyAddrs = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
            toast({
                title: `${icons[title]?.title} address copied to clipboard `,
                img: icons[title]?.img ?? '/logoicon.svg',
                description: ` ${icons[title]?.ticker}: ${address}`,
            })
        } catch (err) {
            alert('Failed to copy: ', err);
            toast({
                title: `Something went wrong`,
                description: `${err.message}`,
            })
        }
    };

    return (
        <DropdownMenuItem onClick={() => copyAddrs(addrs)} className="flex flex-row gap-3 cursor-pointer">
            <Image src={icons[title]?.img ?? '/logoicon.svg'} width={25} height={25} alt={icons[title]?.title ?? 'Unknown Token'} />
            <span>{icons[title]?.title ?? 'Unknown Token'}</span>
            <Copy size={18} strokeWidth={1.5} />
        </DropdownMenuItem>
    )
}



export default function FeedBack() {

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" title="Donate me some Crypto" className="bg-white dark:bg-slate-800">
                        <HelpingHand size={32} strokeWidth={1.5} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
                        <span className="sr-only">Donate</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <h3 className="p-3 text-sm">Donate me some Crypto</h3>
                    <TokenItem title="btc" addrs="btc0x12345" />
                    <TokenItem title="eth" addrs="eth0x12345" />
                    <TokenItem title="sui" addrs="sui0x12345" />
                </DropdownMenuContent>
            </DropdownMenu>
            <FeedBackForm />
        </>
    )

}