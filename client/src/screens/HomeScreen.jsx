import React, { useEffect, useReducer, useState } from 'react'
//import data from '../data'
import axios from 'axios';
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import logger from "use-reducer-logger"  //with this you can debug and find issues in state changes
import Products from '../components/Products';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import getError from '../utils';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
    return {...state, products: action.payload, loading: false};
    case 'FETCH_FAIL':
    return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};

function HomeScreen()  {
  const [{loading, error, products}, dispatch] = useReducer(logger(reducer),{
    products:[],
    loading: true,
    error: '',
  });
  // const [products, setProducts] = useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try{
      const result = await axios.get('/api/products');
      dispatch({type: 'FETCH_SUCCESS', payload: result.data})
     } catch(err){
      dispatch({type: 'FETCH_FAIL', payload: getError(err)});
     }
      //setProducts(result.data);
    }
    fetchData();
  }, [])
  return (
    <div>
      <Helmet>
        <title>AMAZONA</title>
        </Helmet>
       <h1>FEATURED PRODUCTS</h1>
          <div className="products">
            {
              loading 
              ? (<LoadingBox/>)
              : error 
                ? (<MessageBox variant="danger">{error}</MessageBox>)
                : (
                  <Row>
                    {products.map(product => (
                      <Col  key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                        <Products product={product}></Products>
                        
                      </Col>
                      ))}
                  </Row>
                  )
            }
          </div>
    </div>
  )
}

export default HomeScreen;
