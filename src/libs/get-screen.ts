import theme from 'tailwindcss/defaultTheme'

export const ScreenValue = ['sm', 'md', 'lg', 'xl', '2xl'] as const
export type ScreenValue = (typeof ScreenValue)[number]
export const ScreenValueMax = ['max-sm', 'max-md', 'max-lg', 'max-xl', 'max-2xl'] as const
export type ScreenValueMax = (typeof ScreenValueMax)[number]
export function getScreen(value: 'xs' | ScreenValue | ScreenValueMax): string {
  let screen = ''
  const isMaxScreenQuery = ScreenValueMax.includes(value as ScreenValueMax)
  if (value === 'xs') {
    screen = `(max-width: ${theme.screens.sm})`
  } else if (!isMaxScreenQuery && theme.screens[value as ScreenValue]) {
    screen = `(min-width: ${theme.screens[value as ScreenValue]})`
  }

  if (isMaxScreenQuery) {
    const val = value.split('-')[1]
    screen = `not all and (min-width: ${theme.screens[val as ScreenValue]})`
  }

  return screen
}
