import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createServing } from 'src/services/apiOrders';

export function useCreateServing() {
  const {
    mutate: createNewServing,
    error,
    isLoading,
  } = useMutation({
    mutationFn: createServing,
    onSuccess: () => {
      toast.success('Serving Created successfuully');
    },
    onError: () => {
      toast.error('Something went wromg');
    },
  });

  return { createNewServing, isLoading, error };
}
