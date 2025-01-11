import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/orders");
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (time, newStatus) => {
    try {
      // Lấy tất cả các ID của đơn hàng trong cùng thời gian
      const orderIds = groupedOrders[time].products.map((product) => product.id);

      // Gửi yêu cầu cập nhật trạng thái cho tất cả các sản phẩm trong đơn hàng
      await Promise.all(
        orderIds.map(async (id) => {
          await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });
        })
      );

      // Cập nhật trạng thái trong frontend
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.created_at === time ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Nhóm các sản phẩm theo thời gian đầy đủ `created_at`
  const groupedOrders = orders.reduce((acc, order) => {
    const orderTime = order.created_at; // Nhóm theo thời gian đầy đủ
    if (!acc[orderTime]) {
      acc[orderTime] = {
        created_at: order.created_at,
        user_name: order.user_name,
        user_phone: order.user_phone,
        user_address: order.user_address,
        status: order.status,
        total_price: 0,
        total_quantity: 0, // Tổng số sản phẩm
        products: [],
      };
    }
    acc[orderTime].products.push({
      id: order.id,
      product_name: order.product_name,
      quantity: order.quantity,
      total_price: order.total_price,
    });
    acc[orderTime].total_price += parseFloat(order.total_price);
    acc[orderTime].total_quantity += order.quantity; // Cộng tổng số sản phẩm
    return acc;
  }, {});

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      {Object.keys(groupedOrders).length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        Object.values(groupedOrders).map((order, index) => (
          <div
            key={index}
            className="mb-8 border border-gray-300 rounded-lg p-4 shadow-lg bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-4">
              Thời gian: {new Date(order.created_at).toLocaleString("en-GB")}
            </h2>
            <div className="mb-4">
              <p className="text-lg text-gray-700">
                <strong>Tên khách hàng:</strong> {order.user_name}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Số điện thoại:</strong> {order.user_phone}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Địa chỉ:</strong> {order.user_address}
              </p>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Tổng giá trị đơn hàng: {formatPrice(order.total_price)}
            </h3>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Tổng số sản phẩm: {order.total_quantity}
            </h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-4 px-6 border-b text-center whitespace-normal">
                    Sản phẩm
                  </th>
                  <th className="py-4 px-6 border-b text-center">Số lượng</th>
                  <th className="py-4 px-6 border-b text-center">Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6 border-b text-center whitespace-normal break-words">
                      {product.product_name}
                    </td>
                    <td className="py-4 px-6 border-b text-center">{product.quantity}</td>
                    <td className="py-4 px-6 border-b text-center">
                      {formatPrice(product.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <label htmlFor={`status-${index}`} className="mr-4 font-semibold">
                  Trạng thái:
                </label>
                <select
                  id={`status-${index}`}
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.created_at, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Chưa nhận hàng">Chưa nhận hàng</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <button
                onClick={() => updateOrderStatus(order.created_at, "Đã giao hàng")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Đánh dấu đã giao
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
