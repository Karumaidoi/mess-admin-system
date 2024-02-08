import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createOrder } from '../services/apiOrders';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  const {
    mutate: creteOrderReq,
    error,
    isLoading,
  } = useMutation({
    mutationFn: (data) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
      toast.success(`Order created`);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return { creteOrderReq, isLoading, error };
}
