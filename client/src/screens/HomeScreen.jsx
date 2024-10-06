import React, { useContext, useEffect, useReducer, useState } from "react";
//import data from '../data'

import axios from "axios";
import logger from "use-reducer-logger"; //with this you can debug and find issues in state changes
import Products from "../components/Products";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ChatHead from "../components/ChatHead";
import getError from "../utils";

import "./HomeScreen.css";
import AdminChatScreen from "../components/AdminChatScreen";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, products: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };

		default:
			return state;
	}
};

function HomeScreen({ userInfo }) {
	const [{ loading, error, products }, dispatch] = useReducer(
		logger(reducer),
		{
			products: [],
			loading: true,
			error: "",
		}
	);

	// const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get(`/api/products`);
				// const result = sampleProducts;
				dispatch({ type: "FETCH_SUCCESS", payload: result.data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: getError(err) });
			}
			//setProducts(result.data);
		};
		fetchData();
	}, []);

	return (
		<div>
			<Helmet>
				<title>RYB</title>
			</Helmet>
			<h2 style={{ marginTop: "30px" }}>
				<strong>
					<center>FEATURED PRODUCTS</center>
				</strong>
			</h2>
			<div>
				{loading ? (
					<LoadingBox />
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<div className="products">
						{products.slice(0, 4).map((product) => (
							<Products product={product}></Products>
						))}
					</div>
				)}
			</div>

			{/* <div style={styles.emailLinkContainer}>
				<a
					href="https://mail.google.com/mail/?view=cm&fs=1&to=kcaligam@ccc.edu.ph"
					target="_blank"
					rel="noopener noreferrer"
					style={styles.emailLink}
				>
					<img
						src="/images/gmail_logo.png" // Path to your Gmail logo image
						alt="Gmail Logo"
						style={styles.emailIcon}
					/>
				</a>
			</div> */}

			{userInfo ? (
				userInfo.isAdmin ? (
					<AdminChatScreen userInfo={userInfo} />
				) : (
					<ChatHead userInfo={userInfo} />
				)
			) : null}
		</div>
	);
}

export default HomeScreen;

const styles = {
	emailLinkContainer: {
		position: "fixed",
		bottom: "10px",
		right: "10px",
		zIndex: 1000,
	},

	chatContainer: {
		position: "fixed",
		bottom: "10px",
		right: "120px",
		zIndex: 1000,
	},

	emailLink: {
		textDecoration: "none",
		backgroundColor: "#d14836",
		color: "white",
		padding: "10px 20px",
		borderRadius: "5px",
		fontSize: "14px",
		display: "flex",
		alignItems: "center", // Align the text and image horizontally
	},
	emailIcon: {
		width: "50px",
		height: "30px",
		marginRight: "8px", // Space between the image and text
	},
};
