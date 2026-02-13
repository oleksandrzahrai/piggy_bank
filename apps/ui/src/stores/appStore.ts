import { defineStore } from 'pinia';
import type { Day } from '../services/days';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { getAll, addDay } from '../services/daysApi';

export const useAppStore = defineStore('appStore', () => {
  const days: Ref<Day[]> = ref([]);

  const setDays = (data: Day[]): void => {
    days.value = data;
  };

  const getDays = async (): Promise<Day[]> => {
    try {
      const res = await getAll();
      if (res.data.data) {
        const days: Day[] = res.data.data.days;
        setDays(days);
        return days;
      }
      return [];
    } catch (error: unknown) {
      console.error('Error getting days:', error);
      return [];
    }
  };

  const addDays = async (amount: number[]): Promise<void> => {
    try {
      await addDay(amount);
    } catch (error: unknown) {
      console.error('Error adding days:', error);
    }
  };

  return {
    days,
    getDays,
    setDays,
    addDays,
  };
});
