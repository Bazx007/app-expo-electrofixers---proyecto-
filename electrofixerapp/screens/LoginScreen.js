import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
} from 'react-native';
import Boton from '../components/Boton';
import { iniciarSesion } from '../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  async function ingresar() {
    if (cargando) return;
    if (!email.trim() || !password) {
      Alert.alert('Completá tus datos', 'Ingresá correo y contraseña.');
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      setPassword('');
      navigation.navigate('Cuenta');
    } catch (error) {
      Alert.alert('No se pudo ingresar', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Iniciar sesión</Text>
        <Text style={styles.nota}>Ingresá a tu cuenta de Electrofixer.</Text>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input} value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none"
          autoCorrect={false} autoComplete="email" editable={!cargando}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input} value={password} onChangeText={setPassword}
          secureTextEntry autoCapitalize="none"
          autoComplete="current-password" editable={!cargando}
        />
        <Boton onPress={ingresar} disabled={cargando}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </Boton>
        <Boton secundario disabled={cargando} onPress={() => navigation.navigate('Registro')}>
          Crear una cuenta
        </Boton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 24 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#0B1E32' },
  nota: { color: '#52657A', lineHeight: 22, marginVertical: 16 },
  label: { fontWeight: '700', color: '#0B1E32', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#D5DFE9', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#FFFFFF' },
});
