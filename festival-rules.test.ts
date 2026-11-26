import { describe, expect, it } from 'vitest';
import { availableAfterRedemption, rankStudents, studentSchema, tokenSchema, type Student } from '@/lib/festival';

const student = (id: string, earned: number, balance: number): Student => ({ id, fest_id: id, name: 'Student', class_name: '11-A', team: '', earned, balance, physics: earned, chemistry: 0, biology: 0, cs: 0 });
describe('Festival token rules', () => {
 it('ranks by earned tokens, not spendable balance', () => {
  expect(rankStudents([student('002',85,85),student('001',90,40)])[0]?.fest_id).toBe('001');
 });
 it('preserves the old badge redemption cost of 20 tokens', () => {
  expect(availableAfterRedemption(40,20)).toBe(20);
 });
 it('does not allow overspending', () => {
  expect(()=>availableAfterRedemption(10,20)).toThrow('Not enough tokens');
 });
 it('requires a three-digit Fest ID', () => {
  expect(studentSchema.safeParse({fest_id:'001',name:'Student',class_name:'11-A',team:''}).success).toBe(true);
  expect(studentSchema.safeParse({fest_id:'01',name:'Student',class_name:'11-A',team:''}).success).toBe(false);
 });
 it('requires a reward for token redemption', () => {
  expect(tokenSchema.safeParse({student:'e07c93d7-d1d9-49d8-b3e7-d40c05ba5a91',kind:'redeem',amount:1,subject:'Physics',note:''}).success).toBe(false);
 });
});