import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from './Boton';

export default function ProductoCard({
  producto,
  onAgregarAlCarrito,
}) {
  const sinStock = producto.stock <= 0;

  return (
    <View style={styles.card}>
      <Text style={styles.categoria}>
        {producto.categoria.toUpperCase()}
      </Text>

      <Text style={styles.nombre}>
        {producto.nombre}
      </Text>

      <View style={styles.fila}>
        <Text style={styles.precio}>
          $ {Number(producto.precio).toLocaleString('es-AR')}
        </Text>

        <Text style={styles.stock}>
          Stock: {producto.stock}
        </Text>
      </View>

      {/* El botón va dentro de la tarjeta, después del precio. */}
      <Boton
        disabled={sinStock}
        onPress={() => onAgregarAlCarrito(producto)}
      >
        {sinStock ? 'Sin stock' : 'Agregar al carrito'}
      </Boton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E9F1',
  },
  categoria: {
    color: '#D36514',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  nombre: {
    color: '#0B1E32',
    fontSize: 19,
    fontWeight: '800',
    marginVertical: 10,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    color: '#0B1E32',
    fontSize: 18,
    fontWeight: '700',
  },
  stock: {
    color: '#52657A',
    fontSize: 13,
  },
});