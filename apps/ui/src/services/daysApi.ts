import type { AxiosResponse } from 'axios';
import type { AppResponse } from '../shared/interfaces/AppResponse';
import type { Day } from './days';
import axios from 'axios';

const getAll = async (): Promise<AxiosResponse<AppResponse<{ days: Day[] }>>> => {
  return await axios.get('/days');
};
const addDay = async (
  amount: number[],
): Promise<AxiosResponse<AppResponse<{ amount: number[] }>>> => {
  return await axios.post('/days', { amount });
};

export { getAll, addDay };
