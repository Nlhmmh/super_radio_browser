import {
  DarkTheme as DefaultDarkTheme,
  DefaultTheme
} from '@react-navigation/native'

// --- ORIGINAL COLORS DEFINITION ---
export const Colors = {
  // Example of using a secondary color (A modern teal/cyan)
  secondaryAccent: 'rgba(0, 190, 150, 1)', // Used for 'notification'

  // --- LIGHT MODE CONFIGURATION ---
  light: {
    text: 'rgba(51, 51, 51, 1)', // Dark gray text (text)
    background: 'rgba(255, 255, 255, 1)', // Pure white background (background)
    tint: 'rgba(190, 40, 190, 1)', // Medium Magenta accent (primary)
    icon: 'rgba(128, 128, 128, 1)',
    tabIconDefault: 'rgba(128, 128, 128, 1)',
    tabIconSelected: 'rgba(190, 40, 190, 1)',

    // --- BUTTON COLORS (Solid & Outline) ---
    buttonBackground: 'rgba(190, 40, 190, 1)',
    buttonText: 'rgba(255, 255, 255, 1)',
    outlineButtonBorder: 'rgba(190, 40, 190, 1)', // Used for 'border'
    outlineButtonText: 'rgba(190, 40, 190, 1)',

    // --- CARD & SHADOW COLORS ---
    cardBackground: 'rgba(250, 250, 250, 1)', // Very slight off-white card (card)
    shadow: 'rgba(0, 0, 0, 1)'
  },

  // --- DARK MODE CONFIGURATION ---
  dark: {
    text: 'rgba(242, 242, 242, 1)', // Near-white text (text)
    background: 'rgba(26, 26, 26, 1)', // Near-black background (background)
    tint: 'rgba(255, 80, 255, 1)', // Bright Magenta accent (primary)
    icon: 'rgba(191, 191, 191, 1)',
    tabIconDefault: 'rgba(191, 191, 191, 1)',
    tabIconSelected: 'rgba(255, 80, 255, 1)',

    // --- BUTTON COLORS (Solid & Outline) ---
    buttonBackground: 'rgba(255, 80, 255, 1)',
    buttonText: 'rgba(26, 26, 26, 1)',
    outlineButtonBorder: 'rgba(255, 80, 255, 1)', // Used for 'border'
    outlineButtonText: 'rgba(255, 80, 255, 1)',

    // --- CARD & SHADOW COLORS ---
    cardBackground: 'rgba(51, 51, 51, 1)', // Darker gray card for elevation (card)
    shadow: 'rgba(0, 0, 0, 1)'
  }
}

// --- LIGHT THEME (Based on React Navigation DefaultTheme) ---
export const LightTheme = {
  ...DefaultTheme,
  // Spread ALL custom light mode colors onto the root theme object
  ...Colors.light,

  // Override the colors property (mapping standard RN colors)
  colors: {
    // Standard required colors
    primary: Colors.light.tint, // Primary interactive color: Medium Magenta
    background: Colors.light.background, // Screen background: Pure White
    card: Colors.light.cardBackground, // Header/Card background: Off-White
    text: Colors.light.text, // Body text color: Dark Gray
    border: Colors.light.outlineButtonBorder, // Separators/Borders: Medium Magenta
    notification: Colors.secondaryAccent // Alerts/Badges: Teal/Cyan
  }
}

// --- DARK THEME (Based on React Navigation DarkTheme) ---
export const DarkTheme = {
  ...DefaultDarkTheme,
  // Spread ALL custom dark mode colors onto the root theme object
  ...Colors.dark,

  // Override the colors property (mapping standard RN colors)
  colors: {
    // Standard required colors
    primary: Colors.dark.tint, // Primary interactive color: Bright Magenta
    background: Colors.dark.background, // Screen background: Near-Black
    card: Colors.dark.cardBackground, // Header/Card background: Dark Gray
    text: Colors.dark.text, // Body text color: Near-White
    border: Colors.dark.outlineButtonBorder, // Separators/Borders: Bright Magenta
    notification: Colors.secondaryAccent // Alerts/Badges: Teal/Cyan
  }
}
