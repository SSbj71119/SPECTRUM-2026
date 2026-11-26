import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { mutationSchema, type Festival } from './festival';

export const getFestival = createServerFn({ method: 'GET' }).handler(async (): Promise<Festival> => {
 const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
 if (!url || !key) throw new Error('Festival service unavailable');
 const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers}); } } });
 const [events,students,rewards,gallery,transactions] = await Promise.all([
 db.from('events').select('*').order('event_date').order('title').limit(1000), db.from('students').select('*').order('earned',{ascending:false}).limit(1000), db.from('rewards').select('*').order('cost').limit(1000), db.from('gallery').select('*').order('created_at',{ascending:false}).limit(1000), db.from('token_transactions').select('*').order('created_at',{ascending:false}).limit(1000),
 ]);
 for (const result of [events,students,rewards,gallery,transactions]) if (result.error) throw new Error(result.error.message);
 const photos = await Promise.all((gallery.data ?? []).map(async photo => {
  const { data, error } = await db.storage.from('festival-gallery').createSignedUrl(photo.storage_path, 3600);
  if (error || !data) throw new Error('Gallery image unavailable');
  // The browser cannot reach the sandbox-local server storage origin.
  const imageUrl = new URL(data.signedUrl); const publicUrl = import.meta.env['VITE_SUPABASE_URL'];
  return { ...photo, url: publicUrl ? `${publicUrl}${imageUrl.pathname}${imageUrl.search}` : data.signedUrl };
 }));
 return { events: events.data ?? [], students: students.data ?? [], rewards: rewards.data ?? [], gallery: photos, transactions: transactions.data ?? [] };
});
export const manageFestival = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(input => mutationSchema.parse(input)).handler(async ({ data, context }) => {
 const db = context.supabase;
 const role = await db.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 if (role.error || !role.data) throw new Error('Administrator access required');
 let error: { message: string } | null = null;
 switch(data.action) {
  case 'event': { const { id, ...value } = data.value; const r = id ? await db.from('events').update(value).eq('id',id) : await db.from('events').insert(value); error=r.error; break; }
  case 'student': { const { id, ...value } = data.value; const r = id ? await db.from('students').update(value).eq('id',id) : await db.from('students').insert(value); error=r.error; break; }
  case 'reward': { const { id, ...value } = data.value; const r = id ? await db.from('rewards').update(value).eq('id',id) : await db.from('rewards').insert(value); error=r.error; break; }
  case 'gallery': { const { id, ...value } = data.value; const r = id ? await db.from('gallery').update(value).eq('id',id) : await db.from('gallery').insert(value); error=r.error; break; }
  case 'delete': { const r = await db.from(data.table).delete().eq('id',data.id); error=r.error; break; }
  case 'tokens': { const v=data.value; const r = await db.rpc('change_tokens',{p_student:v.student,p_kind:v.kind,p_amount:v.amount,p_subject:v.subject,p_note:v.note,...(v.reward ? {p_reward:v.reward} : {})}); error=r.error; break; }
  case 'revert': { const r=await db.rpc('revert_tokens',{p_transaction:data.id}); error=r.error; break; }
 }
 if (error) throw new Error(error.message);
 return { ok: true };
});
