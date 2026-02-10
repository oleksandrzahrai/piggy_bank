import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', () => {
  const days = Array.from({ length: 365 }, (_, i) => i + 1);
  const alreadyDepositedMoney = ref([] as number[]);
  const addAlreadyDepositedMoney = (...values: number[]) => {
    alreadyDepositedMoney.value.push(...values);
  };
  return {
    days,
    alreadyDepositedMoney,
    addAlreadyDepositedMoney,
  };
});
