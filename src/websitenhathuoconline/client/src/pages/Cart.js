import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";


const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const selectedCount = checkedItems.filter((item) => item === true).length;


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(storedCart);
    setCart(storedCart);
    setCheckedItems(new Array(storedCart.length).fill(true));
  }, []);


  const handleIncrease = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrease = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setCheckedItems(checkedItems.filter((_, i) => i !== index)); // Xóa trạng thái checkbox
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index]; // Đảo ngược trạng thái
    setCheckedItems(updatedCheckedItems);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setCheckedItems(new Array(cart.length).fill(isChecked));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item, index) => {
      if (checkedItems[index]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const isAllSelected = checkedItems.every((item) => item === true);

  const handlePurchase = async () => {
    const userId = 1; // ID người dùng (giả định)
    const products = cart
      .filter((_, index) => checkedItems[index])
      .map((item) => {
        if (!item.id) {
          console.error("Product ID is missing for item:", item);
          return null;
        }
        return {
          product_id: item.id, // Đảm bảo gửi đúng `product_id`
          quantity: item.quantity,
          price: item.price,
        };
      })
      .filter((product) => product !== null); // Chỉ giữ sản phẩm hợp lệ

    const status = "Chưa nhận hàng";

    // Kiểm tra nếu không có sản phẩm nào được chọn
    if (products.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, products, status }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        alert(data.message || "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đặt hàng thất bại");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="container mx-auto my-8 px-4">

        <div className="flex items-center mb-4">
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center text-blue-600 hover:underline"
          >
            <span className="mr-2 text-xl">⭠ Tiếp tục mua sắm</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <p>Giỏ hàng trống.</p>
        ) : (
          <div className="flex gap-6">

            {/* Phần bảng giỏ hàng */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex-1">
              {/* Phần "Chọn tất cả" */}
              <div className="flex items-center gap-2 p-4 bg-white rounded-t-2xl">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-blue-600 cursor-pointer rounded-full"
                />
                <label className="text-black font-medium cursor-pointer">
                  Chọn tất cả ({selectedCount})
                </label>
              </div>

              {/* Bảng sản phẩm */}
              <table className="w-full text-left border-collapse ">
                <thead>
                  <tr className="border-b bg-white text-black">
                    <th className="py-3 px-4 border-2 text-center">

                    </th>
                    <th className="py-3 px-4 border-2 whitespace-nowrap">Hình ảnh</th>
                    <th className="py-3 px-4 border-2">Sản phẩm</th>
                    <th className="py-3 px-4 border-2 text-right whitespace-nowrap">Giá thành</th>
                    <th className="py-3 px-4 border-2 text-center whitespace-nowrap">Số lượng</th>
                    <th className="py-3 px-4 border-2 text-center whitespace-nowrap">Đơn vị</th>
                    <th className="py-3 px-4 border-2 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b cursor-pointer transition rounded-b-2xlduration-100 hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-white"
                        }`}
                    >
                      {/* Cột checkbox từng mục */}
                      <td className="py-5 px-5 text-center border-2">
                        <input
                          type="checkbox"
                          checked={checkedItems[index]}
                          onChange={() => handleCheckboxChange(index)}
                          className="w-5 h-5 cursor-pointer rounded-full"
                        />
                      </td>

                      {/* Hình ảnh sản phẩm */}
                      <td className="py-4 px-4 text-center border-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                      </td>

                      {/* Tên sản phẩm */}
                      <td className="py-4 px-4 border-2">
                        <span className="font-medium">{item.name}</span>
                      </td>

                      {/* Giá thành */}
                      <td className="py-4 px-4 border-2 text-right text-blue-600 font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </td>

                      {/* Số lượng */}
                      <td className="py-4 px-4 border-2 text-center">
                        <div className="flex items-center justify-center border rounded-full border-gray-300 overflow-hidden w-28">
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-bold"
                            onClick={() => handleDecrease(index)}
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-gray-700 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-bold"
                            onClick={() => handleIncrease(index)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Đơn vị */}
                      <td className="py-4 px-4 border-2 text-center">{item.unit}</td>

                      {/* Nút xóa */}
                      <td className="py-4 px-4 border-2 text-center ">
                        <button
                          className="text-red-500 hover:underline hover:text-red-800 transition flex items-center justify-center"
                          onClick={() => handleRemove(index)}
                        >
                          <MdDeleteOutline size={30} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* Phần bảng tổng tiền */}
            <div className="w-1/3 bg-white shadow-md rounded-2xl p-6 relative">
              <h2 className="text-lg font-bold mb-4">Áp dụng ưu đãi để được giảm giá</h2>
              <div className="border-t py-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tổng số sản phẩm</span>
                  <span className="text-gray-800 font-bold">{cart.length} sản phẩm</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tổng tiền</span>
                  <span className="text-gray-800 font-bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Giảm giá trực tiếp</span>
                  <span className="text-gray-800 font-bold">0đ</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Giảm giá voucher</span>
                  <span className="text-gray-800 font-bold">0đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Thành tiền</span>
                  <span className="text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  Phương thức thanh toán: <span className="font-semibold">Thanh toán tiền mặt khi nhận hàng</span>
                </p>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 font-semibold hover:bg-blue-600"
                onClick={handlePurchase}
              >
                Mua hàng
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
                <button className="text-blue-500 hover:underline">Điều khoản dịch vụ</button>{" "}
                và{" "}
                <button className="text-blue-500 hover:underline">
                  Chính sách xử lý dữ liệu cá nhân
                </button>{" "}
                của nhà thuốc NGUYEN ANH TUAN.
              </p>
              {/* Gợn sóng */}
              <div
                style={{
                  height: "24px",
                  backgroundColor: "white",
                  maskImage:
                    "radial-gradient(11.52px at 50% calc(100% - 15.45px), black 99%, transparent 101%) calc(50% - 20.6px) 0 / 41.2px 100%, radial-gradient(11.52px at 50% calc(100% + 5.15px), transparent 99%, black 101%) 50% calc(100% - 10.3px) / 41.2px 100% repeat-x",
                  WebkitMaskImage:
                    "radial-gradient(11.52px at 50% calc(100% - 15.45px), black 99%, transparent 101%) calc(50% - 20.6px) 0 / 41.2px 100%, radial-gradient(11.52px at 50% calc(100% + 5.15px), transparent 99%, black 101%) 50% calc(100% - 10.3px) / 41.2px 100% repeat-x",
                }}
              ></div>

            </div>

          </div>
        )}
      </div>
      {/* Phần Banner */}
      <div className="container mx-auto">
        {/* Banner chính */}
        <div className="w-full mb-4">
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/1080x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Main_Banner_Web_1216x176_a4e731ab77.png"
            alt="Banner chính"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Hai Banner phụ */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/1080x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Sub_banner_598x176_9596d676ef.png"
            alt="Banner phụ 1"
            className="w-full h-auto rounded-lg"
          />
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/1080x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Sub_banner_598x176_1_5a7e5b86a1.png"
            alt="Banner phụ 2"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      <div className="container mx-auto my-8">
        <div className="flex items-center space-x-2 mb-4">
          {/* Biểu tượng */}
          <img
            alt="Thương hiệu yêu thích"
            loading="lazy"
            width="28"
            height="28"
            decoding="async"
            className="h-7 w-7 shrink-0"
            srcSet="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png 1x, https://cdn.nhathuoclongchau.com.vn/unsafe/64x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png 2x"
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/64x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png"
            style={{ color: "transparent" }}
          />
          {/* Tiêu đề */}
          <h2 className="text-xl font-bold text-gray-800">
            <span className="text-blue-500 mr-2"></span> Thương hiệu yêu thích
          </h2>
        </div>

        {/* Lưới Thương hiệu */}
        <div className="grid grid-cols-6 gap-4">
          {[
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_03542_6bfa8a6508.jpg",
              name: "JapanWell",
              discount: "Giảm đến 35%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/Jpanwell_2_81e568c17e.png",
            },
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00015043_blood_sugar_control_60v_8171_63e1_large_851cd54510.jpg",
              name: "Vitamins For Life",
              discount: "Giảm đến 20%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Vitamins_For_Life_1_0783ec2683.png",
            },
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_01888_3d01e5bc4d.jpg",
              name: "Kenko",
              discount: "Giảm đến 20%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/brand_logo_18cc2a11e5.png",
            },
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00496_5a21af92e5.jpg",
              name: "Vitabiotics",
              discount: "Voucher giảm đến 30%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/Vitabiotics_1_8d1424372d.png",
            },
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00018993_blue_berry_plus_ojenvitamin_new_nordic_2x20v_2634_6327_large_00cb23abcf.jpg",
              name: "New Nordic",
              discount: "Giảm đến 20%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/NEW_NORDIC_1_3ef22172fd.png",
            },
            {
              logo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00502343_nuoc_hong_sam_mat_ong_kwangdong_10_chai_x_170ml_2144_63aa_large_b97c691a39.jpg",
              name: "Kwangdong",
              discount: "Giảm đến 20%",
              smallLogo: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/kwangdong_logo_f3d9212acb.png",
            },
          ].map((brand, index) => (
            <div
              key={index}
              className="border rounded-2xl p-8 bg-white text-center shadow-md hover:shadow-lg transition"
            >
              {/* Ảnh lớn */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-auto mx-auto mb-2 object-contain"
              />
              {/* Logo nhỏ */}
              <img
                src={brand.smallLogo}
                alt={`${brand.name} logo`}
                className="w-full h-auto mx-auto object-contain mt-6 border-2 rounded-lg"
              />
              <p className="text-blue-500 text-sm font-medium mt-4">{brand.discount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
