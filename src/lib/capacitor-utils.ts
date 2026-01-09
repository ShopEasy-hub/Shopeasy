/**
 * Capacitor Platform Utilities
 * Helps detect if the app is running on mobile (iOS/Android) or web
 * 
 * Note: In web-only environments (like Figma Make), this will always detect as 'web'
 * and gracefully skip native-only features.
 */

let platformCache: string | null = null;

/**
 * Get the current platform
 * @returns 'ios' | 'android' | 'web'
 */
export async function getPlatform(): Promise<string> {
  if (platformCache) {
    return platformCache;
  }

  // In web-only environments, Capacitor is not available
  platformCache = 'web';
  return 'web';
}

/**
 * Check if running on native mobile platform
 */
export async function isNativePlatform(): Promise<boolean> {
  const platform = await getPlatform();
  return platform === 'ios' || platform === 'android';
}

/**
 * Check if running on web
 */
export async function isWebPlatform(): Promise<boolean> {
  const platform = await getPlatform();
  return platform === 'web';
}

/**
 * Check if running on iOS
 */
export async function isIOS(): Promise<boolean> {
  const platform = await getPlatform();
  return platform === 'ios';
}

/**
 * Check if running on Android
 */
export async function isAndroid(): Promise<boolean> {
  const platform = await getPlatform();
  return platform === 'android';
}

/**
 * Check if a Capacitor plugin is available
 */
export async function isPluginAvailable(pluginName: string): Promise<boolean> {
  // In web-only environments, plugins are not available
  return false;
}

/**
 * Provide haptic feedback (mobile only)
 * In web environments, this is a no-op
 */
export async function hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
  // No-op in web environment
  console.debug('Haptic feedback requested but not available in web environment');
}

/**
 * Show native toast (mobile only, falls back to sonner on web)
 */
export async function showNativeToast(message: string): Promise<void> {
  try {
    // Always use sonner toast in web environment
    const { toast } = await import('sonner@2.0.3');
    toast(message);
  } catch (error) {
    console.debug('Toast not available:', error);
  }
}

/**
 * Get device info
 */
export async function getDeviceInfo() {
  // Return web platform info
  return {
    platform: 'web',
    model: 'Browser',
    operatingSystem: 'web',
    osVersion: navigator.userAgent,
    manufacturer: 'Browser',
    isVirtual: false,
    webViewVersion: navigator.userAgent
  };
}
