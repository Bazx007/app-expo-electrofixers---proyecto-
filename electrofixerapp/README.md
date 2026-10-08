# Electrofixer Mobile + Supabase

Frontend de venta y reparación con Expo y React Native. Incluye catálogo público, alta de productos con acceso administrador y persistencia remota preparada mediante Supabase.

Empezá por **GUIA_SUPABASE.md**: explica cómo crear el proyecto, ejecutar el SQL, crear tu administrador y configurar .env. El proyecto todavía requiere esos datos para conectarse a tu cuenta.

```powershell
npm.cmd install
npm.cmd install --save-dev "@expo/ngrok@^4.1.0"
npx.cmd expo start --tunnel --clear
```

Para comprobar el código: `npm.cmd run lint` y `npm.cmd run typecheck`.

La funcionalidad de reparaciones sigue siendo informativa. No incluye pagos, solicitudes de reparación ni edición/eliminación de productos en esta etapa.
