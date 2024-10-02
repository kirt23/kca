import React, { useContext } from 'react'
//import { Link } from 'react-router-dom';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button"
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
 

function Products  (props) {
  const navigate = useNavigate();

     const { product } = props;
     
     const {state, dispatch: ctxDispatch} = useContext(Store);
     const {cart, userInfo} = state;
    
     const {
      cart: {cartItems},
     } = state;

     const addToCartHandler = async(item) => {
      if (!userInfo) {
        //toast.error("Please log in to add items to your cart.");
        navigate('/signin'); // Redirect to sign-in page
        return;
      }
      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem
        ? existItem.quantity + 1
        : 1;
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

  return (
    <Card className="product">
        <Link to={`/product/${product.slug}`}>
            <img className="card-img-top" src={product.image} alt={product.name}/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product?.slug}`} style={{textDecoration: "none", color: 'Black'}}>
            <Card.Title>{product.name}</Card.Title>
            </Link>
            {/* <Rating  rating={product.rating} numReviews={product.numReviews} /> */}
            <Card.Title>₱{product.price.toFixed(2)}</Card.Title>
             {/* {product.countInStock ===  0
              ? (<Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                        backgroundColor: "rgba(217, 217, 217, 0.72)",
                          color: "rgba(71, 71, 71, 1)"
                  }}>Out Of Stock</Card>)
              : ()}  */}
              <Button className='productCardBtn'onClick={() => addToCartHandler(product)}>ADD TO CART</Button>
        </Card.Body>
    </Card>
  )
}

export default Products
