import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";


const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
  const [productsPerPage] = useState(18);  // Số lượng sản phẩm trên mỗi trang

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(lowerCaseQuery)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ display: "flex", gap: "8px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === 0 ? "slick-active bg-blue-500" : "bg-gray-300"
          }`}
      />
    ),
  };


  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} rounded-full p-5 cursor-pointer`}
        style={{
          display: "block",
          right: "2%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} rounded-full p-5 cursor-pointer`}
        style={{
          display: "block",
          left: "0.8%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
        onClick={onClick}
      />
    );
  }

  const saleProducts = [
    {
      id: 1,
      name: "Sữa rửa mặt Transino Clear Wash EX",
      price: 415000,
      oldPrice: 500000,
      discount: 17,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00503585_sua_rua_mat_duong_trang_da_tri_nam_transino_clear_wash_ex_100g_5357_6411_large_6253370bb6.jpg",
      soldInfo: "Mở bán 30 suất",
    },
    {
      id: 2,
      name: "Khử mùi dạng xịt Etiaxil Deodorant Anti",
      price: 240000,
      oldPrice: 290000,
      discount: 17,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_06058_3c56e48f6b.jpg",
      soldInfo: "Mở bán 30 suất",
    },
    {
      id: 3,
      name: "Kem dưỡng ẩm Cetaphil Moisturizing Cream",
      price: 190900,
      oldPrice: 230000,
      discount: 17,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/052408_Cetaphil_US_Moisturizing_Cream_3oz_CLEAR_pack_2a5072c450.png",
      soldInfo: "Mở bán 30 suất",
    },
    {
      id: 4,
      name: "Sữa tăng cân Appeton Weight Gain",
      price: 922500,
      oldPrice: 1025000,
      discount: 10,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_04209_5816b3a584.jpg",
      soldInfo: "Đã bán 1/100 suất",
    },
    {
      id: 5,
      name: "Viên uống BiogastrolIBS BiovaGen",
      price: 524000,
      oldPrice: 655000,
      discount: 20,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_04798_c7a03c49df.jpg",
      soldInfo: "Mở bán 100 suất",
    },
    {
      id: 6,
      name: "Sữa bột Nepro 1 Gold VitaDairy",
      price: 193600,
      oldPrice: 242000,
      discount: 20,
      image:
        "https://cdn.nhathuoclongchau.com.vn/unsafe/144x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00016524_nepro_1_gold_400g_5081_5e78_large_17ca9ce857.JPG",
      soldInfo: "Mở bán 100 suất",
    },
  ];

  const handleAddToCart = (product) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      unit: product.unit || "sản phẩm",
      image: JSON.parse(product.images)[0],
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find((item) => item.id === productToAdd.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      existingCart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Slider bên trái và ảnh bên phải */}
      <div className="bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Slider bên trái */}
          <div className="col-span-2 relative">
            <Slider {...settings}>
              <div className="rounded-xl">
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/banner_web_pc_1610x492_313aeadd9c.jpg"
                  alt="Slide 1"
                  className="rounded-xl w-full h-auto"
                />
              </div>
              <div>
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Camp2025_Vitabiotic_Homepage_PC_c77d008037.jpg"
                  alt="Slide 2"
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div>
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/BANNER_WEB_Banner_Web_PC_1610x492_6be326ba69.jpg"
                  alt="Slide 3"
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div>
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_0e7e346a33.png"
                  alt="Slide 3"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </Slider>
          </div>

          {/* Hai ảnh bên phải */}
          <div className="flex flex-col gap-4">
            <div>
              <img
                src="https://cdn.nhathuoclongchau.com.vn/unsafe/425x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/399x117_49d70d4809_1dbe50dd49.png"
                alt="Banner phải trên"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <img
                src="https://cdn.nhathuoclongchau.com.vn/unsafe/425x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/PC_3d7805381e.png"
                alt="Banner phải dưới"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phần các ô thông tin */}
      <div className="bg-gray-100">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 cursor-pointer">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/canmuathuoc_29bf521996.png"
              alt="Cần mua thuốc"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">Cần mua thuốc</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/tuvanvoiduocsi_1855320b40.png"
              alt="Tư vấn với Dược Sỹ"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">
              Tư vấn với Dược Sỹ
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/timnhathuoc_cbadb52c85.png"
              alt="Tìm nhà thuốc"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">Tìm nhà thuốc</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/doncuatoi_5058ac6058.png"
              alt="Đơn của tôi"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">Đơn của tôi</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/vaccine_013e37b079.png"
              alt="Tiêm Vắc xin"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">Tiêm Vắc xin</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/kiemtrasuckhoe_15f6ff48e9.png"
              alt="Kiểm tra sức khoẻ"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-bold text-gray-700">
              Kiểm tra sức khoẻ
            </span>
          </div>
        </div>
      </div>

      {/* Banner flashsale */}
      <div className="container mx-auto">
        <div className="w-full mt-14">
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/1280x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Flashsale_Banner_HP_Desk_1216x190_HP_8b205e2047.png"
            alt="Banner chính"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>

      {/* Phần Sản phẩm Sale */}
      <div className=" w-full py-8">
        <div className="container mx-auto">
          {/* Flash Sale Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-6">
            {saleProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-3xl bg-gray-50 p-4 shadow-md hover:shadow-lg transition hover:border-blue-600 relative min-h-[450px] flex flex-col"
              >
                {/* Ảnh sản phẩm */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded"
                  />
                  <span
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-tr-2xl rounded-bl-2xl"
                  >
                    -{product.discount}%
                  </span>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="mt-4 flex flex-col flex-grow">
                  <h3
                    className="overflow-hidden text-gray-10 text-body2 font-semibold line-clamp-2 md:line-clamp-3 mb-1 md:mb-2 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-lg">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                  <p className="text-gray-400 line-through text-sm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.oldPrice)}
                  </p>

                  {/* Đã bán X/Y suất */}
                  <div className="flex items-center mt-2 whitespace-nowrap">
                    <div className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full flex items-center">
                      <span className="mr-1 text-orange-500">
                        <i className="fas fa-fire"></i>
                      </span>
                      Đã bán {product.soldInfo}
                    </div>
                  </div>

                  {/* Nút chọn mua */}
                  <button
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-3xl mt-4 w-full font-medium hover:bg-blue-600 transition"
                    onClick={() => alert("Chức năng thêm vào giỏ hàng đang cập nhật")}
                  >
                    Chọn mua
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Danh sách sản phẩm */}
      <div className="bg-blue-100 w-full my-8">
        {/* Container giữ nội dung chính */}
        <div className="container mx-auto">
          <div className="relative text-center py-6">
            {/* Hình ảnh tiêu đề */}
            <img
              alt="Sản phẩm bán chạy"
              loading="lazy"
              width="320"
              height="40"
              decoding="async"
              className="w-[320px] absolute top-[-10px] left-1/2 transform -translate-x-1/2"
              srcSet="https://cdn.nhathuoclongchau.com.vn/unsafe/320x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/tittle_san_pham_ban_chay_16118bb601.png 1x, https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/tittle_san_pham_ban_chay_16118bb601.png 2x"
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/tittle_san_pham_ban_chay_16118bb601.png"
              style={{ color: "transparent" }}
            />
            {/* Chữ hiển thị lên ảnh */}
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[-5px] text-white text-lg font-bold">
              Sản phẩm bán chạy
            </span>
          </div>

          {/* Lưới sản phẩm */}
          <div className="grid grid-cols-6 gap-4 mt-8">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-3xl bg-white p-4 shadow-md hover:shadow-lg transition hover:border-blue-600"
              >
                {/* Ảnh sản phẩm */}
                <div className="relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={JSON.parse(product.images)[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="mt-4">
                  <h3
                    className="overflow-hidden text-gray-10 text-body2 font-semibold line-clamp-2 md:line-clamp-3 mb-1 md:mb-2 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-blue-500 font-semibold text-lg mt-2">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                  <p className="text-caption font-normal text-gray-400 line-through md:text-label2">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.oldPrice || product.price * 1.2)}
                  </p>
                  <p className="text-orange-500 text-xs mt-2">{product.soldInfo}</p>
                  {/* Đã bán X/Y suất */}
                  <div className="flex items-center mt-2 whitespace-nowrap">
                    <div className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full flex items-center">
                      <span className="mr-1 text-orange-500">
                        <i className="fas fa-fire"></i>
                      </span>
                      Đã bán hơn 1000 sản phẩm
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-3xl mt-4 w-full font-medium hover:bg-blue-600 transition"
                    onClick={() => handleAddToCart(product)}
                  >
                    Chọn mua
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`mx-1 px-4 py-2 rounded-full ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            >
              {number}
            </button>
          ))}
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

        {/* Thương hiệu yêu thích */}
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
    </div >
  );
};

export default Home;
