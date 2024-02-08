/* eslint-disable no-var */
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Container, Stack, TextField, Typography } from '@mui/material';
import { Modal, Input, Select, Spin } from 'antd';

import { useUsers } from '../hooks/useUsers';
import { useSettings } from '../hooks/useSettings';

import { ProductSort, ProductFilterSidebar } from '../sections/@dashboard/products';
import OrdersTable from '../layouts/orders/OrdersTable';
import { useCreateOrder } from '../hooks/useCreateOrder';

export default function ProductsPage() {
  const { data: usersData, isLoading: loadingUsers } = useUsers();
  const { data: settingsData, isLoading: settingsLoading } = useSettings();
  const { creteOrderReq, isLoading } = useCreateOrder();
  const { TextArea } = Input;
  const [openFilter, setOpenFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [size, setSize] = useState(1);
  const [category, setCategory] = useState('Washing');
  const [owner, setOwner] = useState(usersData?.at(0).id ?? 0);
  const [description, setDescription] = useState('');

  const users = usersData?.filter((user) => user?.isAdmin === false);

  const isDiscounted = size >= 10;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleCategory = (value) => {
    setCategory(value);
  };

  const handleOwner = (value) => {
    setOwner(value);
  };

  let amount = 0;
  const discount = 100;
  amount = isDiscounted ? Math.floor(amount - discount) : amount;

  const handleOk = async () => {
    if (category === '' || description === '') return;
    const orderNumber = uuidv4();
    creteOrderReq(
      {
        orderNumber: orderNumber.substring(0, 5),
        size,
        amount,
        category,
        userId: Number(owner.split(' ')[0]),
        userEmail: owner.split(' ')[1],
        description,
        status: 'received',
      },
      {
        onSettled: () => {
          setIsModalOpen(false);
          setSize(1);
          setOwner(usersData?.at(0).id ?? 0);
          setCategory('Washing');
          setDescription('');
        },
      }
    );
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loadingUsers || settingsLoading)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin />
      </div>
    );

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | MESS PAY - KE </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Orders
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductSort />
          </Stack>
        </Stack>
        <OrdersTable />
      </Container>
    </>
  );
}
