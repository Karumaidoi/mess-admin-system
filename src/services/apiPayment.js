/* eslint-disable object-shorthand */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */

import supabase from './supabase';

export async function getOAuthToken(data) {
  const phoneNumber = data?.phone;
  const amount = data?.price;
  const desc = `Transaction for Payment of your order - id ${data.id}`;
  const { id } = data;

  try {
    await fetch('https://kifaru.elarchdesigns.com/api/v1/mpesa/mpesaPayment', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        phone: `254${phoneNumber.replace('0', '')}`,
        amount: amount,
        description: desc,
      }),
    });

    await supabase.from('Orders').update({ isConfirmed: true }).eq('id', id);

    // Make a notifattion -> Send a notifiiaction to the user
    await supabase.from('Notifications').insert({
      email: data?.email,
      title: 'Payment of the serving confirmed.',
      description: `Your order - ${data?.servingId?.servingsName} is confirmed and paid. Please collect your serving. Thank you for using MESS PAY - KE`,
      image: data?.servingId?.image,
    });
  } catch (err) {
    throw new Error(err);
  }
}
