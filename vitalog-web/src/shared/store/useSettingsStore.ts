import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GptLanguage = 'default' | 'en' | 'ko' | 'es';

interface SettingsState {
    gptLanguage: GptLanguage;
    setGptLanguage: (language: GptLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            gptLanguage: 'default',
            setGptLanguage: (language) => set({ gptLanguage: language }),
        }),
        {
            name: 'settings-storage', // name of the item in the storage (must be unique)
        }
    )
); 