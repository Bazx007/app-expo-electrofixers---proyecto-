import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import Boton from '../components/Boton';
import { registrarUsuario } from '../services/auth';

export default function RegistroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [cargando, setCargando] = useState(false);

  async function registrar() {
    if (cargando) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert(
        'Revisá el correo',
        'Ingresá una dirección de correo válida.'
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Revisá la contraseña',
        'Usá al menos 8 caracteres.'
      );
      return;
    }

    if (password !== repetir) {
      Alert.alert(
        'Revisá la contraseña',
        'Las contraseñas no coinciden.'
      );
      return;
    }

    setCargando(true);

    try {
      const data = await registrarUsuario(email, password);

      setPassword('');
      setRepetir('');

      if (data.session) {
        navigation.navigate('Cuenta');
      } else {
        Alert.alert(
          'Revisá tu correo',
          'Si el registro corresponde, recibirás un correo de confirmación. Confirmalo antes de iniciar sesión. Si ya tenés una cuenta, usá Iniciar sesión.'
        );

        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('No se pudo registrar', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Crear cuenta</Text>

        <Text style={styles.nota}>
          Registrate como cliente de Electrofixer.
        </Text>

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!cargando}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          editable={!cargando}
        />

        <Text style={styles.label}>Repetir contraseña</Text>
        <TextInput
          style={styles.input}
          value={repetir}
          onChangeText={setRepetir}
          secureTextEntry
          autoCapitalize="none"
          editable={!cargando}
        />

        <Boton onPress={registrar} disabled={cargando}>
          {cargando ? 'Registrando…' : 'Registrarme'}
        </Boton>

        <Boton
          secundario
          disabled={cargando}
          onPress={() => navigation.navigate('Login')}
        >
          Ya tengo una cuenta
        </Boton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenido: {
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B1E32',
  },
  nota: {
    color: '#52657A',
    lineHeight: 22,
    marginVertical: 16,
  },
  label: {
    fontWeight: '700',
    color: '#0B1E32',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5DFE9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});