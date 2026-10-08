import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Boton from '../components/Boton';
import ProductoCard from '../components/ProductoCard';

export default function ProductosScreen({
  navigation,
  productos,
  cargando,
  error,
  onRecargar,
}) {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto) {
    const existente = carrito.find(
      (item) => item.id === producto.id
    );

    const cantidadActual = existente?.cantidad ?? 0;

    if (cantidadActual >= producto.stock) {
      Alert.alert(
        'Stock disponible',
        'Ya agregaste todas las unidades disponibles de este producto.'
      );
      return;
    }

    setCarrito((actual) => {
      const yaExiste = actual.some(
        (item) => item.id === producto.id
      );

      if (yaExiste) {
        return actual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...actual,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  }

  const cantidadTotal = carrito.reduce(
    (acumulado, item) => acumulado + item.cantidad,
    0
  );

  const precioTotal = carrito.reduce(
    (acumulado, item) =>
      acumulado + Number(item.precio) * item.cantidad,
    0
  );

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        refreshing={cargando}
        onRefresh={onRecargar}
        contentContainerStyle={styles.lista}

        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Catálogo</Text>

            <Text style={styles.descripcion}>
              Productos y repuestos disponibles
            </Text>

            <Boton
              onPress={() =>
                navigation.navigate('AltaProducto')
              }
            >
              + Agregar producto
            </Boton>

            <View style={styles.carrito}>
              <Text style={styles.subtitulo}>
                Mi carrito · {cantidadTotal} unidades
              </Text>

              {carrito.length === 0 ? (
                <Text style={styles.descripcion}>
                  Todavía no agregaste productos.
                </Text>
              ) : (
                <View>
                  {carrito.map((item) => (
                    <Text
                      key={item.id}
                      style={styles.itemCarrito}
                    >
                      {item.nombre} × {item.cantidad}
                    </Text>
                  ))}

                  <Text style={styles.total}>
                    Total: ${' '}
                    {precioTotal.toLocaleString('es-AR')}
                  </Text>

                  <Boton
                    secundario
                    onPress={() => setCarrito([])}
                  >
                    Vaciar carrito
                  </Boton>
                </View>
              )}
            </View>

            <View style={styles.espacio} />
          </View>
        }

        renderItem={({ item }) => (
          <ProductoCard
            producto={item}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        )}

        ListEmptyComponent={
          cargando ? (
            <ActivityIndicator />
          ) : !error ? (
            <Text>Aún no hay productos.</Text>
          ) : null
        }

        ListFooterComponent={
          error ? (
            <View>
              <Text style={styles.error}>{error}</Text>

              <Boton
                secundario
                onPress={onRecargar}
                disabled={cargando}
              >
                Reintentar
              </Boton>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
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
  },
  espacio: {
    height: 24,
  },
  carrito: {
    backgroundColor: '#E8EEF5',
    padding: 18,
    borderRadius: 18,
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B1E32',
  },
  itemCarrito: {
    color: '#52657A',
    marginTop: 10,
  },
  total: {
    color: '#0B1E32',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  error: {
    color: '#A73524',
    lineHeight: 22,
  },
});