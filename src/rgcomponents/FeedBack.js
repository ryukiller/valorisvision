import { HelpingHand, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function FeedBack() {

    return (
        <>
            <Button variant="outline" size="icon">
                <HelpingHand size={32} strokeWidth={1.5} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
                <span className="sr-only">Donate</span>
            </Button>
            <Button variant="outline" size="icon">
                <Bug size={32} strokeWidth={1.5} className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
                <span className="sr-only">Share Your FeedBack</span>
            </Button>
        </>
    )

}