import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  NavigationContainer,
  useFocusEffect,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';

import InicioScreen from './screens/InicioScreen';
import ProductosScreen from './screens/ProductosScreen';
import AltaProductoScreen from './screens/AltaProductoScreen';
import CuentaScreen from './screens/CuentaScreen';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';

import Boton from './components/Boton';

import {
  listarProductos,
  crearProducto,
} from './services/productos';

import {
  esAdministrador,
  cerrarSesion,
} from './services/auth';

const Stack = createNativeStackNavigator();

function Catalogo({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const solicitud = useRef(0);

  const cargar = useCallback(async () => {
    const numero = ++solicitud.current;

    setCargando(true);
    setError('');

    try {
      const datos = await listarProductos();

      if (numero === solicitud.current) {
        setProductos(datos);
      }
    } catch (fallo) {
      if (numero === solicitud.current) {
        setError(fallo.message);
      }
    } finally {
      if (numero === solicitud.current) {
        setCargando(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();

      return () => {
        solicitud.current += 1;
      };
    }, [cargar])
  );

  return (
    <ProductosScreen
      productos={productos}
      navigation={navigation}
      cargando={cargando}
      error={error}
      onRecargar={cargar}
    />
  );
}

function Alta({ navigation }) {
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      setVerificando(true);
      setAutorizado(false);
      setError('');

      esAdministrador()
        .then((valor) => {
          if (activo) {
            setAutorizado(valor);
          }
        })
        .catch((fallo) => {
          if (activo) {
            setError(fallo.message);
          }
        })
        .finally(() => {
          if (activo) {
            setVerificando(false);
          }
        });

      return () => {
        activo = false;
      };
    }, [intento])
  );

  async function guardar(datos) {
    await crearProducto(datos);
    navigation.navigate('Productos');
  }

  async function salir() {
    try {
      await cerrarSesion();
      setAutorizado(false);
      navigation.navigate('Cuenta');
    } catch (fallo) {
      Alert.alert(
        'No se pudo cerrar sesión',
        fallo.message
      );
    }
  }

  if (verificando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
        <Text>Verificando acceso…</Text>
      </View>
    );
  }

  if (error || !autorizado) {
    return (
      <View style={{ padding: 24 }}>
        <Text>
          {error ||
            'El alta de productos está reservada a administradores.'}
        </Text>

        {error && (
          <Boton
            onPress={() =>
              setIntento((valor) => valor + 1)
            }
          >
            Reintentar
          </Boton>
        )}

        <Boton
          onPress={() =>
            navigation.navigate('Cuenta')
          }
        >
          Ir a mi cuenta
        </Boton>
      </View>
    );
  }

  return (
    <AltaProductoScreen
      onGuardar={guardar}
      onSalir={salir}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />

      <Stack.Navigator
        id="Principal"
        initialRouteName="Inicio"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#0B1E32',
          },
          headerTintColor: '#FFFFFF',
          contentStyle: {
            backgroundColor: '#F3F6FA',
          },
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('Cuenta')
              }
            >
              <Text
                style={{
                  color: '#FFA756',
                  fontWeight: '800',
                  padding: 8,
                }}
              >
                Mi cuenta
              </Text>
            </Pressable>
          ),
        })}
      >
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{
            title: 'ELECTROFIXER',
          }}
        />

        <Stack.Screen
          name="Productos"
          component={Catalogo}
          options={{
            title: 'Productos',
          }}
        />

        <Stack.Screen
          name="AltaProducto"
          component={Alta}
          options={{
            title: 'Administración',
          }}
        />

        <Stack.Screen
          name="Cuenta"
          component={CuentaScreen}
          options={{
            title: 'Mi cuenta',
            headerRight: () => null,
          }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Iniciar sesión',
            headerRight: () => null,
          }}
        />

        <Stack.Screen
          name="Registro"
          component={RegistroScreen}
          options={{
            title: 'Crear cuenta',
            headerRight: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}