import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Boton from '../components/Boton';
import { cerrarSesion, esAdministrador, obtenerUsuario } from '../services/auth';

export default function CuentaScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [saliendo, setSaliendo] = useState(false);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useFocusEffect(useCallback(() => {
    let activo = true;
    setCargando(true);
    setError('');
    async function cargar() {
      try {
        const actual = await obtenerUsuario();
        if (!activo) return;
        setUsuario(actual);
        setEsAdmin(false);
        if (actual) {
          const admin = await esAdministrador();
          if (activo) setEsAdmin(admin);
        }
      } catch (fallo) {
        if (activo) setError(fallo.message);
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => { activo = false; };
  }, [intento]));

  async function salir() {
    if (saliendo) return;
    setSaliendo(true);
    try {
      await cerrarSesion();
      setUsuario(null);
      setEsAdmin(false);
    } catch (fallo) {
      Alert.alert('No se pudo cerrar sesión', fallo.message);
    } finally {
      setSaliendo(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Mi cuenta</Text>
      {cargando ? <ActivityIndicator /> : error ? (
        <>
          <Text style={styles.error}>{error}</Text>
          <Boton onPress={() => setIntento((valor) => valor + 1)}>Reintentar</Boton>
        </>
      ) : usuario ? (
        <>
          <Text style={styles.label}>Correo</Text>
          <Text selectable style={styles.texto}>{usuario.email}</Text>
          <Text style={styles.label}>Tu identificador único (UUID)</Text>
          <Text selectable style={styles.texto}>{usuario.id}</Text>
          <Text style={styles.label}>Tipo de cuenta</Text>
          <Text style={styles.texto}>{esAdmin ? 'Administrador' : 'Cliente'}</Text>
          {esAdmin && (
            <Boton disabled={saliendo} onPress={() => navigation.navigate('AltaProducto')}>
              Agregar producto
            </Boton>
          )}
          <Boton secundario onPress={salir} disabled={saliendo}>
            {saliendo ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Boton>
        </>
      ) : (
        <>
          <Text style={styles.texto}>Ingresá o registrate para tener tu propia cuenta.</Text>
          <Boton onPress={() => navigation.navigate('Login')}>Iniciar sesión</Boton>
          <Boton secundario onPress={() => navigation.navigate('Registro')}>Crear cuenta</Boton>
        </>
      )}
      <Boton secundario disabled={saliendo} onPress={() => navigation.navigate('Productos')}>
        Ver catálogo
      </Boton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 24 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#0B1E32', marginBottom: 20 },
  label: { fontWeight: '800', color: '#0B1E32', marginTop: 18, marginBottom: 6 },
  texto: { fontSize: 16, color: '#52657A', lineHeight: 24 },
  error: { color: '#A73524', lineHeight: 22 },
});
