'use client'

import styled, {css} from 'styled-components';
import {useForm} from 'react-hook-form';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';

type LoginFormFields = {
  username: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors
    },
  } = useForm<LoginFormFields>()

  const onSubmit = async (data: LoginFormFields) => {
    const r = await signIn('credentials', {redirect: false, callbackUrl: undefined, ...data})

    if (!r) return;

    if (r?.status === 401) {
      setError('username', {message: 'Incorrect username'})
      setError('password', {message: 'Incorrect password'})
    } else if (r.url) {
      const redirectTo = new URL(r.url).searchParams.get('callbackUrl')
      router.push(redirectTo || '/')
    }
  }

  const loginWithExternalProvider = async (provider: 'google') => {
    const r = await signIn(provider)

    if (!r) return

    if (r.status === 401) alert('Error')
    else if (r.url) {
      const redirectTo = new URL(r.url).searchParams.get('callbackUrl')
      router.push(redirectTo || '/')
    }
  }

  return (
    <Layout>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputWithError>
            {errors.username && <Error>{errors.username.message}</Error>}
            <Input $error={!!errors.username} placeholder={'Username'} {...register('username')}/>
          </InputWithError>

          <InputWithError>
            {errors.password && <Error>{errors.password.message}</Error>}
            <Input $error={!!errors.username} placeholder={'Password'} {...register('password')}/>
          </InputWithError>

          <Button type={'submit'}>Sign in</Button>
        </Form>

        <Line/>

        <Button style={{background: 'rgba(75,149,232,0.78)'}} onClick={() => loginWithExternalProvider('google')}>
          Sign in with Google
        </Button>
      </Container>
    </Layout>
  )
}

const Line = styled.div `
  width: 100%;
  height: 2px;
  background: #cbcbcb;
`;


const Layout = styled.div `
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const containerStyles = css `
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


const Container = styled.div `
  ${containerStyles};
  gap: 20px;
`;

const Form = styled.form `
  ${containerStyles};
`;

const InputWithError = styled.div `
  display: flex;
  flex-direction: column;
`;

const Error = styled.span `
  color: #ff4545;
`;

const Input = styled.input<{$error?: boolean}> `
  padding: 10px;
  color: #fff;
  border: 1px transparent solid;
  outline: none;
  border-radius: 5px;
  
  &:focus, &:active {
    border: none;
    outline: none;
  }
  
  ${({$error}) => $error && css `
    border: 1px #ff4545 solid;
  `}
`;


const Button = styled.button `
  padding: 10px;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  outline: none;
  border: 1px #fff solid;
  width: 100%;
  border-radius: 5px;
`;

