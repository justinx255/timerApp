import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const TIMERS_STORAGE_KEY = 'TIMERS_STORAGE';

type Timer = {
  id: string;
  name: string;
  duration: number;
  category: string;
  isCompleted: boolean;
  status: 'Pending' | 'Ongoing' | 'completed';
};

type TimerState = {
  isRunning: boolean;
  timeLeft: number;
  status: 'running' | 'paused' | 'completed';
};

type Completed = {
  timetaken: number;
  timeOfCompletion: string;
  category: string;
  name: string;
};

type TimersState = Record<string, TimerState>;

interface TimerSliceState {
  timers: Timer[];
  history: Completed[];
  timersState: TimersState;
}

const initialState: TimerSliceState = {
  timers: [],
  timersState: {},
  history: [],
};

const persistTimers = async (timers: Timer[], timersState: TimersState) => {
  try {
    await AsyncStorage.setItem(
      TIMERS_STORAGE_KEY,
      JSON.stringify({ timers, timersState }),
    );
  } catch (error) {
    console.error('Error saving timers:', error);
  }
};

export const loadTimers = async (): Promise<TimerSliceState> => {
  try {
    const storedData = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : initialState;
  } catch (error) {
    console.error('Error loading timers:', error);
    return initialState;
  }
};

function formatCompletedData(
  name: string,
  duration: number,
  category: string,
  completionTime: Date,
): Completed {
  return {
    timetaken: duration,
    timeOfCompletion: new Date().toISOString().replace('T', ' ').split('.')[0],
    category: category,
    name: name,
  };
}

export const timerSlice = createSlice({
  name: 'timers',
  initialState,
  reducers: {
    addTimer: (state, action: PayloadAction<Omit<Timer, 'id'>>) => {
      const newId = (state.timers.length + 1).toString();
      const newTimer = {
        id: newId,
        ...action.payload,
        isCompleted: false,
      };
      state.timers.push(newTimer);
      state.timersState[newId] = {
        isRunning: false,
        timeLeft: newTimer.duration,
        status: 'paused',
      };
      persistTimers(state.timers, state.timersState);
    },

    startTimer: (state, action: PayloadAction<string>) => {
      if (state.timersState[action.payload]) {
        state.timersState[action.payload].isRunning = true;
        state.timersState[action.payload].status = 'running';
        persistTimers(state.timers, state.timersState);
      }
    },

    pauseTimer: (state, action: PayloadAction<string>) => {
      if (state.timersState[action.payload]) {
        state.timersState[action.payload].isRunning = false;
        state.timersState[action.payload].status = 'paused';
        persistTimers(state.timers, state.timersState);
      }
    },

    resetTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find((t) => t.id === action.payload);
      if (timer) {
        state.timersState[action.payload] = {
          isRunning: false,
          timeLeft: timer.duration,
          status: 'paused',
        };
        persistTimers(state.timers, state.timersState);
      }
    },

    tickTimers: (state) => {
      Object.entries(state.timersState).forEach(([id, timer]) => {
        if (timer.isRunning && timer.timeLeft > 0) {
          state.timersState[id].timeLeft -= 1;
        }
        if (timer.isRunning && timer.timeLeft === 0) {
          state.timersState[id].status = 'completed';
          state.timersState[id].isRunning = false;
          const completedTimer = state.timers.find((t) => t.id === id);
          if (completedTimer) {
            const completedData = formatCompletedData(
              completedTimer.name,
              completedTimer.duration,
              completedTimer.category,
              new Date(),
            );
            state.history.push(completedData);
          }
        }
      });
      persistTimers(state.timers, state.timersState);
    },

    completeTimer: (state, action: PayloadAction<string>) => {
      const timerIndex = state.timers.findIndex((t) => t.id === action.payload);
      if (timerIndex !== -1) {
        const completedTimer = state.timers[timerIndex];
        const completedData = formatCompletedData(
          completedTimer.name,
          completedTimer.duration,
          completedTimer.category,
          new Date(),
        );
        state.timersState[action.payload].status = 'completed';
        state.timersState[action.payload].isRunning = false;
        
        if (state.history) { 
            state.history.push(completedData);
          } else {
            console.error("state.history is undefined in completeTimer reducer.");
          }
              persistTimers(state.timers, state.timersState);
      }
    },

    clearTimers: (state) => {
      state.timers = [];
      state.timersState = {};
      AsyncStorage.removeItem(TIMERS_STORAGE_KEY);
    },

    startAllCategoryTimers: (state, action: PayloadAction<string>) => {
      state.timers.forEach((timer) => {
        if (timer.category === action.payload) {
          state.timersState[timer.id].isRunning = true;
          state.timersState[timer.id].status = 'running';
        }
      });
      persistTimers(state.timers, state.timersState);
    },

    pauseAllCategoryTimers: (state, action: PayloadAction<string>) => {
      state.timers.forEach((timer) => {
        if (timer.category === action.payload) {
          state.timersState[timer.id].isRunning = false;
          state.timersState[timer.id].status = 'paused';
        }
      });
      persistTimers(state.timers, state.timersState);
    },

    resumeAllCategoryTimers: (state, action: PayloadAction<string>) => {
      state.timers.forEach((timer) => {
        if (
          timer.category === action.payload &&
          state.timersState[timer.id].timeLeft > 0
        ) {
          state.timersState[timer.id].isRunning = true;
          state.timersState[timer.id].status = 'running';
        }
      });
      persistTimers(state.timers, state.timersState);
    },

    resetAllCategoryTimers: (state, action: PayloadAction<string>) => {
      state.timers.forEach((timer) => {
        if (timer.category === action.payload) {
          state.timersState[timer.id] = {
            isRunning: false,
            timeLeft: timer.duration,
            status: 'paused',
          };
        }
      });
      persistTimers(state.timers, state.timersState);
    },
  },
});

export const {
  addTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  completeTimer,
  tickTimers,
  clearTimers,
  startAllCategoryTimers,
  pauseAllCategoryTimers,
  resumeAllCategoryTimers,
  resetAllCategoryTimers,
} = timerSlice.actions;

export default timerSlice.reducer;