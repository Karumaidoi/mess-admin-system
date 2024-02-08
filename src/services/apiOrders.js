import { getToday } from '../utils/helpers';
import supabase, { supabaseUrl } from './supabase';

export async function createServing({ servingsName, description, noServings, price, image }) {
  const certName = `${Math.random()}-${image.name}`.replaceAll('/', '');
  const certPath = `${supabaseUrl}/storage/v1/object/public/images/${certName}`;

  const { data, error } = await supabase.from('Servings').insert({
    servingsName,
    serviceDescription: description,
    noServings,
    price,
    image: certPath,
  });

  const { error: storageError } = await supabase.storage.from('images').upload(certName, image, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error || storageError) {
    console.log(storageError.message);
    throw new Error(error?.message);
  }

  return data;
}

export async function getOrders() {
  const { data, error } = await supabase.from('Orders').select('*, servingId(*)').order('id', {
    ascending: false,
  });

  console.log(data);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('Orders').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

export async function createOrder(newOrder) {
  console.log(newOrder);
  const { data, error } = await supabase.from('Orders').insert(newOrder);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getOrdersByDate(date) {
  const { data, error } = await supabase
    .from('Orders')
    .select()
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateOrder(newOrder) {
  const orderUpdated = newOrder.newOrder;
  const { orderId } = newOrder;

  const { data, error } = await supabase.from('Orders').update(orderUpdated).eq('id', orderId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
