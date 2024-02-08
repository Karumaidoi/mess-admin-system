/* eslint-disable object-shorthand */
import { getToday } from '../utils/helpers';
import supabase from './supabase';

export async function signUp({ email, password }) {
  console.log(email);
  console.log(password);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error('Something went wrong');
  }

  try {
    await addUsers(email);
  } catch (error) {
    throw new Error(error);
  }

  return data;
}

export async function logIn({ email, password }) {
  // 1. Check if the user is an Admin
  const users = await getUsers();

  const currentUser = users.find((user) => user?.email === email);

  console.log(currentUser);

  const isAdmin = currentUser?.isAdmin;

  if (!isAdmin || isAdmin === undefined) {
    throw new Error('User Undefined');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  return data?.user;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function addUsers(email) {
  const { data, error } = await supabase.from('Users').insert({
    email,
    isAdmin: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUsers() {
  const { data, error } = await supabase.from('Users').select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUsersByDate(date) {
  const { data, error } = await supabase
    .from('Users')
    .select()
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteUser(id) {
  const { data, error } = await supabase.from('Users').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
