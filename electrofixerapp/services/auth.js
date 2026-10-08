import { obtenerSupabase } from './supabase';

export async function registrarUsuario(email, password) {
  const { data, error } = await obtenerSupabase().auth.signUp({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

// Clientes y administradores pueden ingresar.
export async function iniciarSesion(email, password) {
  const { data, error } = await obtenerSupabase().auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function obtenerUsuario() {
  const cliente = obtenerSupabase();
  const { data: sesion, error: errorSesion } = await cliente.auth.getSession();
  if (errorSesion) throw errorSesion;
  if (!sesion.session) return null;
  const { data, error } = await cliente.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Esta comprobación se usa para las funciones administrativas.
export async function esAdministrador() {
  const usuario = await obtenerUsuario();
  if (!usuario) return false;
  const { data, error } = await obtenerSupabase()
    .from('administradores')
    .select('user_id')
    .eq('user_id', usuario.id)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function cerrarSesion() {
  const { error } = await obtenerSupabase().auth.signOut();
  if (error) throw error;
}
