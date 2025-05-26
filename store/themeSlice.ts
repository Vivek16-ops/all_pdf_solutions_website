import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeType;
}

const initialState: ThemeState = {
  theme: typeof window !== 'undefined' && localStorage.getItem('theme')
    ? (localStorage.getItem('theme') as ThemeType)
    : 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
