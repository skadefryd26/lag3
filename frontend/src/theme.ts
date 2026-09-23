import { createTheme } from '@mantine/core';

const FONT = '"Segoe UI", "Inter", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: FONT,
  headings: {
    fontFamily: FONT,
    fontWeight: '700',
  },
});
