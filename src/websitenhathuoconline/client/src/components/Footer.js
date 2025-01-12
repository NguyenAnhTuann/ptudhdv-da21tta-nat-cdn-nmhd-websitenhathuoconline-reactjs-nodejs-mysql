import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black pt-12 pb-6 mt-0 border-2">
      {/* Phần trên */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 px-4">
        {/* Cột Về Chúng Tôi */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Về Chúng Tôi</h3>
          <ul className="space-y-2 text-sm">
            <li>Giới thiệu</li>
            <li>Hệ thống cửa hàng</li>
            <li>Giấy phép kinh doanh</li>
            <li>Quy chế hoạt động</li>
            <li>Chính sách đặt cọc</li>
            <li>Chính sách đổi trả thuốc</li>
          </ul>
        </div>

        {/* Cột Danh Mục */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Danh Mục</h3>
          <ul className="space-y-2 text-sm">
            <li>Thực phẩm chức năng</li>
            <li>Dược mỹ phẩm</li>
            <li>Thuốc</li>
            <li>Chăm sóc cá nhân</li>
            <li>Trang thiết bị y tế</li>
            <li>Đặt thuốc online</li>
          </ul>
        </div>

        {/* Cột Tìm Hiểu Thêm */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Tìm Hiểu Thêm</h3>
          <ul className="space-y-2 text-sm">
            <li>Góc sức khỏe</li>
            <li>Tra cứu thuốc</li>
            <li>Tra cứu dược chất</li>
            <li>Bệnh thường gặp</li>
            <li>Bệnh viện</li>
            <li>Tin tức sự kiện</li>
          </ul>
        </div>

        {/* Cột Tổng Đài */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Tổng Đài</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Tư vấn mua hàng:</strong> 18006928 (Nhánh 1)
            </li>
            <li>
              <strong>Trung tâm Vắc xin:</strong> 18006928 (Nhánh 2)
            </li>
            <li>
              <strong>Góp ý, khiếu nại:</strong> 18006928 (Nhánh 3)
            </li>
          </ul>
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2 uppercase">Chứng Nhận Bởi</h3>
            <div className="flex items-center space-x-4">
              <img src="https://cdn1.nhathuoclongchau.com.vn/bo_cong_thuong_a8e5750f57.svg" alt="DMCA Protected" className="h-8" />
              <img src="https://cdn1.nhathuoclongchau.com.vn/smalls/DMCA_1_1f84305343.svg" alt="Secure" className="h-8" />
            </div>
          </div>
        </div>

        {/* Cột Kết Nối */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Kết Nối Với Chúng Tôi</h3>
          <div className="flex space-x-4 mb-4">
            {/* Icon Facebook */}
            <a
              href="https://www.facebook.com/NguyenAnhTuxn"
              className="text-blue-500 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn1.nhathuoclongchau.com.vn/smalls/facebook_logo_3152b9bb16.svg"
                alt="Facebook"
                className="w-6 h-6"
              />
            </a>

            {/* Icon Zalo */}
            <a
              href="https://zalo.me/0869094929"
              className="text-blue-500 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn1.nhathuoclongchau.com.vn/smalls/Logo_Zalo_979d41d52b.svg"
                alt="Zalo"
                className="w-6 h-6"
              />
            </a>
          </div>

          <h3 className="text-lg font-bold mb-4 uppercase whitespace-nowrap">
            Tải App Nhà Thuốc NGUYEN ANH TUAN
          </h3>
          <div className="w-24 h-24">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/128x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/QR_100x100_3x_1b3ed147f3.png"
              alt="QR Code"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Hỗ Trợ Thanh Toán */}
      <div className="mt-8 pt-4 text-center">
        <h3 className="text-lg font-bold mb-4 uppercase">Hỗ Trợ Thanh Toán</h3>
        <div className="flex justify-center space-x-4">
          <div className="flex justify-center space-x-4">
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/visa_fdc3324c35.svg"
              alt="Visa"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/mtc_1ed684ff7c.svg"
              alt="Mastercard"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/zalopay_884e503cf9.svg"
              alt="MoMo"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/smalls/momo_ebbd8eb9b0.svg"
              alt="ZaloPay"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/jcb_7655e615ce.svg"
              alt="JCB"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/amex_2610a984a5.svg"
              alt="American Express"
              className="h-8 border-2 rounded-lg"
            />
            <img
              src="https://cdn1.nhathuoclongchau.com.vn/smalls/vnpay_1f73f546c4.svg"
              alt="VNPay"
              className="h-8 border-2 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Phần Dưới */}
      <div className="border-t border-gray-200 mt-8 pt-4 text-sm text-center">
        <p>
          © 2007 - 2025 Công Ty Cổ Phần Dược Phẩm NGUYEN ANH TUAN. Tất cả các quyền được bảo lưu.
        </p>
        <p>
          Địa chỉ: 126 Nguyễn Thiện Thanh, P.5, H.Châu Thành, TP. Trà Vinh | Số điện thoại: 0869094929
        </p>
        <p>Email: nguyenanhtuan.profile@gmail.com</p>
      </div>
    </footer>
  );
};

export default Footer;
