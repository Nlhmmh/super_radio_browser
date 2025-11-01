import { DarkTheme, DefaultTheme } from '@react-navigation/native'

export interface ColorPalette {
  primary: string // e.g., '#007AFF' (Blue)
  secondary: string // e.g., '#FF9500' (Orange)
  background: string // e.g., '#FFFFFF' (White)
  text: string // e.g., '#000000' (Black)
  muted: string // e.g., '#F2F2F7' (Light Gray)
}

export interface LightTheme extends Omit<typeof DefaultTheme, 'colors'> {
  text: string
  background: string
  tint: string
  icon: string
  tabIconDefault: string
  tabIconSelected: string
  buttonBackground: string
  buttonText: string
  outlineButtonBorder: string
  outlineButtonText: string
  cardBackground: string
  shadow: string
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
  }
}

// You'd also likely define a DarkTheme
export interface DarkTheme extends Omit<typeof DarkTheme, 'colors'> {
  text: string
  background: string
  tint: string
  icon: string
  tabIconDefault: string
  tabIconSelected: string
  buttonBackground: string
  buttonText: string
  outlineButtonBorder: string
  outlineButtonText: string
  cardBackground: string
  shadow: string
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
  }
}

export type Theme = LightTheme | DarkTheme
