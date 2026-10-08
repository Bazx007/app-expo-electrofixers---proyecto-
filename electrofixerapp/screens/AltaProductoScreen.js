import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Boton from '../components/Boton';

export default function AltaProductoScreen({
  onGuardar,
  onSalir,
}) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (guardando) return;

    const precioNumero = Number(precio.replace(',', '.'));
    const stockNumero = Number(stock);

    if (
      !nombre.trim() ||
      !categoria.trim() ||
      !precio.trim() ||
      !stock.trim() ||
      !Number.isFinite(precioNumero) ||
      precioNumero <= 0 ||
      !Number.isInteger(stockNumero) ||
      stockNumero < 0
    ) {
      Alert.alert(
        'Revisá los datos',
        'Completá nombre y categoría. El precio debe ser mayor a cero y el stock un entero no negativo.'
      );
      return;
    }

    setGuardando(true);

    try {
      await onGuardar({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: precioNumero,
        stock: stockNumero,
      });

      setNombre('');
      setCategoria('');
      setPrecio('');
      setStock('');
    } catch (error) {
      Alert.alert(
        'No se pudo guardar',
        error.message ||
          'Revisá tu conexión e intentá nuevamente.'
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Nuevo producto</Text>

        <Text style={styles.descripcion}>
          Cargá los datos para sumarlo al catálogo.
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Heladera Samsung"
            editable={!guardando}
          />

          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Ej. Electrodomésticos"
            editable={!guardando}
          />

          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder="Ej. 450000"
            keyboardType="decimal-pad"
            editable={!guardando}
          />

          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="Ej. 3"
            keyboardType="number-pad"
            editable={!guardando}
          />

          <Boton
            onPress={guardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando…' : 'Guardar producto'}
          </Boton>

          <Boton
            secundario
            onPress={onSalir}
            disabled={guardando}
          >
            Cerrar sesión
          </Boton>
        </View>

        <Text style={styles.nota}>
          Al guardar, el producto se envía a Supabase
          y queda disponible en el catálogo.
          Necesitás conexión a internet.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contenido: {
    padding: 20,
    paddingBottom: 42,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0B1E32',
  },
  descripcion: {
    color: '#52657A',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 24,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    color: '#0B1E32',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5DFE9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#0B1E32',
  },
  nota: {
    color: '#607388',
    lineHeight: 20,
    marginTop: 20,
    fontSize: 13,
  },
});
