import { z } from 'zod';
import type { Tables } from '@/integrations/supabase/types';
export const subjects = ['Physics', 'Chemistry', 'Biology', 'Computer Science'] as const;
export const subjectSchema = z.enum(subjects);
const text = z.string().trim().min(1).max(120);
export const eventSchema = z.object({ id: z.uuid().optional(), title: text, subject: subjectSchema, event_date: z.iso.date(), event_time: z.string().trim().min(1).max(30), location: text, description: z.string().trim().max(2000) });
export const studentSchema = z.object({ id: z.uuid().optional(), fest_id: z.string().regex(/^\d{3}$/), name: text, class_name: z.string().trim().min(1).max(30), team: z.enum(['', 'NEXORA', 'BIOVERSE']) });
export const rewardSchema = z.object({ id: z.uuid().optional(), title: text, category: text, cost: z.number().int().min(1).max(10000), available: z.boolean() });
export const gallerySchema = z.object({ id: z.uuid().optional(), title: text, subject: subjectSchema, caption: z.string().trim().max(1000), storage_path: z.string().regex(/^[a-zA-Z0-9/_.-]+$/).max(255) });
export const tokenSchema = z.object({ student: z.uuid(), kind: z.enum(['grant','redeem']), amount: z.number().int().min(1).max(10000), subject: subjectSchema, reward: z.uuid().optional(), note: z.string().trim().max(500) }).refine(x => x.kind !== 'redeem' || Boolean(x.reward), { message: 'Choose a stall reward' });
export const mutationSchema = z.discriminatedUnion('action', [
 z.object({ action: z.literal('event'), value: eventSchema }),
 z.object({ action: z.literal('student'), value: studentSchema }),
 z.object({ action: z.literal('reward'), value: rewardSchema }),
 z.object({ action: z.literal('gallery'), value: gallerySchema }),
 z.object({ action: z.literal('tokens'), value: tokenSchema }),
 z.object({ action: z.literal('revert'), id: z.uuid() }),
 z.object({ action: z.literal('delete'), table: z.enum(['events','students','rewards','gallery']), id: z.uuid() }),
]);
export type Student = Tables<'students'>;
export type GalleryPhoto = Tables<'gallery'> & { url: string };
export type Festival = { events: Tables<'events'>[]; students: Student[]; rewards: Tables<'rewards'>[]; gallery: GalleryPhoto[]; transactions: Tables<'token_transactions'>[] };
export function rankStudents(students: Student[]) { return [...students].sort((a,b) => b.earned-a.earned || a.fest_id.localeCompare(b.fest_id)); }
export function availableAfterRedemption(balance: number, cost: number) { if (cost <= 0 || balance < cost) throw new Error('Not enough tokens'); return balance - cost; }
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} — SPECTRUM 2026` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — SPECTRUM 2026` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
