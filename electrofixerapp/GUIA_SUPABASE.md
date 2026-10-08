# Electrofixer: conectar Supabase paso a paso

Esta versión parte del frontend inicial con App.js, screens, components y services. Ya contiene el código de lectura, alta y acceso de administrador. Falta crear tu proyecto de Supabase y configurar sus datos. No contiene claves ni una conexión real preconfigurada.

## 1. Abrir esta versión del proyecto

Extraé el ZIP en una carpeta nueva y abrí `electrofixer` con VS Code. Conservá la versión anterior por si querés comparar. Si hiciste modificaciones propias, compará los archivos antes de sustituirlos. En Terminal > Nueva terminal:

```powershell
npm.cmd install
```

Las dependencias nuevas ya están en package.json. Si incorporás los cambios manualmente a tu proyecto anterior, instalalas allí con:

```powershell
npx.cmd expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

## 2. Crear el proyecto

Entrá a https://supabase.com/dashboard, iniciá sesión y creá un proyecto nuevo llamado Electrofixer. Seleccioná tu organización, elegí una contraseña fuerte para la base de datos y una región cercana. Esperá a que termine la creación.

La contraseña de la base de datos es distinta de la contraseña del usuario administrador de la app. No se coloca en el código de React Native.

## 3. Crear las tablas y los permisos

En el Dashboard, abrí SQL Editor, creá una consulta, pegá el contenido completo de `supabase/01_productos.sql` y ejecutalo una sola vez en el proyecto nuevo. Se crea todo dentro de una transacción: productos, administradores, reglas de seguridad y tres productos de ejemplo.

Campos de productos:

| Campo | Tipo | Finalidad |
|---|---|---|
| id | uuid | Identificador generado por la base de datos |
| nombre | text | Nombre del producto |
| categoria | text | Tipo de producto o repuesto |
| precio | numeric(12,2) | Precio mayor a cero |
| stock | integer | Cantidad entera no negativa |
| created_at | timestamptz | Fecha de creación automática |

Abrí Table Editor y revisá `productos`: deben aparecer los tres ejemplos.

RLS significa Row Level Security: permisos sobre las filas de una tabla. La política catalogo_publico permite leer el catálogo sin login. alta_solo_administradores permite insertar únicamente a usuarios autenticados que estén en administradores. La app puede consultar su propio rol, pero no modificarlo. Editar y eliminar productos todavía no está habilitado.

No desactives RLS para solucionar errores de permisos; verificá que el usuario esté en administradores.

## 4. Crear tu usuario administrador

En Authentication > Users, agregá un usuario mediante la opción de crear usuario. Elegí un correo y una contraseña; confirmá el correo desde el Dashboard si la opción está disponible, o completá la confirmación por email. Copiá el identificador UUID de ese usuario.

En SQL Editor ejecutá esta consulta, reemplazando TODO el texto de ejemplo por ese UUID:

```sql
insert into public.administradores (user_id)
values ('PEGAR_AQUI_EL_UUID_DEL_USUARIO')
on conflict (user_id) do nothing;
```

También podés insertar el UUID desde Table Editor > administradores. Esta operación se hace desde el Dashboard, con permisos de gestión del proyecto. Un usuario nuevo no se convierte automáticamente en administrador.

No uses la contraseña de PostgreSQL para entrar a la app: usá el correo y la contraseña de este usuario de Authentication.

## 5. Configurar la URL y la clave pública

En el diálogo Connect del proyecto obtené Project URL y Publishable key. La clave pública actual comienza con `sb_publishable_`; también podés encontrar las claves en la configuración del proyecto. Para proyectos con claves antiguas, la clave anon cumple la función de clave pública.

En VS Code, junto a App.js y package.json, copiá `.env.example` a `.env`. Reemplazá sus dos valores:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE_PUBLICA
```

Este archivo contiene la URL y la clave pública del proyecto, no el correo o contraseña del administrador. EXPO_PUBLIC significa que Expo incluye el valor en la app: la seguridad la aplican las políticas RLS. Nunca coloques una clave secret, service_role o la contraseña de PostgreSQL en estas variables.

## 6. Iniciar y probar

Desde la carpeta que contiene package.json:

```powershell
npm.cmd install --save-dev "@expo/ngrok@^4.1.0"
npx.cmd expo start --tunnel --clear
```

La instalación de ngrok se hace una sola vez en esta nueva carpeta. En los próximos inicios alcanza con el segundo comando. Si Metro ya está abierto, detenelo con Ctrl+C antes de reiniciarlo. Escaneá el QR con Expo Go.

Prueba completa:

