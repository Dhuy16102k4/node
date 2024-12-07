import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount, formatPrice, createOrder, cartItems } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    paymentMethod: 'Cash',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu giỏ hàng trống
    if (Object.keys(cartItems).length === 0) {
      setError('Giỏ hàng của bạn đang trống!');
      return;
    }

    // Tạo dữ liệu đơn hàng
    const orderData = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      products: Object.values(cartItems).map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: getTotalCartAmount() + 25000, // Thêm phí vận chuyển (giả sử là 25,000 VND)
    };

    try {
      await createOrder(orderData);
      setFormData({ name: '', email: '', address: '', phone: '', paymentMethod: 'Cash' }); // Reset form sau khi gửi đơn hàng
      setError(''); // Reset lỗi nếu có
    } catch (err) {
      setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
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
            <p>Total</p>
            <p>{formatPrice(getTotalCartAmount() + 25000)}</p>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
};

export default PlaceOrder;
