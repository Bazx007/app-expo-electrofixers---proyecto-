import { obtenerSupabase } from './supabase';

export async function listarProductos() {
  const { data, error } = await obtenerSupabase()
    .from('productos')
    .select('id, nombre, categoria, precio, stock')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function crearProducto({
  nombre,
  categoria,
  precio,
  stock,
}) {
  const { data, error } = await obtenerSupabase()
    .from('productos')
    .insert({
      nombre,
      categoria,
      precio,
      stock,
    })
    .select('id, nombre, categoria, precio, stock')
    .single();

  if (error) throw error;

  return data;
}