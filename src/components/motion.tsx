import { PropsWithChildren, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

export function AnimatedEntrance({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const [value] = useState(() => new Animated.Value(0));
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) { value.setValue(1); return; }
    Animated.timing(value, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start();
  }, [delay, reduceMotion, value]);
  return <Animated.View style={{ opacity: value, transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }}>{children}</Animated.View>;
}
