import axios from "axios";
import React, {
	useRef,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import logger from "use-reducer-logger";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import getError from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";

import "./ProductScreen.css";

const reducer = (state, action) => {
	switch (action.type) {
		case "REFRESH_PRODUCT":
			return { ...state, product: action.payload };
		case "CREATE_REQUEST":
			return { ...state, loadingCreateReview: true };
		case "CREATE_SUCCESS":
			return { ...state, loadingCreateReview: false };
		case "CREATE_FAIL":
			return { ...state, loadingCreateReview: false };
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, product: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

function ProductScreen() {
	const navigate = useNavigate();
	const params = useParams();
	const { slug } = params;
	let reviewsRef = useRef();

	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [selectedImage, setSelectedImage] = useState("");

	const [{ loading, error, product, loadingCreateReview }, dispatch] =
		useReducer(logger(reducer), {
			product: [],
			loading: true,
			error: "",
		});

	// const [products, setProducts] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get(`/api/products/slug/${slug}`);
				dispatch({ type: "FETCH_SUCCESS", payload: result.data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: getError(err) });
			}
			//setProducts(result.data);
		};
		fetchData();
	}, [slug]);

	const { state, dispatch: ctxDispatch } = useContext(Store);
	console.log("Store State:", state);
	const { cart, userInfo } = state;

	const addToCartHandler = async () => {
		console.log("wew", userInfo);
		if (!userInfo) {
			toast.error("Please log in to add items to your cart.");
			navigate("/signin?redirect=/shipping");
			return;
		}

		const existItem = cart.cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);

		if (data.countInStock < quantity) {
			window.alert("SORRY. PRODUCT IS OUT OF STOCK");
			return;
		}

		ctxDispatch({
			type: "CART_ADD_ITEM",
			payload: { ...product, quantity },
		});
		navigate("/cart");
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!comment || !rating) {
			toast.error("PLEASE ENTER COMMENT AND RATING");
			return;
		}

		try {
			const { data } = await axios.post(
				`/api/products/${product._id}/reviews`,
				{ rating, comment, name: userInfo.name },
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);
			dispatch({ type: "CREATE_SUCCESS" });

			toast.success("Review Submitted Successfully");
			product.reviews.unshift(data.review);
			product.numReviews = data.numReviews;
			product.rating = data.rating;
			dispatch({ type: "REFRESH_PRODUCT", payload: product });
			window.scrollTo({
				behavior: "smooth",
				top: reviewsRef.current.offsetTop,
			});
		} catch (error) {
			toast.error(getError(error));
			dispatch({ type: "CREATE_FAIL" });
		}
	};

	return loading ? (
		<LoadingBox />
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<>
			<div className="product-slug">
				<img
					className="product-image"
					src={selectedImage || product.image}
					alt={product.name}
				/>

				<div className="left-layout">
					<div className="top-layout">
						<div className="description-layout">
							<h4>DESCRIPTION</h4>
							<div>{product.description}</div>
						</div>
						<div className="product-info-layout">
							<h2>
								<center>{product.name}</center>
							</h2>
							<div
								style={{
									fontSize: "1.5rem",
									marginBottom: "10px",
									fontWeight: "bold",
									color: "#888",
								}}
							>
								<center>P {product.price}</center>
							</div>
							<span
								className="add-to-cart"
								onClick={addToCartHandler}
							>
								<i
									className="fas fa-cart-plus"
									style={{ marginRight: "10px" }}
								/>{" "}
								ADD TO CART
							</span>
						</div>
					</div>
					<div className="bot-layout">
						<div className="products-layout">
							{[product.image, ...product.images].map((x) => (
								<img
									src={x}
									alt={"product"}
									onClick={() => setSelectedImage(x)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			<h3>
				<center>REVIEW</center>
			</h3>
		</>
	);

	// (<div>
	// 	<Row>
	// 		<Col md={6} style={{display:"flex", justifyContent:"flex-end"}}>
	// 			<img
	// 				className='img-large'
	// 				src={selectedImage || product.image}
	// 				alt={product.name}/>
	// 		</Col>
	// 			<Col md={3}>
	// 				<ListGroup variant="flush">
	// 					<ListGroup.Item>
	// 						<Helmet>
	// 							<title>{product.name}</title>
	// 						</Helmet>
	// 						<h1 >{product.name}</h1>
	// 					</ListGroup.Item>
	// 					{/* <ListGroup.Item>
	// 						<Rating
	// 							rating={product.rating}
	// 								numReviews={product.numReviews}/>
	// 					</ListGroup.Item> */}
	// 					<ListGroup.Item>
	// 								<Row xs={1} md={2} className='g-2'>
	// 								{
	// 									[product.image, ...product.images].map((x) =>(
	// 										<Col key={x}>
	// 											<Card>
	// 												<Button
	// 												className='thumbnail'
	// 												type='button'
	// 												variant='light'
	// 												onClick={() => setSelectedImage(x)}>
	// 													<Card.Img
	// 													variant='top'
	// 													src={x}
	// 													alt='product'/>
	// 												</Button>
	// 											</Card>
	// 										</Col>
	// 									))
	// 								}
	// 								</Row>
	// 							</ListGroup.Item>
	// 					<ListGroup.Item>
	// 						Description: <p>{product.description}</p>
	// 					</ListGroup.Item>
	// 				</ListGroup>
	// 			</Col>
	// 			<Col md={3}>
	// 				<Card>
	// 					<Card.Body>
	// 						<ListGroup variant="flush" style={{display:"flex", alignItems:"center"}}>
	// 							<ListGroup.Item>
	// 								<Row>
	// 									<Col>Price:</Col>
	// 									<Col>₱{product.price.toFixed(2)}</Col>
	// 								</Row>
	// 							</ListGroup.Item>

	// 							{/* <ListGroup.Item>
	// 								 <Row>
	// 									<Col>Status:</Col>
	// 									<Col> {product.countInStock > 0 ? (
	// 										<Badge bg="success">In Stock</Badge>
	// 									) : (
	// 										<Badge bg="danger">Unavailable</Badge>
	// 									)}</Col>
	// 								</Row>
	// 							</ListGroup.Item> */}

	// 							{product.countInStock > 0 && (
	// 								<ListGroup.Item>
	// 									<div className="d-grid">
	// 										<button className='addCartBtn' onClick={addToCartHandler} variant='primary'>
	// 										<span className="button__text">ADD TO CART</span>
	// 										<span className="button__icon"><i className="	fas fa-cart-plus" /></span>
	// 										</button>
	// 									</div>
	// 								</ListGroup.Item>
	// 							)}
	// 						</ListGroup>
	// 					</Card.Body>
	// 				</Card>
	// 			</Col>
	// 		</Row>

	// 		{/* CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK     CUSTOMER-FEEDBACK*/}
	// 							<div className="my-3" style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
	// 								<h2 ref={reviewsRef}>Reviews</h2>
	// 								<div className="mb-3">
	// 									{product.reviews.length === 0 && (
	// 										<MessageBox>There are no reviews yet</MessageBox>
	// 									)}
	// 								</div>

	// 								<ListGroup style={{gap:"1rem"}}>
	// 									{product.reviews.map((review) => (
	// 										<div className="commentCard">
	// 										<div className="commentCard-overlay"></div>
	// 										<div className="commentCard-inner">
	// 											<ListGroup.Item key={review._id} className='innerCardComment'>
	// 											<strong>{review.name}</strong>
	// 											<Rating rating={review.rating} caption=" "></Rating>
	// 											<p>{review.createdAt.substring(0, 10)}</p>
	// 											<p>{review.comment}</p>
	// 										</ListGroup.Item>
	// 										</div>
	// 									</div>

	// 									))}
	// 								</ListGroup>

	// 								<div className="my-3">
	// 									{userInfo
	// 										? (
	// 											<form onSubmit={submitHandler}>
	// 												<h2>Write Your Comment Here</h2>
	// 												<Form.Group className="mb-3" controlId="rating">
	// 													<Form.Label>Rating</Form.Label>
	// 													<Form.Select
	// 														aria-label="Rating"
	// 														value={rating}
	// 														onChange={(e) => setRating(e.target.value)}>
	// 															<option value="">Select Rating...</option>
	// 															<option value="1">1 - Poor</option>
	// 															<option value="2">2 - Fair</option>
	// 															<option value="3">3 - Good</option>
	// 															<option value="4">4 - Very Good</option>
	// 															<option value="5">5 - Excelent</option>
	// 													</Form.Select>
	// 												</Form.Group>

	// 												<FloatingLabel
	// 													controlId='floatingTextArea'
	// 													className='mb-3'>
	// 														<Form.Control
	// 															as="textarea"
	// 															placeholder="Leave A Comment Here"
	// 															value={comment}
	// 															onChange={(e) => setComment(e.target.value)}/>
	// 												</FloatingLabel>

	// 												<div className="mb-3">
	// 													<button
	// 													disabled={loadingCreateReview}
	// 													type="submit"
	// 													className='CommentBtn'>
	// 														Submit
	// 													</button>
	// 													{loadingCreateReview && <LoadingBox></LoadingBox>}
	// 												</div>
	// 											</form>
	// 										)
	// 										: (
	// 											<MessageBox>
	// 												Please{' '}
	// 												<Link to={`/signin?redirect=/product/${product.slug}`}>
	// 													Sign In
	// 												</Link>
	// 												to write a review
	// 											</MessageBox>
	// 										)}
	// 								</div>
	// 							</div>
	// 	</div>)
}

export default ProductScreen;
