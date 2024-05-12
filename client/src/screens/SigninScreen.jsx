import React from 'react'
import {Link, useLocation} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Helmet} from 'react-helmet-async';
import { TextField, Typography, Button } from '@mui/material';


function SigninScreen() {
const {search} = useLocation();
const redirectInUrl = new URLSearchParams(search).get('redirect');
const redirect = redirectInUrl
  ? redirectInUrl
  : '/';
  return (
    <Container className="small-container" 
      style={{
        marginTop: "2rem",
          border: "2px solid black",
            borderRadius: "8px",
              boxShadow: "10px 10px 10px 10px rgba(86, 81, 255, 0.57)"}}>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className='my-3'>Sign In</h1>
      <Form>
        <Form.Group className="mb-3" controlId="email">
            <TextField sx={{display: "flex"}}type='email' label="Email" variant="outlined" required/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
        <TextField sx={{display: "flex"}}type='password' label="Password" variant="outlined" required/>
            {/* <Form.Label>Password</Form.Label>
            <Form.Control type="password" required/> */}
        </Form.Group>
        <div className="mb-3">
          <Button 
            type='submit' 
              variant="outlined"
                sx={{border: "none", backgroundColor:"#f0c040", color:"black"}}>
                  Sign In</Button>
        </div>
        <div className="mb-3" style={{display: 'flex', gap: '5px'}}>
            <Typography>New Customer?</Typography>
            <Link to={`/signup?redirect=${redirect}`}>CREATE ACCOUNT HERE</Link>
        </div>
      </Form>
    </Container>
  )
}

export default SigninScreen
