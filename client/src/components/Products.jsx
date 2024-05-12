import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button"
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
 

function Products  (props) {
     const { product } = props;
     
     const {state, dispatch: ctxDispatch} = useContext(Store);
     const {
      cart: {cartItems},
     } = state;

     const addToCartHandler = async(item) => {
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
            <Link to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating  rating={product.rating} numReviews={product.numReviews} />
            <Card.Title>${product.price}</Card.Title>
            {product.countInStock ===  0
              ? (<Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                        backgroundColor: "rgba(217, 217, 217, 0.72)",
                          color: "rgba(71, 71, 71, 1)"
                  }}>Out Of Stock</Card>)
              : (<Button onClick={() => addToCartHandler(product)}>ADD TO CART</Button>)}
        </Card.Body>
    </Card>
  )
}

export default Products
