import React, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'; 
import qrCodeImage from '../../src/images/qr_code.jpg';
function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { shippingAddress, paymentMethod } } = state;

  const [paymentMethodName, setPaymentMethod] = useState('GCash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentImage, setPaymentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(''); // For handling errors

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const formatReferenceNumber = (input) => {
    // Remove non-digit characters
    const cleaned = input.replace(/\D/g, '');
  
    // Limit to 13 digits
    const limited = cleaned.slice(0, 13);
  
    // Format as '0000 000 000000'
    const formatted = limited.replace(/(\d{4})(\d{0,3})(\d{0,6})/, (match, p1, p2, p3) => {
      return `${p1}${p2 ? ' ' + p2 : ''}${p3 ? ' ' + p3 : ''}`;
    });
  
    return formatted.trim();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Check if the reference number is 13 digits
    const cleanedReferenceNumber = referenceNumber.replace(/\D/g, '');
    if (cleanedReferenceNumber.length !== 13) {
        alert('Please enter a complete 13-digit GCash reference number.');
        return;
    }

    if (!paymentImage) {
        alert('Please provide a payment screenshot.');
        return;
    }

    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append('image', paymentImage);
        formData.append('paymentMethod', paymentMethodName); 
        formData.append('referenceNumber', referenceNumber); 

        const { data } = await Axios.post('http://localhost:5000/api/uploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const uploadedPaymentImage = data.filename;

        ctxDispatch({
            type: 'SAVE_PAYMENT_METHOD',
            payload: { paymentMethodName, referenceNumber, paymentImage: uploadedPaymentImage },
        });

        localStorage.setItem(
            'paymentMethod',
            JSON.stringify({ paymentMethodName, referenceNumber, paymentImage: uploadedPaymentImage })
        );

        setTimeout(() => {
            navigate('/placeorder');
        }, 1000);
        
    } catch (error) {
        console.error('Error uploading payment image:', error);
        setError('Failed to upload payment image. Please try again.');
        setIsLoading(false);
    }
};


  const handleFileUpload = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              label="GCash"
              id="GCash"
              value="GCash"
              checked={paymentMethodName === 'GCash'}
              onChange={() => setPaymentMethod('GCash')}
            />
          </div>
          <div className="mb-3">
            <Form.Group controlId="referenceNumber">
              <Form.Label>GCash Reference Number</Form.Label>
              <Form.Control
              type="text"
              placeholder="Enter GCash reference number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(formatReferenceNumber(e.target.value))}
              required
              maxLength={16} // Set max length to account for spaces
            />
            </Form.Group>
          </div>
          <div className="mb-3">
            <Form.Group controlId="paymentImage">
              <Form.Label>Upload Payment Screenshot</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                required
              />
            </Form.Group>

          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className="mb-3">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Continue'}
            </Button>
          </div>
        </Form>
        <img 
            src={qrCodeImage} 
            alt="QR Code" 
            style={{ 
              position: 'absolute', 
              top: '170px', 
              right: '120px', 
              width: '20%',  // Adjust size as needed
              height: '60%'  // Adjust size as needed
            }} 
          />
      </div>
      
    </div>
  );
}

export default PaymentMethodScreen;
