import React, { useState, useContext, useEffect, useReducer } from 'react'
import { Store } from '../Store';
import {getError} from '../utils';
import axios, { Axios } from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Card, Col, Row } from 'react-bootstrap';

import Chart from 'react-google-charts';

import './DashboardScreen.css'

// const sampleOrder = {
// 	orderItems: [
// 		{
// 			slug: 'product-1-slug',
// 			name: 'Product 1',
// 			quantity: 2,
// 			image: 'https://example.com/images/product1.jpg',
// 			price: 100,
// 			product: '60d21b4667d0d8992e610c85', // example ObjectId reference
// 		},
// 		{
// 			slug: 'product-2-slug',
// 			name: 'Product 2',
// 			quantity: 1,
// 			image: 'https://example.com/images/product2.jpg',
// 			price: 50,
// 			product: '60d21b4667d0d8992e610c86', // example ObjectId reference
// 		},
// 	],
// 	shippingAddress: {
// 		LastName: 'Doe',
// 		fullName: 'John Doe',
// 		address: '123 Main St',
// 		city: 'Los Angeles',
// 		postalCode: 90001,
// 	},
// 	paymentMethodName: 'Credit Card',
// 	referenceNumber: 'REF123456',
// 	paymentImage: 'https://example.com/payment/paymentImage.jpg',
// 	paymentResult: {
// 		id: 'PAY123456',
// 		status: 'Completed',
// 		update_time: '2024-10-01T10:00:00Z',
// 		email_address: 'john.doe@example.com',
// 	},
// 	itemsPrice: 250,
// 	shippingPrice: 20,
// 	taxPrice: 10,
// 	totalPrice: 280,
// 	user: '60d21b4667d0d8992e610c87', // example ObjectId reference for the user
// 	isPaid: true,
// 	paidAt: new Date('2024-10-01T12:00:00Z'),
// 	proofOfDeliveryImage: 'https://example.com/proof/delivery.jpg',
// 	isDelivered: true,
// 	deliveredAt: new Date('2024-10-02T14:00:00Z'),
// };


// const summaryCategory = {
// 	productCategories: [
// 		{
// 			_id: 'Electronics',
// 			count: 10,
// 		},
// 		{
// 			_id: 'Books',
// 			count: 5,
// 		},
// 		{
// 			_id: 'Clothing',
// 			count: 8,
// 		},
// 		{
// 			_id: 'Home Appliances',
// 			count: 3,
// 		},
// 	],
// };

// const summarySales = {
// 	dailyOrders: [
// 		{
// 			_id: '2024-09-25', // Date of the sales
// 			sales: 150,        // Sales amount for that date
// 		},
// 		{
// 			_id: '2024-09-26',
// 			sales: 200,
// 		},
// 		{
// 			_id: '2024-09-27',
// 			sales: 100,
// 		},
// 		{
// 			_id: '2024-09-28',
// 			sales: 250,
// 		},
// 		{
// 			_id: '2024-09-29',
// 			sales: 300,
// 		},
// 	],
// };

const TopDashboard = ({summary}) => {


	return (
		<div className="top-dashboard">
			<Card className="top-card users">
				<Card.Body>
					<Card.Title>
						{summary.users && summary.users[0]
						? summary.users[0].numUsers
						: 0}
					</Card.Title>
					<Card.Text>USERS</Card.Text>
				</Card.Body>
			</Card>

			<Card className="top-card orders">
				<Card.Body>
					<Card.Title>
						{summary.orders && summary.users[0]
						? summary.orders[0].numOrders
						: 0}
					</Card.Title>
					<Card.Text>ORDERS</Card.Text>
				</Card.Body>
			</Card>

			<Card className="top-card top-sales">
				<Card.Body>
					<Card.Title> ₱{' '}
						{summary.orders && summary.users[0]
							? summary.orders[0].totalSales.toFixed(2)
							: 0}
						</Card.Title>
						<Card.Text>TOTAL SALES</Card.Text>
				</Card.Body>
			</Card>
		</div>
	)
}

