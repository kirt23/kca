import React, { useContext } from 'react'
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from "react-bootstrap/ListGroup";
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card'
import axios from 'axios';

function CartScreen() {
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;

    const updateCartHandler = async(item, quantity) => {
      const {data} = await axios.get(`/api/products/${item._id}`)
      if(data.countInStock < quantity) {
        window.alert("SORRY. PRODUCT IS OUT OF STOCK");
        return;
      }

      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: {...item, quantity}
      })
    }
    const removeItemHandler = (item) => {
      ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }
    const checkoutHandler = () => {
      navigate('/signin?redirect=/shipping')
    }
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0
            ? (<MessageBox>
              CART IS EMPTY <Link to="/">Go To Shop</Link>
            </MessageBox>)
            : (<ListGroup>
              {cartItems.map(
                (item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={4}>
                        <img 
                        src={item.image}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3} className='ItemCount'>
                        <Button 
                        variant="light" 
                        disabled={item.quantity === 1}
                        onClick={() => updateCartHandler(item, item.quantity - 1)}>
                          <i className='fas fa-minus-circle'></i>{/*MINUS ITEM*/}
                        </Button>
                        <span>{item.quantity}</span>
                        <Button 
                        variant="light" 
                        disabled={item.quantity === item.countInStock}
                        onClick={() => updateCartHandler(item, item.quantity + 1)}>
                          <i className='fas fa-plus-circle'></i>{/*ADD ITEM*/}
                        </Button>
                      </Col>
                      <Col className='ItemPrice' 
                        style={{alignItems: "center", 
                        height: "10vh", 
                        backgroundColor: "rgba(120, 255, 102, 0.54)", 
                        borderRadius: "8px"}} 
                        md={3}>
                          ${item.price}</Col>
                      <Col md={2} className='ItemDelete'>
                        <Button onClick={() => removeItemHandler(item)} variant='light'>
                          <i className='fas fa-trash'></i> {/*DELETE ITEM*/}
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              )} 
            </ListGroup>)}
        </Col>
        <Col md={4}>
          <Card 
            style={{display: "flex", alignItems: "center", justifyContent:"center"}}>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} item/s): $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button 
                    type='button' 
                    variant='primary' 
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}>
                      Proceed To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartScreen; 
