import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
// @mui
import { Container, Stack, TextField, Typography } from '@mui/material';
import { Button, Card, Spin } from 'antd';
import { useSettingsUpdate } from '../hooks/useSettingsUpdate';
import { useSettings } from '../hooks/useSettings';
import { useSignUpUser } from '../hooks/useSignUpUser';
import { useCreateServing } from 'src/hooks/useCreateServings';
import { create } from 'lodash';

const AuthButton = styled.button`
  background-color: blue;
  border-radius: 4px;
  border: none;
  color: white;
  padding: 0px 8px;
  cursor: pointer;
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  font-size: 1.3rem;
  border-radius: var(--border-radius-sm);

  &::file-selector-button {
    font: inherit;
    font-weight: 500;
    font-size: 1.3rem;
    /* padding: 0.4rem 0.6rem; */
    margin-right: 1.2rem;
    border-radius: 4px;
    border: none;
    color: whitesmoke;
    background-color: #323232;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      background-color: #272626;
    }
  }
`;

export default function BlogPage() {
  const { editingSettings, isLoading: isEditing } = useSettingsUpdate();
  const { signUpUser, isSigningUp } = useSignUpUser();
  const { createNewServing, isLoading, error } = useCreateServing();
  const { handleSubmit, register, reset, formState } = useForm();
  const { handleSubmit: handleSubmitForm, register: registerForm, reset: resetForm } = useForm();

  const { errors } = formState;

  function handleBlur(e, field) {
    const { value } = e.target;

    if (!value) return;

    editingSettings({ [field]: value });
  }

  function onSubmit({ email, password }) {
    signUpUser(
      { email, password },
      {
        onSettled: () => {
          reset();
        },
      }
    );
  }

  function onSubmitData(data) {
    const { servingsName, description, noServings, price } = data;
    console.log(data.image[0]);
    const image = data.image[0];
    createNewServing(
      { servingsName, description, noServings, price, image },
      {
        onSettled: () => {
          resetForm();
        },
      }
    );
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: User | MESS PAY - KE </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
        </Stack>

        <Card>
          <h3 style={{ marginBottom: 'rem' }}>Add Servings</h3>
          <p>To add a serving, please fill the form below.</p>
          <form onSubmit={handleSubmitForm(onSubmitData)}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '4rem',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h5 style={{ marginBottom: '0.7rem' }}>Title</h5>
                  <TextField
                    {...registerForm('servingsName', { required: 'This field is required' })}
                    helperText={errors?.email?.message}
                    error={errors?.email?.message}
                    id="outlined-basic"
                    label={`Title`}
                    variant="outlined"
                    fullWidth
                  />
                </div>

                <div>
                  <h5 style={{ marginBottom: '0.7rem' }}>Description</h5>
                  <TextField
                    {...registerForm('description')}
                    helperText={errors?.password?.message}
                    error={errors?.password?.message}
                    id="outlined-basic"
                    label={'Description'}
                    variant="outlined"
                    fullWidth
                  />
                </div>

                <div>
                  <h5 style={{ marginBottom: '0.7rem' }}>No. of Servings</h5>
                  <TextField
                    {...registerForm('noServings')}
                    helperText={errors?.password?.message}
                    error={errors?.password?.message}
                    id="outlined-basic"
                    label={'No of Servings'}
                    variant="outlined"
                    fullWidth
                  />
                </div>

                <div>
                  <h5 style={{ marginBottom: '0.7rem' }}>Price</h5>
                  <TextField
                    {...registerForm('price')}
                    helperText={errors?.password?.message}
                    error={errors?.password?.message}
                    id="outlined-basic"
                    label={'Price'}
                    variant="outlined"
                    fullWidth
                  />
                </div>
              </div>

              <div style={{ height: '4rem' }}></div>

              <div style={{ marginTop: '1rem' }}>
                <FileInput id="image" accept="*" {...registerForm('image', { required: 'This field is required' })} />
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1.3rem' }}>
              <Button>Cancel</Button>
              <AuthButton type="submit">Submit</AuthButton>
            </div>
          </form>
        </Card>

        <div style={{ marginBottom: '4rem' }} />
        <Card>
          <h3 style={{ marginBottom: 'rem' }}>Add Admin</h3>
          <p>Changes are done on Mouse Leave. Settings will automatically reflect immediately.</p>
          <form onSubmit={handleSubmit(onSubmit)} key={'new'}>
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'row',
                gap: '4rem',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h5 style={{ marginBottom: '0.7rem' }}>Email</h5>
                <TextField
                  {...register('email', { required: 'This field is required' })}
                  helperText={errors?.email?.message}
                  error={errors?.email?.message}
                  id="outlined-basic"
                  label={`Email Address `}
                  variant="outlined"
                  fullWidth
                  disabled={isSigningUp}
                />
              </div>

              <div>
                <h5 style={{ marginBottom: '0.7rem' }}>Password</h5>
                <TextField
                  {...register('password', { required: 'This field is required' })}
                  helperText={errors?.password?.message}
                  error={errors?.password?.message}
                  id="outlined-basic"
                  label={'Password'}
                  variant="outlined"
                  fullWidth
                  disabled={isSigningUp}
                />
              </div>

              <div>
                <h5 style={{ marginBottom: '0.7rem' }}>Avatar</h5>
                <TextField id="outlined-basic" label={'Avatar'} variant="outlined" fullWidth disabled />
              </div>
            </div>
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1.3rem' }}>
              <Button>Cancel</Button>
              <AuthButton type="submit">Submit</AuthButton>
            </div>
          </form>
        </Card>
      </Container>
    </>
  );
}