const SalesChart = ({ summary }) => {
	const [view, setView] = useState('Day');
	const dailyData = summary.dailyOrders.map((x) => [x._id, x.sales]);

	const chartData = {
		Day: [['Date', 'Sales'], ...dailyData]
	};

	const currentDate = new Date().toLocaleDateString();

	const chartOptions = {
		hAxis: { title: 'Date' },          
		vAxis: { title: 'Sales' },         
		colors: ['gold'],               
		lineWidth: 3,                      
		curveType: 'function',      
		areaOpacity: 0.1,                  
		backgroundColor: '#fafafa',
		legend: { position: 'bottom' } 
	};

	const handlePrint = () => {
		const chartElement = document.querySelector('.sales-dashboard');

		if (chartElement) {
			const printWindow = window.open('', '', 'width=800,height=600');
			printWindow.document.write(`
			<html>
				<head>
					<title>Print Sales Chart</title>
					<style>
						body {
							font-family: Arial, sans-serif;
							margin: 0;
							background-color: #f5f5f5;
						}

						.print-container {
							display: flex;
							flex-direction: column;
							align-items: center;
							background-color: white;
							border-radius: 8px;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
						}

						h3 {
							font-size: 24px;
							margin-bottom: 10px;
							color: #333;
							text-align: center;
						}

						.sales-date {
							font-size: 14px;
							margin-bottom: 20px;
							color: #555;
							text-align: center;
						}

						.sales-chart {
							width: 100%;
							height: 400px;
							margin-bottom: 20px;
						}

						.footer-note {
							font-size: 12px;
							color: #777;
							text-align: center;
							margin-top: 20px;
							border-top: 1px solid #ddd;
							padding-top: 10px;
						}
					</style>
				</head>
				<body>
					<div class="print-container">
						<h3>Sales Report</h3>
						<div class="sales-date">${new Date().toLocaleDateString()}</div>
						${chartElement.innerHTML}
						<div class="footer-note">Generated on ${new Date().toLocaleString()}</div>
					</div>
				</body>
			</html>
		`);
			printWindow.document.close();
			printWindow.focus();
			printWindow.print();
			printWindow.close();
		}
	};

	return (
		<div className="sales-dashboard">
			<Card style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box' }}>
				{/* Print Button */}
				<div 
					className="print-sales" 
					onClick={handlePrint}
				>
					PRINT
				</div>

				<h3>Sales</h3>
				<div>{currentDate}</div>
				{(!summary.dailyOrders || summary.dailyOrders.length === 0) ? (
					<MessageBox>No Sales</MessageBox>
				) : (
					<Chart
						width="100%"
						height="100%"
						chartType="AreaChart"
						loader={<div>Loading Chart...</div>}
						data={chartData[view]}
						options={chartOptions}
					/>
				)}
			</Card>
		</div>
	);
};

const CategoriesChart = ({ summary }) => {
	const totalProducts = summary.productCategories.reduce((acc, category) => acc + category.count, 0);

	return (
		<>
			{!summary.productCategories || summary.productCategories.length === 0 ? (
				<MessageBox>No Categories</MessageBox>
			) : (
				<div className="category-dashboard">
					{summary.productCategories.slice(0, 6).map((category) => {
						const percentage = totalProducts ? (category.count / totalProducts) * 100 : 0;
						return (
							<div className="category-container">
								<span>{category._id}</span>
								<span><strong>{percentage.toFixed(1)}%</strong></span>
								<div className="bar">
									<div style={{  backgroundColor: '#F15A4A', height: '100%', width: `${percentage}%` }} />
									<div style={{ flex: 1, backgroundColor: '#333', height: '100%', width: `${100-percentage}%` }} />                 
								</div>
							</div>
						)
					})}
				</div>
			)}
		</>
	);
};

