import { useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const isNarrow = width < 360;
  const isWide = width >= 600;
  const hasLargeText = fontScale > 1.15;
  return {
    width,
    isNarrow,
    isWide,
    stackColumns: isNarrow || hasLargeText,
    horizontalPadding: isNarrow ? 16 : isWide ? 32 : 20,
    verticalPadding: height < 700 ? 14 : 20,
    titleSize: isNarrow ? 27 : isWide ? 34 : 30,
    compact: isNarrow || height < 700
  };
}
