import WhatsAppLogo from 'assets/whatsapplogo.png';
import Button from '@mui/material/Button';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { auth } from 'config/firebase';

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

function Login() {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <StyledContainer>
      <Head>
        <title>Login</title>
      </Head>
      <StyledLoginContainer>
        <StyledImageWrapper>
          <Image src={WhatsAppLogo} alt="logo" height={200} width={200} />
        </StyledImageWrapper>
        <Button variant="outlined" onClick={handleSignIn}>
          SIGN IN WITH GOOGLE
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  );
}

export default Login;
