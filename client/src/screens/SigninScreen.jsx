import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { TextField, Typography, Button } from '@mui/material';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import getError from '../utils';

function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (lockoutTime) {
      const currentTime = new Date().getTime();
      if (currentTime < lockoutTime) {
        const timeLeft = Math.ceil((lockoutTime - currentTime) / 1000);
        toast.error(`Too many attempts. Please wait ${timeLeft} seconds.`);
        return;
      } else {
        setLockoutTime(null);
        setAttempts(0);
      }
    }

    try {
      const { data } = await axios.post(`/api/users/signin`, {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      const errorMessage = getError(err);
      if (errorMessage.includes('401')) {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= 3) {
          const lockTime = new Date().getTime() + 90 * 1000; // 1 minute 30 seconds
          setLockoutTime(lockTime);
          toast.error('Too many attempts. You are locked out for 90 seconds.');
        } else {
          toast.error('Wrong email or password. Please try again.');
        }
      } else {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container
      className="small-container"
      style={{
        marginTop: '2rem',
        border: '2px solid black',
        borderRadius: '8px',
        boxShadow: '10px 10px 10px 10px rgba(86, 81, 255, 0.57)',
      }}
    >
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <TextField
            sx={{ display: 'flex' }}
            type="email"
            label="Email"
            variant="outlined"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <TextField
            sx={{ display: 'flex' }}
            type="password"
            label="Password"
            variant="outlined"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3" style={{ gap: '10px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="submit"
            variant="outlined"
            sx={{ border: 'none', backgroundColor: '#f0c040', color: 'black' }}
          >
            Sign In
          </Button>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="mb-3" style={{ display: 'flex', gap: '5px' }}>
          <Typography>New Customer?</Typography>
          <Link to={`/signup?redirect=${redirect}`}>CREATE ACCOUNT HERE</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SigninScreen;
