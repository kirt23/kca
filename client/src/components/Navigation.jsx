import React from "react";
import "./Navigation.css";

import { Link, useLocation } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";

import SearchBox from "./SearchBox";
import { Typography } from "@mui/material";
import { LinkContainer } from "react-router-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../LOGO.png";

export default function Navigation({ userInfo, cart, signoutHandler }) {
	const location = useLocation();
	const isSignInPage = location.pathname === "/signin";
	const isSignUpPage = location.pathname === "/signup";

	return (
		<div className="navigation">
			<div className="left">
				<LinkContainer to="/">
					<img src={logo} style={{ userSelect: "none" }} />
				</LinkContainer>

				<LinkContainer to="/">
					<Typography
						sx={{
							color: "white",
							cursor: "pointer",
							userSelect: "none",
						}}
						ml="15px"
						fontWeight="bold"
						fontSize="3rem"
					>
						RYB
					</Typography>
				</LinkContainer>

				{!userInfo && <SearchBox />}
				{userInfo && !userInfo.isAdmin && <SearchBox />}
			</div>
			<div className="right">
				{/* {userInfo && userInfo.isAdmin && (
					<NavDropdown
						title={userInfo.isAdmin ? "ADMIN" : "CUSTOMER"}
						id="admin-nav-dropdown"
						className="buttons"
					>
						<LinkContainer to="/admin/orders">
							<NavDropdown.Item className="drop-down-item">
								Order List
							</NavDropdown.Item>
						</LinkContainer>

						{userInfo.isAdmin && (
							<>
								<LinkContainer to="/admin/dashboard">
									<NavDropdown.Item className="drop-down-item">
										Dashboard
									</NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to="/admin/products">
									<NavDropdown.Item className="drop-down-item">
										Products List
									</NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to="/admin/users">
									<NavDropdown.Item className="drop-down-item">
										User List
									</NavDropdown.Item>
								</LinkContainer>
							</>
						)}
					</NavDropdown>
				)} */}

				{userInfo ? (
					<NavDropdown
						title={userInfo.name}
						id="basic-nav-dropdown"
						className="buttons"
					>
						<LinkContainer to="/profile">
							<NavDropdown.Item className="drop-down-item">
								User Profile
							</NavDropdown.Item>
						</LinkContainer>

						{userInfo.isRider ? null : (
							<>
								<LinkContainer to="/orderhistory">
									<NavDropdown.Item className="drop-down-item">
										Order History
									</NavDropdown.Item>
								</LinkContainer>
							</>
						)}

						<div onClick={signoutHandler}>
							<NavDropdown.Item className="drop-down-item">
								SIGN OUT
							</NavDropdown.Item>
						</div>
					</NavDropdown>
				) : (
					<>
						{isSignInPage ? (
							<Link className="nav-link" to="/signup">
								<div className="buttons">SIGN UP</div>
							</Link>
						) : (
							<Link className="nav-link" to="/signin">
								<div className="buttons">SIGN IN</div>
							</Link>
						)}
					</>
				)}

				{!userInfo && (
					<Link className="nav-link" to={{ pathname: "/search" }}>
						<div className="buttons">PRODUCTS</div>
					</Link>
				)}

				{!userInfo && (
					<Link className="nav-link" to={{ pathname: "/" }}>
						<div className="buttons">HOME</div>
					</Link>
				)}

				{!userInfo && (
					<Link to={{ pathname: "/cart" }}>
						<div className="buttons">
							<i className="fas fa-shopping-cart"></i>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
}
