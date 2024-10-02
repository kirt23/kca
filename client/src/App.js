import {BrowserRouter, Route, Routes, Link, Navigate} from "react-router-dom"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'
import { LinkContainer } from "react-router-bootstrap"
import Badge from "react-bootstrap/esm/Badge";
import Nav from 'react-bootstrap/Nav'
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import NavDropdown from "react-bootstrap/NavDropdown"
import { Box, Typography } from "@mui/material";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import VerifyEmail from "./components/VerifyEmail";
import myImg from "./LOGO.jpg"
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { Button } from "react-bootstrap";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ServicesScreen from "./screens/ServicesScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import DesignerScreen from "./screens/DesignerScreen";
import CustomerRoute from "./components/CustomerRoute";
import CustomizeScreen from "./screens/CustomizeScreen";
import CustomizeRequestScreen from "./screens/CustomizeRequestScreen";

function App() {
  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart, userInfo} = state;

  const signoutHandler = () => {
    ctxDispatch({type: "USER_SIGNOUT"});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin'; 
  }
 
   const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
   const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async() => {
  //       try {
  //         const {data} = await axios.get(`api/products/categories`);
  //         setCategories(data);
  //       } catch (err) {
  //         toast.error(getError(err))
  //       }
  //   };
  //   fetchCategories();
  // }, [])
  return (
    <BrowserRouter>
      <div className={
          sidebarIsOpen 
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"}>
        <ToastContainer position="bottom-center" limit={1}/>
        <header>


          <Navbar className="TheNav" expand='lg' style={{backgroundColor: "black"}}>
            <Container>
              
              {/* <Button className="burgerButton"
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                  style={{border: "0px"}}>
                <i className="fas fa-bars"  style={{backgroundColor: "#d77f36"}}  /> ICON    ICON    ICON     ICON ICON 
              </Button> */}
            <LinkContainer to="/">
             <Navbar.Brand>
              <Box display="flex" alignItems="center">
                <img
                  alt="logo"
                    src={myImg}
                      height="70vh"
                      style={{
                        borderRadius: "4rem"
                      }}/><Typography sx={{color:"white"}} ml="15px" fontWeight="bold" fontSize="3rem">
                        RYB
                        </Typography> 
                        </Box>
                  </Navbar.Brand>
            </LinkContainer> 


             <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
            { !userInfo && (
              <SearchBox/>
            )}
            {userInfo && !userInfo.isAdmin && (
              <SearchBox/>
            )}

            <Nav className="me-auto w-100 justify-content-end align-x align-items-center"> 
                      
        
                 { !userInfo && (
                    // User with no account
                    <Link to="/cart" className="nav-link" style={{borderRight:"2px solid black"}}>
               
                <ShoppingBagIcon className="bag"sx={{fontSize:"2rem"}}/>
                   {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
               </Link>)
                  } 

                {userInfo && !userInfo.isAdmin && !userInfo.isRider && (
                  <Link to="/cart" className="nav-link" style={{borderRight:"2px solid white"}}>
               
                  <ShoppingBagIcon sx={{fontSize:"2rem"}}/>
                     {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                 </Link>
                )}
              
              { !userInfo && (
                    <Link to={{ pathname: '/search' }} style={{ borderRight:"2px solid white" }}>
              
                    <Button style={{backgroundColor:"#ff000000", border:"0", height:"3rem"}}>
                    <span><strong>Products</strong></span>
                  </Button>
                  </Link> 
               )} 

              {userInfo && !userInfo.isAdmin && !userInfo.isRider && (
              <Link to={{ pathname: '/search' }} style={{ borderRight:"2px solid white" }}>
              
                <Button style={{backgroundColor:"#ff000000", border:"0", height:"3rem"}}>
                <span><strong>Products</strong></span>
              </Button>
              </Link> 
              )}
              
              

              {userInfo 
                ? ( 
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown" className="NavDrop">
                    <Box sx={{borderRadius: "10px",backgroundColor: "#a3a3a3c7"}}>
                      <LinkContainer to='/profile'>
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                    </Box>
                    {userInfo.isAdmin || userInfo.isRider
                    ?(" ")
                    :( <><Box sx={{ mt: "9px", borderRadius: "10px", backgroundColor: "#a3a3a3c7" }}>
                            <LinkContainer to='/orderhistory'>
                              <NavDropdown.Item>Order History</NavDropdown.Item>
                            </LinkContainer>
                          </Box></>)}

                    <Box sx={{mt:"9px", borderRadius: "10px",backgroundColor: "#a3a3a3c7"}}>
                      <Link 
                        className="dropdown-item"
                          to='#signout'
                            onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </Box>

                  </NavDropdown>
                ) 
                : (
                <Link className="nav-link" to="/signin" style={{color:"white"}}>
                    Sign In
                  </Link>
                )}

                
{userInfo && ( 
  <NavDropdown title="Admin" id="admin-nav-dropdown" className="NavDrop">
    
    {/* Show the "Order List" for both Admin and Rider */}
    <Box sx={{ mt: "9px", borderRadius: "10px", backgroundColor: "#a3a3a3c7" }}>
      <LinkContainer to="/admin/orders">
        <NavDropdown.Item>Order List</NavDropdown.Item>
      </LinkContainer>
    </Box>

    {/* Show the rest of the admin links only for Admin users */}
    {userInfo.isAdmin && (
      <>
        <Box sx={{ borderRadius: "10px", backgroundColor: "#a3a3a3c7" }}>
          <LinkContainer to="/admin/dashboard" className="dropdown-item">
            <NavDropdown.Item>Dashboard</NavDropdown.Item>
          </LinkContainer>
        </Box>

        <Box sx={{ mt: "9px", borderRadius: "10px", backgroundColor: "#a3a3a3c7" }}>
          <LinkContainer to="/admin/products">
            <NavDropdown.Item>Products List</NavDropdown.Item>
          </LinkContainer>
        </Box>

        <Box sx={{ mt: "9px", borderRadius: "10px", backgroundColor: "#a3a3a3c7" }}>
          <LinkContainer to="/admin/users">
            <NavDropdown.Item>User List</NavDropdown.Item>
          </LinkContainer>
        </Box>
      </>
    )}
  </NavDropdown>
)}


            </Nav>
            </Navbar.Collapse>



            </Container>
          </Navbar>
        </header>
{/* HAMBURGER-NAV    HAMBURGER-NAV     HAMBURGER-NAV     HAMBURGER-NAV     HAMBURGER-NAV     HAMBURGER-NAV*/}
        {/* <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                  style={{color:"black", fontWeight:"bold"}}
                >
                  <Nav.Link style={{textDecoration: "none"}}>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div> */}
{/* HAMBURGER-NAV ^    HAMBURGER-NAV ^    HAMBURGER-NAV ^     HAMBURGER-NAV ^     HAMBURGER-NAV     HAMBURGER-NAV*/}
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CustomerRoute><CartScreen /></CustomerRoute>}/>
              <Route path="/signin" element={<SigninScreen />}/>
              <Route path="/signup" element={<SignupScreen />}/>
              <Route path="/verify-email" element={<VerifyEmail />}/>
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            
              <Route path="/reset-password" element={<ResetPasswordScreen />} />

              <Route path="/shipping" element={<ProtectedRoute><CustomerRoute><ShippingAddressScreen/></CustomerRoute></ProtectedRoute>}/>
              <Route path="/payment" element={<ProtectedRoute><CustomerRoute><PaymentMethodScreen/></CustomerRoute></ProtectedRoute>}/>
              <Route path="/placeorder" element={<ProtectedRoute><CustomerRoute><PlaceOrderScreen/></CustomerRoute></ProtectedRoute>}/>
              
              {/* PROTECTED ROUTES */}
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen/></ProtectedRoute>}/>
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen/></ProtectedRoute>}/>
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen/></ProtectedRoute>}/>
              {/* <Route path="/services" element={<ProtectedRoute><CustomerRoute><ServicesScreen/></CustomerRoute></ProtectedRoute>}/> */}
              <Route path="/search" element={<CustomerRoute><SearchScreen/></CustomerRoute>}/>
              <Route path="/designer" element={<ProtectedRoute><DesignerScreen/></ProtectedRoute>}/>
              <Route path="/custom/:id" element={<ProtectedRoute><CustomizeScreen/></ProtectedRoute>}/>
              <Route path="/customize/:id" element={<ProtectedRoute><CustomizeRequestScreen/></ProtectedRoute>}/>
              
              
              
              {/* ADMIN ROUTES    ADMIN ROUTES      ADMIN ROUTES      ADMIN ROUTES*/}
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen/></AdminRoute>}/>
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen/></AdminRoute>}/>
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen/></AdminRoute>}/>
              <Route path="/admin/orders" element={<AdminRoute><OrderListScreen/></AdminRoute>}/>
              <Route path="/admin/users" element={<AdminRoute><UserListScreen/></AdminRoute>}/>
              <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen/></AdminRoute>}/>
              
              
        
                <Route path="/" element={<CustomerRoute><HomeScreen/></CustomerRoute>}/>
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">ALL RIGHTS RESERVED</div>
          </footer> 
      </div>
    </BrowserRouter>
  );
}

export default App;