1. Abrí el catálogo sin iniciar sesión: deben aparecer los productos de Supabase.
2. Tocá Agregar producto: aparecerá el acceso de administrador.
3. Ingresá con el usuario que creaste y asignaste a administradores.
4. Completá y guardá un producto. La app espera el resultado antes de volver al catálogo.
5. Revisá Table Editor > productos: debe estar el registro nuevo.
6. Reiniciá la app y volvé a consultar: el registro debe seguir allí.
7. Para cambiar de usuario, entrá al formulario y tocá Cerrar sesión.

Necesitás conexión a internet. Esta versión no incluye sincronización ni alta sin conexión. La sesión se conserva localmente, pero los productos se guardan en Supabase.

## 7. Cómo se estructura el código

| Archivo | Responsabilidad |
|---|---|
| .env | Configuración de tu proyecto remoto |
| services/supabase.js | Crea y exporta una única conexión con el cliente de Supabase |
| services/productos.js | Consulta e inserta productos |
| services/auth.js | Inicia/cierra sesión y consulta el rol administrador |
| App.js | Define rutas, carga datos al entrar al catálogo y conecta el formulario con el servicio |
| screens/InicioScreen.js | Presentación y accesos de la app |
| screens/ProductosScreen.js | Muestra lista, carga, errores, reintento y actualización al deslizar |
| screens/AltaProductoScreen.js | Formulario, validación y estado Guardando |
| screens/LoginScreen.js | Correo y contraseña del administrador |
| components/ProductoCard.js | Presentación de un producto |
| components/Boton.js | Botón reutilizable, incluyendo estado deshabilitado |
| supabase/01_productos.sql | Estructura de tablas, restricciones y políticas de seguridad |

### Lectura del catálogo

Al entrar a Productos, useFocusEffect en App.js ejecuta cargar. cargar usa await listarProductos(). Esa función hace SELECT sobre productos. Supabase verifica la política de lectura y responde con data o error. App.js guarda data en el estado y ProductosScreen la muestra con FlatList. Para consultar cambios hechos por otro dispositivo, deslizá la lista hacia abajo. No se habilitó actualización en tiempo real en esta etapa.

### Alta de un producto

AltaProductoScreen valida los campos y convierte precio y stock a números. Después ejecuta await onGuardar(datos). Esa función se define en App.js y llama a await crearProducto(datos). El servicio envía un INSERT. Supabase comprueba la sesión, el rol y las restricciones de la tabla. Si todo sale bien, App.js vuelve a Productos y el catálogo se consulta nuevamente. Si falla, el formulario muestra el error y conserva los datos para reintentar.

### async, await, data y error

async indica que la función devuelve una promesa, porque una operación de red tarda. await espera el resultado dentro de esa función sin bloquear toda la interfaz. Supabase devuelve data para el resultado y error para un fallo. `if (error) throw error` transmite el fallo al controlador que usa try/catch; así la app no anuncia un guardado que falló.

### La conexión no es el servidor

createClient crea un cliente JavaScript para hablar con la API de Supabase por HTTPS. El servidor y PostgreSQL están en Supabase. Para estas funciones no hace falta un servidor FastAPI propio ni Python ni un entorno virtual. node_modules contiene las dependencias de este proyecto.

## 8. Problemas frecuentes

| Mensaje / síntoma | Revisar |
|---|---|
| Falta configurar .env | Ubicación y nombres exactos de las variables; reiniciar Expo |
| Invalid API key | Usar la clave pública del mismo proyecto que la URL |
| Invalid login credentials | Correo, contraseña y confirmación del usuario de Authentication |
| Cuenta sin permiso de administrador | UUID en public.administradores |
| Error de RLS o permiso denegado | Sesión iniciada, UUID correcto y SQL de políticas ejecutado |
| No existe productos o administradores | Ejecutar el script SQL en el proyecto indicado en .env |
| Network request failed | Conexión del celular, URL correcta y proyecto disponible |
| Catálogo vacío | Table Editor > productos; datos y política de lectura |
| Nuevos datos no aparecen desde otro dispositivo | Deslizar el catálogo hacia abajo para recargar |

## Referencias oficiales

- https://supabase.com/docs/guides/auth/quickstarts/react-native
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://docs.expo.dev/guides/environment-variables/

## Validación de esta entrega

Pasaron el análisis estático, la comprobación de tipos de JavaScript y la exportación de Android. El SQL se probó con un motor PostgreSQL local (PGlite): lectura pública, inserción denegada a visitantes y usuarios comunes, inserción permitida a administrador y validaciones de precio y stock. La prueba de lectura y alta real se completa después de que configures tu proyecto, las tablas, el usuario y .env. Esta entrega no está conectada a una cuenta de Supabase.
