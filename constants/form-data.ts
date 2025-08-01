export const PRODUCT_TYPES = [
  { value: "electronics", label: "Electronics" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "sports-outdoors", label: "Sports & Outdoors" },
  { value: "automotive", label: "Automotive" },
  { value: "health-beauty", label: "Health & Beauty" },
  { value: "toys-games", label: "Toys & Games" },
] as const

export const BATTERY_TYPES = [
  { value: "aa", label: "AA" },
  { value: "aaa", label: "AAA" },
  { value: "9v", label: "9V" },
  { value: "cr2032", label: "CR2032" },
  { value: "lithium-ion", label: "Lithium Ion" },
  { value: "rechargeable", label: "Rechargeable" },
] as const

export const AVAILABLE_FEATURES = [
  { value: "waterproof", label: "Waterproof", icon: "💧" },
  { value: "wireless", label: "Wireless", icon: "📡" },
  { value: "bluetooth", label: "Bluetooth", icon: "🔵" },
  { value: "usb-c", label: "USB-C", icon: "🔌" },
  { value: "led-display", label: "LED Display", icon: "💡" },
  { value: "touch-screen", label: "Touch Screen", icon: "👆" },
  { value: "voice-control", label: "Voice Control", icon: "🎤" },
  { value: "app-compatible", label: "App Compatible", icon: "📱" },
  { value: "energy-efficient", label: "Energy Efficient", icon: "🌱" },
  { value: "portable", label: "Portable", icon: "🎒" },
] as const

export const FORM_STEPS = {
  BASIC_INFO: 1,
  POWER_REQUIREMENTS: 2,
  FEATURES: 3,
  REVIEW: 4,
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
