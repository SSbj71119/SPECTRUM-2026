import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { festivalQuery } from '@/lib/festival-query';
import { pageHead } from '@/lib/festival';
import { PageHeading, Leaderboard, StallRewards } from '@/components/festival-panels';
export const Route=createFileRoute('/leaderboard')({head:()=>pageHead('Student leaderboard','Live student rankings, Fest Passes and token rewards at SPECTRUM 2026.'),loader:({context})=>context.queryClient.ensureQueryData(festivalQuery),component:Board});
function Board(){const {data}=useSuspenseQuery(festivalQuery);return <main className="page-container"><PageHeading label="LIVE STUDENT LEADERBOARD" title="Every discovery counts." description="Ranked by total tokens earned. Redeeming a reward never lowers your rank."/><Leaderboard data={data}/><h2 className="mb-6 mt-16 font-display text-3xl font-bold">Stall rewards</h2><StallRewards data={data}/></main>;}
