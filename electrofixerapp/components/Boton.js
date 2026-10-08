import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function Boton({ children, onPress, secundario = false, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, secundario && styles.secundario, (pressed || disabled) && styles.pressed]}>
      <Text style={[styles.texto, secundario && styles.textoSecundario]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#F47B20', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 14 },
  secundario: { backgroundColor: '#E8EEF5' },
  pressed: { opacity: 0.72 },
  texto: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  textoSecundario: { color: '#0B1E32' },
});