const reducer = (state, action) => {

		switch (action.type) {
				case 'FETCH_REQUEST':
						return {...state, loading: true};
				case 'FETCH_SUCCESS':
						return {...state, 
								summary: action.payload,
								loading: false
						};
				case 'FETCH_FAIL':
						return {...state, loading: false, error: action.payload};
				default:
						return state;
		}
}

function DashboardScreen () {
		const [{loading, summary, error}, dispatch] = useReducer(reducer, {
				loading: true,
				error: '',
		})
		const {state} = useContext(Store);
		const {userInfo} = state;

		// useEffect(() => {
		//     const fetchData = async () => {
		//       try {
		//         const { data } = await axios.get('/api/orders/summary', {
		//           headers: { Authorization: `Bearer ${userInfo.token}` },
		//         });
		//         dispatch({ type: 'FETCH_SUCCESS', payload: data });
		//       } catch (err) {
		//         dispatch({
		//           type: 'FETCH_FAIL',
		//           payload: getError(err),
		//         });
		//       }
		//     };
		//     fetchData();
		//   }, [userInfo]);

		useEffect(() => {
		const fetchData = async () => {
				try {
				const { data } = await axios.get('/api/orders/summary', {
				    headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
				// dispatch({ type: 'FETCH_SUCCESS', payload: sampleOrder });
				} catch (err) {
				dispatch({
						type: 'FETCH_FAIL',
						payload: getError(err),
				});
				}
		};
		fetchData();
		}, [userInfo]);

	return (
		<div>
			{loading
				? (<LoadingBox/>)
				: error
						? (<MessageBox variant='danger'>{error}</MessageBox>)
						: (
								<div className="dashboard-container">
								{/*<Row>
												<Col md={4}>

														<Card>
																<Card.Body>
																		<Card.Title>
																				{summary.users && summary.users[0]
																						? summary.users[0].numUsers
																						: 0}
																		</Card.Title>
																		<Card.Text>USERS</Card.Text>
																</Card.Body>
														</Card>
												</Col>


												<Col md={4}>
														<Card>
																<Card.Body>
																		<Card.Title>
																		{summary.orders && summary.users[0]
																						? summary.orders[0].numOrders
																						: 0}
																		</Card.Title>
																		<Card.Text>Orders</Card.Text>
																</Card.Body>
														</Card>
												</Col>

												<Col md={4}>
														<Card>
																<Card.Body>
																		<Card.Title> ₱
																		{summary.orders && summary.users[0]
																						? summary.orders[0].totalSales.toFixed(2)
																						: 0}
																		</Card.Title>
																		<Card.Text>Total Sales</Card.Text>
																</Card.Body>
														</Card>
												</Col>
										</Row>*/}
										<TopDashboard summary={summary} />
										<SalesChart summary={summary}/>
										<CategoriesChart summary={summary} />

										{/*<div className="my-3">
											<h2>Categories</h2>
											{!summaryCategory.productCategories || summaryCategory.productCategories.length === 0 ? (
												<MessageBox>No Categories</MessageBox>
											) : (
												<Chart
													width="100%"
													height="400px"
													chartType="PieChart"
													loader={<div>Loading Chart...</div>}
													data={[
														['Categories', 'Products'],
														...summaryCategory.productCategories.map((x) => [x._id, x.count]),
													]}
												/>
											)}
										</div>*/}

										{/*<div className="my-3">
												<h2>Categories</h2>
										{summary.productCategories || summary.productCategories.length === 0
												? (<MessageBox>No Categories</MessageBox>)
												: (
														<Chart
																width="100%"
																height="400px"
																chartType='PieChart'
																loader={<div>Loading Chart...</div>}
																data={[
																		['Categories', 'Products'],
																		...summary.productCategories.map((x) => [x._id, x.count]),
																]}></Chart>
												)}
										</div>*/}
								</div> )
						
			}
		</div>
	)
}

export default DashboardScreen;
