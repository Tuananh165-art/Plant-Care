import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Redirect } from 'expo-router';
import { AppButton, Body, Field, Screen, Title } from '@/src/components/ui';
import { AnimatedEntrance } from '@/src/components/motion';
import { getTheme } from '@/src/lib/tokens';
import { useAppStore } from '@/src/store/appStore';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';

export default function LoginScreen() {
  const [email, setEmail] = useState('student@example.com'); const [error, setError] = useState<string | null>(null); const t = getTheme(useColorScheme()); const layout = useResponsiveLayout();
  const session = useAppStore((state) => state.session); const restoring = useAppStore((state) => state.restoringSession); const signIn = useAppStore((state) => state.signIn);
  if (restoring) return <Screen><Body>Đang khôi phục phiên làm vườn...</Body></Screen>;
  if (session) return <Redirect href="/" />;
  const submit = async () => { if (!email.includes('@')) { setError('Hãy nhập email hợp lệ.'); return; } setError(null); await signIn(email); };
  return <Screen padded={false}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingHorizontal: layout.horizontalPadding, paddingVertical: layout.verticalPadding, justifyContent: layout.compact ? 'flex-start' : 'center' }]}><AnimatedEntrance><View style={[styles.brand, { padding: layout.compact ? 16 : 22, backgroundColor: t.primary, shadowColor: t.shadow }]}><Text style={[styles.emoji, { fontSize: layout.compact ? 38 : 46 }]}>🌿</Text><View style={{ flex: 1, minWidth: 0 }}><Text style={[styles.brandEyebrow, { color: t.primaryText }]}>PLANT CARE REMINDER</Text><Text adjustsFontSizeToFit numberOfLines={2} style={[styles.brandTitle, { color: t.primaryText }]}>{'Chăm cây\nnhẹ nhàng hơn'}</Text></View></View></AnimatedEntrance><AnimatedEntrance delay={100}><View style={styles.form}><Title>Chào bạn</Title><Body>Đăng nhập để xem lịch tưới và chăm sóc khu vườn của riêng bạn.</Body><Field label="Email" value={email} onChangeText={setEmail} placeholder="ban@example.com" keyboardType="email-address" />{error ? <View accessibilityRole="alert" style={[styles.error, { backgroundColor: t.dangerSoft }]}><Text style={{ color: t.danger }}>{error}</Text></View> : null}<AppButton label="Vào khu vườn của tôi" onPress={() => void submit()} /><Text style={[styles.note, { color: t.muted }]}>Phiên đăng nhập được lưu an toàn trên thiết bị này.</Text></View></AnimatedEntrance></ScrollView></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { flexGrow: 1, gap: 22 }, brand: { borderRadius: 28, flexDirection: 'row', alignItems: 'center', gap: 14, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 4 }, emoji: {}, brandEyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1 }, brandTitle: { fontSize: 28, fontWeight: '900', lineHeight: 32, letterSpacing: -0.6 }, form: { gap: 15 }, error: { borderRadius: 14, padding: 12 }, note: { textAlign: 'center', fontSize: 13 } });
