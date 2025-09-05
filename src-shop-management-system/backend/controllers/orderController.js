import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) { // Fix: Require fields
      return res.status(400).json({ message: "Vui lòng cung cấp địa chỉ giao hàng và phương thức thanh toán" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      total,
      status: "pending",
      shippingAddress,  
      paymentMethod,   
    });

    const createdOrder = await order.save();
    await Cart.findOneAndDelete({ userId }); // clear cart
    console.log(`Created order ${createdOrder._id} for user ${userId}`); // Logging

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(`Create order error for user ${req.user._id}:`, error);
    res.status(400).json({ message: error.message });
  }
};

