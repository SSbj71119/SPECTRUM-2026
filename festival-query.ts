import { queryOptions } from '@tanstack/react-query';
import { getFestival } from './festival.functions';
export const festivalQuery = queryOptions({ queryKey: ['festival'], queryFn: () => getFestival(), staleTime: 10000 });
