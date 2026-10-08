import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Boton from '../components/Boton';

export default function InicioScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.contenido}>
      <View style={styles.hero}>
        <Text style={styles.etiqueta}>
          VENTA Y REPARACIÓN
        </Text>

        <Text style={styles.titulo}>
          Tu tecnología, en buenas manos.
        </Text>

        <Text style={styles.descripcion}>
          Explorá aparatos y repuestos de Electrofixer.
        </Text>

        <Boton
          onPress={() => navigation.navigate('Productos')}
        >
          Ver productos
        </Boton>
      </View>

      <Text style={styles.subtitulo}>¿Qué hacemos?</Text>

      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>
          Venta de productos
        </Text>

        <Text style={styles.bloqueTexto}>
          Electrodomésticos, electrónica y repuestos
          en un solo lugar.
        </Text>
      </View>

      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>
          Servicio técnico
        </Text>

        <Text style={styles.bloqueTexto}>
          Próximamente podrás gestionar tus reparaciones
          desde la app.
        </Text>
      </View>

      <Boton
        secundario
        onPress={() => navigation.navigate('Cuenta')}
      >
        Mi cuenta
      </Boton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenido: {
    padding: 20,
    paddingBottom: 42,
  },
  hero: {
    backgroundColor: '#0B1E32',
    borderRadius: 24,
    padding: 26,
    marginTop: 12,
  },
  etiqueta: {
    color: '#FFA756',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '900',
    marginTop: 16,
    lineHeight: 42,
  },
  descripcion: {
    color: '#D1DCE8',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    marginBottom: 10,
  },
  subtitulo: {
    color: '#0B1E32',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 14,
  },
  bloque: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  bloqueTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B1E32',
  },
  bloqueTexto: {
    color: '#52657A',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },
});