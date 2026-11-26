import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { festivalQuery } from '@/lib/festival-query';
import { pageHead } from '@/lib/festival';
import { PageHeading, EventList } from '@/components/festival-panels';
export const Route=createFileRoute('/events')({head:()=>pageHead('Events & competitions','Explore the SPECTRUM 2026 science and technology program at Rajaji Vidyalaya.'),loader:({context})=>context.queryClient.ensureQueryData(festivalQuery),component:Events});
function Events(){const {data}=useSuspenseQuery(festivalQuery);return <main className="page-container"><PageHeading label="THE FESTIVAL PROGRAM" title="Curiosity, in action." description="Experiments, challenges and discoveries across four departments."/><EventList data={data}/></main>;}
