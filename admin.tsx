import { createFileRoute } from '@tanstack/react-router';
import { festivalQuery } from '@/lib/festival-query';
import { pageHead } from '@/lib/festival';
import { AdminDashboard } from '@/components/admin-dashboard';
export const Route=createFileRoute('/_authenticated/admin')({head:()=>pageHead('Festival admin','Manage SPECTRUM events, student tokens, stall rewards and gallery photos.'),loader:({context})=>context.queryClient.ensureQueryData(festivalQuery),component:AdminDashboard});
