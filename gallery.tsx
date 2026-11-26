import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { festivalQuery } from '@/lib/festival-query';
import { pageHead } from '@/lib/festival';
import { PageHeading, GalleryGrid } from '@/components/festival-panels';
export const Route=createFileRoute('/gallery')({head:()=>pageHead('Festival gallery','Moments of curiosity, teamwork and discovery at SPECTRUM 2026.'),loader:({context})=>context.queryClient.ensureQueryData(festivalQuery),component:Gallery});
function Gallery(){const {data}=useSuspenseQuery(festivalQuery);return <main className="page-container"><PageHeading label="FESTIVAL GALLERY" title="Discovery, captured." description="The experiments. The people. The moments that bring science to life."/><GalleryGrid data={data}/></main>;}
