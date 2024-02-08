import { useState } from 'react';
import toast from 'react-hot-toast';
/* eslint-disable import/no-unresolved */
import { Button, Spin, Table, Tag, Modal, Select } from 'antd';
import { TextField } from '@mui/material';
import { useDelete } from './useDelete';
import { useOrders } from './useOrders';
import { capitalizeString } from '../../utils/formatString';
import { dollarUSLocale } from '../../utils/formatMoney';
import { useSettings } from '../../hooks/useSettings';
import { useEditOrder } from '../../hooks/useEditOrder';
import { usePayment } from '../../hooks/usePayment';

function OrdersTable() {
  // const { data: settingsData, isLoading: settingsLoading } = useSettings();
  const { editingOrder, isLoading: editingError, error } = useEditOrder();
  const { makingPayment, isLoading: isMakingPaymnet } = usePayment();
  const [size, setSize] = useState(0);
  const [category, setctaegory] = useState('');
  const { data: deleteOrder } = useDelete();
  const [editOrder, setEditOrder] = useState(null);
  const { orders, isLoading } = useOrders();

  const newEditOrder = editOrder;

  const isDiscounted = size >= 10;
  const orderId = newEditOrder?.id;
  const amount = 0;
  const discount = amount / 100;

  // Columns Data
  const columnsData = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img style={{ height: '2rem', width: '2rem', borderRadius: '4px' }} src={image} alt="image" />,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },

    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Servings',
      dataIndex: 'servings',
      key: 'servings',
    },

    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Phone No',
      dataIndex: 'phone',
      key: 'phone',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getColorStatus(status)} style={{ textTransform: 'capitalize' }}>
          {status == true ? 'Confirmed' : 'Unconfirmed'}
        </Tag>
      ),
    },
    {
      title: 'Pay',
      dataIndex: 'editId',
      key: 'editId',
      render: (data) => (
        <Button
          onClick={() =>
            makingPayment(data, {
              onSuccess: () => {
                toast.success('Payment in Progress.');
              },
              onError: () => {
                toast.error('Payment failed. Please try again');
              },
            })
          }
          disabled={data?.isConfirmed === true || isMakingPaymnet}
        >
          {data?.status === 'completed' ? 'Pay' : `Pay`}
        </Button>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => (
        <Button danger style={{ color: 'red' }} onClick={() => deleteOrder(id)}>
          {isLoading ? 'Deleting' : 'Delete'}
        </Button>
      ),
    },
  ];

  function getColorStatus(status) {
    switch (status) {
      case false:
        return 'processing';
      case true:
        return 'success';

      default:
        return 'default';
    }
  }

  const data = orders?.map((order, index) => ({
    key: index,
    image: order?.servingId.image,
    email: order?.email,
    servings: order?.servings,
    editId: order,
    status: order.isConfirmed,
    createdAt: order.created_at,
    phone: order?.phone,
    price: `KES ${dollarUSLocale.format(order?.price)}`,
    userName: capitalizeString(order?.Users?.userName ?? 'Not Found'),
    categories: order?.category,
    orderId: order?.id,
  }));

  function handleCancel() {
    setEditOrder(() => {});
    setSize(0);
  }

  const handleChange = (value) => {
    setctaegory(value);
  };

  const handleOk = () => {
    const newOrder = {
      size: size === 0 ? newEditOrder?.size : size,
      amount: amount === 0 ? newEditOrder?.amount : amount,
      status: category === '' ? newEditOrder?.status : category,
    };

    editingOrder(
      { newOrder, orderId },
      {
        onSettled: () => {
          setSize(0);
          setctaegory('');
          setEditOrder(null);
        },
      }
    );
  };

  // if (isLoading)
  //   return (
  //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  //       <Spin />
  //     </div>
  //   );

  return (
    <>
      <Table dataSource={data} columns={columnsData} />
      <Modal
        title="Edit Order"
        open={editOrder?.id}
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
        mask={false}
        okText={editingError ? <Spin /> : 'Edit'}
      >
        <form style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
          <TextField
            id="outlined-basic"
            label={`Size (${editOrder?.size}) Kgs`}
            variant="outlined"
            fullWidth
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />

          <div style={{ marginBottom: '1.6rem' }}> </div>

          <TextField
            id="outlined-basic"
            label={`Amount (KES ${newEditOrder?.amount})`}
            variant="outlined"
            fullWidth
            disabled
            value={amount}
          />

          <div style={{ marginBottom: '1rem' }}> </div>

          {isDiscounted && (
            <TextField
              id="outlined-basic"
              label={`Discount (KES)`}
              variant="outlined"
              fullWidth
              value={Math.floor(discount)}
              disabled
            />
          )}

          <div style={{ margin: '0rem' }}>
            <h5 style={{ marginBottom: '0.4rem' }}>Status</h5>
            <Select
              style={{
                width: 240,
              }}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </div>

          <div style={{ marginBottom: '0.4rem' }}> </div>
        </form>
      </Modal>
    </>
  );
}

export default OrdersTable;
