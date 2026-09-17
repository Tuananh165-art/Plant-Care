import { PropsWithChildren, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTheme } from '@/src/lib/tokens';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';

export function Screen({ children, padded = true, style }: PropsWithChildren<{ padded?: boolean; style?: StyleProp<ViewStyle> }>) {
  const t = getTheme(useColorScheme()); const layout = useResponsiveLayout();
  return <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.screen, padded && { padding: layout.horizontalPadding, gap: 14 }, { backgroundColor: t.background }, style]}>{children}</SafeAreaView>;
}

export function Title({ children }: PropsWithChildren) { const t = getTheme(useColorScheme()); const layout = useResponsiveLayout(); return <Text accessibilityRole="header" style={[styles.title, { color: t.text, fontSize: layout.titleSize }]}>{children}</Text>; }
export function Eyebrow({ children }: PropsWithChildren) { const t = getTheme(useColorScheme()); return <Text style={[styles.eyebrow, { color: t.primary }]}>{children}</Text>; }
export function Body({ children }: PropsWithChildren) { const t = getTheme(useColorScheme()); return <Text style={[styles.body, { color: t.text }]}>{children}</Text>; }

export function AppButton({ label, onPress, tone = 'primary', disabled = false }: { label: string; onPress: () => void; tone?: 'primary' | 'secondary' | 'danger'; disabled?: boolean }) {
  const t = getTheme(useColorScheme()); const [scale] = useState(() => new Animated.Value(1)); const reduceMotion = useReducedMotion();
  const backgroundColor = tone === 'primary' ? t.primary : tone === 'danger' ? t.danger : t.surface;
  const color = tone === 'primary' ? t.primaryText : tone === 'danger' ? t.primaryText : t.text;
  return <Animated.View style={{ transform: [{ scale }] }}><Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} onPressIn={() => { if (!reduceMotion) Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start(); }} onPressOut={() => { if (!reduceMotion) Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(); }} style={({ pressed }) => [styles.button, { backgroundColor, borderColor: tone === 'secondary' ? t.border : backgroundColor, opacity: pressed || disabled ? 0.76 : 1 }]}><Text style={{ color, fontWeight: '800', fontSize: 15 }}>{label}</Text></Pressable></Animated.View>;
}

export function Field({ label, value, onChangeText, placeholder, keyboardType = 'default' }: { label: string; value: string; onChangeText: (text: string) => void; placeholder: string; keyboardType?: 'default' | 'numeric' | 'email-address' }) {
  const t = getTheme(useColorScheme());
  return <View style={styles.field}><Text style={{ color: t.text, fontWeight: '800' }}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={t.muted} keyboardType={keyboardType} style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.surface }]} /></View>;
}

export function Loadable({ loading, error, empty, retry, children }: PropsWithChildren<{ loading: boolean; error?: Error | null; empty: boolean; retry: () => void }>) {
  const t = getTheme(useColorScheme());
  if (loading) return <View style={styles.center}><View style={[styles.loaderDot, { backgroundColor: t.primarySoft }]}><ActivityIndicator color={t.primary} accessibilityLabel="Đang tải dữ liệu" /></View><Body>Đang làm mới khu vườn của bạn...</Body></View>;
  if (error) return <View style={styles.center}><Text style={styles.stateEmoji}>🪴</Text><Body>{error.message}</Body><AppButton label="Thử lại" onPress={retry} /></View>;
  if (empty) return <View style={styles.center}><Text style={styles.stateEmoji}>🌱</Text><Body>Chưa có cây nào. Hãy thêm cây đầu tiên.</Body><AppButton label="Thử lại" onPress={retry} /></View>;
  return <>{children}</>;
}

export function OfflineBanner({ text }: { text: string }) { const t = getTheme(useColorScheme()); return <View accessibilityRole="alert" style={[styles.banner, { borderColor: t.border, backgroundColor: t.warningSoft }]}><Text style={{ color: t.warning, lineHeight: 20 }}>{text}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1 }, title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.7 }, eyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' }, body: { fontSize: 16, lineHeight: 24 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, padding: 24 }, loaderDot: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }, stateEmoji: { fontSize: 46 }, button: { minHeight: 48, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, borderRadius: 16, borderWidth: 1 }, field: { gap: 7 }, input: { minHeight: 50, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 16 }, banner: { borderWidth: 1, borderRadius: 14, padding: 12 }
});
