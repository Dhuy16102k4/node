import React, { useContext, useState } from 'react';
import './PlaceOrder.css'; // Ensure you have updated this file
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';  // Updated import for React Router v6

const PlaceOrder = () => {
  const { getTotalCartAmount, formatPrice, createOrder, cartItems, applyVoucher, voucher } = useContext(StoreContext);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    paymentMethod: 'Cash',
    voucherCode: '', // Include voucherCode in form
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle voucher code
  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      applyVoucher(voucherCode)
        .catch((err) => setVoucherError('Failed to apply voucher.'));
    } else {
      setVoucherError('Please enter a voucher code.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (name === "voucherCode") {
      setVoucherCode(value); // Update voucherCode directly on change
      setVoucherError(''); // Reset error when user starts typing a new voucher code
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if cart is empty
    if (Object.keys(cartItems).length === 0) {
      setError('Your cart is empty!');
      return;
    }

    // Set loading state for order processing
    setIsLoading(true);

    // Calculate total price before and after applying voucher
    let totalPrice = getTotalCartAmount() + 25000; // Adding shipping fee (25,000 VND)

    if (voucher) {
      if (voucher.discountType === 'percentage') {
        totalPrice -= (totalPrice * voucher.discountValue / 100);
      } else if (voucher.discountType === 'fixed') {
        totalPrice -= voucher.discountValue;
      }
    }

    // Create order data
    const orderData = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      voucherCode: formData.voucherCode, // Include voucherCode in the order
      products: Object.values(cartItems).map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalPrice, // Use calculated total price with voucher
    };

    try {
      await createOrder(orderData);
      setFormData({ name: '', email: '', address: '', phone: '', paymentMethod: 'Cash', voucherCode: '' }); // Reset form
      setError(''); // Reset error
      navigate('/order-success'); // Redirect to success page
    } catch (err) {
      setError('There was an error while placing the order. Please try again!');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            name="name"
            value={formData.name}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            name="email"
            value={formData.email}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Address"
            onChange={handleChange}
            name="address"
            value={formData.address}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            placeholder="Phone"
            onChange={handleChange}
            name="phone"
            value={formData.phone}
            required
          />
        </div>
        <select onChange={handleChange} name="paymentMethod" value={formData.paymentMethod}>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
        <div className="voucher-field">
          <input
            type="text"
            placeholder="Voucher Code"
            onChange={handleChange}
            name="voucherCode"
            value={formData.voucherCode}
          />
          <button type="button" onClick={handleApplyVoucher}>Apply Voucher</button>
          {voucherError && <p className="error">{voucherError}</p>}
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{formatPrice(getTotalCartAmount())}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{formatPrice(25000)}</p>
          </div>
          <div className="cart-total-details">
            {voucher ? (
              <>
                <p className="old-price">{formatPrice(getTotalCartAmount() + 25000)}</p>
                <p className="new-price">{formatPrice(getTotalCartAmount() + 25000 - (voucher.discountType === 'percentage' ? (getTotalCartAmount() * voucher.discountValue / 100) : voucher.discountValue))}</p>
              </>
            ) : (
              <p>Total: {formatPrice(getTotalCartAmount() + 25000)}</p>
            )}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Waiting...' : 'PROCEED TO PAYMENT'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
};

export default PlaceOrder;
