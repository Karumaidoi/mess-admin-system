/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from 'react';
import supabase from '../services/supabase';

const UserContext = createContext();

const initialState = {
  user: {},
  isLoading: false,
  error: '',
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'user/current':
      return { ...state, user: action.payload, isLoading: false, isAuthenticated: true };
    case 'error':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Something went wrong');
  }
}

function AppProvider({ children }) {
  const [{ user, isLoading }, dispatch] = useReducer(reducer, initialState);

  async function getUser() {
    dispatch({ type: 'loading' });

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return null;

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }

      console.log(data?.user);

      dispatch({ type: 'user/current', payload: data?.user });

      return data?.user;
    } catch (error) {
      dispatch({ type: 'error', payload: 'Something went wrong' });
      return error;
    }
  }

  return <UserContext.Provider value={{ user, isLoading, getUser, dispatch }}>{children}</UserContext.Provider>;
}

function useAppState() {
  const context = useContext(UserContext);
  console.log(context);

  if (context === undefined) throw new Error('Context used in a wrong Provider');
  return context;
}

export { AppProvider, useAppState };
