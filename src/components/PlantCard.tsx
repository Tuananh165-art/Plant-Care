import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Plant } from '@/src/types';
import { formatDate, isOverdue, nextDueDate } from '@/src/lib/dates';
import { getTheme } from '@/src/lib/tokens';
import { AnimatedEntrance } from './motion';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';

export function PlantCard({ plant, index, onPress }: { plant: Plant; index: number; onPress: () => void }) {
  const t = getTheme(useColorScheme()); const layout = useResponsiveLayout(); const due = nextDueDate(plant); const overdue = isOverdue(plant);
  const status = overdue ? 'Cần tưới' : 'Đang ổn'; const statusColor = overdue ? t.danger : t.success; const statusBackground = overdue ? t.dangerSoft : t.primarySoft;
  return <AnimatedEntrance delay={160 + index * 65}><Pressable accessibilityRole="button" accessibilityLabel={`Mở chi tiết cây ${plant.name}, ${status}`} onPress={onPress} style={({ pressed }) => [styles.card, { minHeight: layout.compact ? 96 : 104, padding: layout.compact ? 12 : 14, backgroundColor: t.surface, borderColor: t.border, opacity: pressed ? 0.82 : 1, shadowColor: t.shadow }]}><View style={[styles.emoji, { width: layout.compact ? 48 : 56, height: layout.compact ? 48 : 56, borderRadius: layout.compact ? 16 : 18, backgroundColor: t.accent }]}><Text style={[styles.emojiText, { fontSize: layout.compact ? 25 : 29 }]}>🪴</Text></View><View style={[styles.copy, { paddingRight: 76 }]}><Text numberOfLines={1} adjustsFontSizeToFit style={[styles.name, { color: t.text }]}>{plant.name}</Text><Text numberOfLines={1} style={[styles.species, { color: t.muted }]}>{plant.species}</Text><Text style={[styles.due, { color: t.muted }]} numberOfLines={layout.isNarrow ? 2 : 1}>Hạn tưới: {formatDate(due)}</Text></View><View style={[styles.status, { backgroundColor: statusBackground }]}><View style={[styles.dot, { backgroundColor: statusColor }]} /><Text style={[styles.statusText, { color: statusColor }]}>{status}</Text></View></Pressable></AnimatedEntrance>;
}

const styles = StyleSheet.create({
  card: { marginBottom: 10, borderWidth: 1, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 10, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 2 }, emoji: { alignItems: 'center', justifyContent: 'center' }, emojiText: {}, copy: { flex: 1, minWidth: 0, gap: 2 }, name: { fontSize: 18, fontWeight: '900' }, species: { fontSize: 13 }, due: { fontSize: 12, marginTop: 3, fontWeight: '600', lineHeight: 17 }, status: { position: 'absolute', top: 11, right: 11, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 6 }, dot: { width: 7, height: 7, borderRadius: 4 }, statusText: { fontSize: 11, fontWeight: '900' }
});
