<template>
  <q-page class="app">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <q-tabs v-model="tab" class="text-teal">
          <q-tab label="Сховати" name="hide" />
          <q-tab label="Показати" name="open" />
        </q-tabs>

        <q-tab-panels class="windowContent" v-model="tab" animated>
          <q-tab-panel name="hide" class="text-center" style="font-size: large">
            Скільки вже назбиралось коштів?
          </q-tab-panel>

          <q-tab-panel name="open" class="text-center">
            <div class="text-h4 text-weight-bold">
              {{ totalSum.toFixed(2) + ' грн' }}
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>

    <q-btn class="card-btn" label="Внести" @click="prompt = true" />

    <q-dialog v-model="prompt" persistent>
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Внесіть суму</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input dense v-model="depositedMoney" autofocus />
            <div v-if="distributedValue.length">
              Будуть використані дні:
              {{ distributedValue.join(', ') }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Відміна" v-close-popup />
            <q-btn v-if="!submitButton" label="Розподілити" @click="onDistributeClick" />
            <q-btn v-else type="submit" label="Зберегти" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <div class="elementsList">
      <div class="elements">
        <div v-for="day in days" :key="day.dayNumber">
          <q-card :class="['element', { 'has-value': day.isPaid }]">
            <q-card-section>
              <div>{{ day.dayNumber }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '../../stores/appStore';
// import { Day } from '../../services/days';
// import { store } from 'quasar/wrappers';

const appStore = useAppStore();
const tab = ref('hide');
const days = computed(() => appStore.days);
const prompt = ref(false);

onMounted(async () => {
  await appStore.getDays();
  // console.log(JSON.stringify(appStore.days, null, 2));
});

const depositedMoney: Ref<number | null> = ref(null);
const distributedValue: Ref<number[]> = ref([]);

const totalSum = computed(() =>
  appStore.days.filter((d) => d.isPaid).reduce((sum, d) => sum + d.dayNumber, 0),
);

// const findMoneyDay = (day: number) => appStore.days.find((d) => d.dayNumber === day)?.isPaid;

const submitButton: Ref<boolean> = ref(false);

const onDistributeClick = () => {
  distributedValue.value = [];
  submitButton.value = false;
  const value = Number(depositedMoney.value);

  if (!value || value <= 0) {
    console.warn('Введіть коректне число більше 0');
    return;
  }

  const freeDays = appStore.days.filter((day) => !day.isPaid).map((day) => day.dayNumber);

  const freeSet = new Set(freeDays);

  if (freeDays.length === 0) {
    console.warn('Всі дні вже зайняті');
    return;
  }

  // 1 ЧИСЛО
  if (freeSet.has(value)) {
    distributedValue.value.push(value);
    submitButton.value = true;
    depositedMoney.value = null;
    return;
  }

  // 2 ЧИСЛА
  for (let i = 0; i < freeDays.length; i++) {
    const a = freeDays[i]!;
    const b = value - a;
    if (b !== a && freeSet.has(b)) {
      distributedValue.value.push(a, b);
      console.log('Розкладено на 2 числа:', [a, b]);
      submitButton.value = true;
      depositedMoney.value = null;
      return;
    }
  }

  //  3 ЧИСЛА
  for (let i = 0; i < freeDays.length; i++) {
    for (let j = i + 1; j < freeDays.length; j++) {
      const a = freeDays[i]!;
      const b = freeDays[j]!;
      const c = value - a - b;

      if (c !== a && c !== b && freeSet.has(c)) {
        distributedValue.value.push(a, b, c);
        console.log('Розкладено на 3 числа:', [a, b, c]);
        submitButton.value = true;
        depositedMoney.value = null;
        return;
      }
    }
  }

  // FALLBACK (якщо красивої комбінації нема)
  console.log('freeDays', freeDays);
  const sorted = [...freeDays].sort((a, b) => b - a);
  console.log('sorted', sorted);
  let remaining = value;
  const result: number[] = [];

  for (const day of sorted) {
    if (day <= remaining) {
      result.push(day);
      remaining -= day;
    }
    if (remaining === 0) break;
  }

  if (result.length > 0) {
    distributedValue.value.push(...result);
    console.warn('Ідеальну комбінацію не знайдено, використано:', result);
  } else {
    console.warn('Неможливо розкласти це число');
  }

  depositedMoney.value = null;
  if (distributedValue.value.length > 0) {
    submitButton.value = true;
  }
  return distributedValue.value;
};

const onSubmit = async () => {
  await appStore.addDays(distributedValue.value);
  await appStore.getDays();
  distributedValue.value = [];
  submitButton.value = false;
  depositedMoney.value = null;
  prompt.value = false;
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 90%;
  margin: 2em auto;
}
.my-card {
  /* margin: 2em auto; */
  padding: var(--gap);
  border-radius: 20px;
  background: #532997;
  /* width: 90%; */
}

.card-btn {
  /* width: 90%; */
  height: 60px;
  /* margin: 2em auto; */

  background: white;
  border: 3px solid #532997;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  /* padding: 0; */
}
.dialog-card {
  border: 3px solid #532997;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: white;
  color: #532997;
}

.windowContent {
  border-radius: 20px;
  margin-top: 1em;
}

.field {
  position: relative;
  box-sizing: border-box;
  height: var(--field-size);
  width: var(--field-size);
}

.elements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* проміжок між днів */
  justify-content: center;
}

.element {
  width: 70px; /* фіксована ширина всіх клітинок */
  height: 30px; /* висота смужки */

  background: white;
  border-radius: 10px;
  border: 3px solid #532997;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-weight: 600;
  font-size: 14px;

  position: relative;
  overflow: hidden;
}

.element:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
}

.element.has-value::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: #532997;
  transform: rotate(-20deg);
}
</style>
