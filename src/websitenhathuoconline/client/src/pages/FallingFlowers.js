import { useEffect } from 'react';

const FallingFlowers = () => {
  useEffect(() => {
    const container = document.getElementById('falling-flowers');

    // Danh sách 6 hình ảnh hoa
    const flowerImages = [
      "https://res.cloudinary.com/duk8odqun/image/upload/v1736620631/image-Photoroom_31_5_ogjzib.png",
      "https://res.cloudinary.com/duk8odqun/image/upload/v1736620615/image-Photoroom_31_3_qvwwtb.png",
      "https://res.cloudinary.com/duk8odqun/image/upload/v1736620615/image-Photoroom_31_4_a5nyu3.png",
      "https://res.cloudinary.com/duk8odqun/image/upload/v1736620615/image-Photoroom_31_2_o4s4ke.png",
      "https://res.cloudinary.com/duk8odqun/image/upload/v1736620614/image-Photoroom_31_1_wehiq3.png",
    ];

    const createFlower = () => {
      const flower = document.createElement('div');
      flower.classList.add(
        'absolute',
        'w-6',
        'h-6',
        'bg-contain',
        'bg-no-repeat',
        'animate-fall'
      );

      const startX = Math.random() * 100;
      const startY = Math.random() * -50 - 10;

      // Tạo giá trị ngẫu nhiên cho thời gian và hướng rơi
      const duration = Math.random() * 7 + 10; // Thời gian rơi (10-17s)
      const rotation = Math.random() * 360; // Góc xoay ban đầu

      flower.style.left = `${startX}vw`;
      flower.style.top = `${startY}vh`;

      // Gán giá trị biến CSS để mỗi cánh hoa khác nhau
      flower.style.setProperty('--fall-duration', `${duration}s`);
      flower.style.setProperty('--fall-delay', `0s`); // Không có delay
      flower.style.setProperty('--fall-rotation', `${rotation}deg`);

      // Chọn ngẫu nhiên một hình ảnh hoa
      const randomImage = flowerImages[Math.floor(Math.random() * flowerImages.length)];
      flower.style.backgroundImage = `url('${randomImage}')`;

      container.appendChild(flower);

      setTimeout(() => {
        flower.remove();
      }, duration * 1000); // Không có delay, chỉ dựa vào thời gian rơi
    };

    // Tạo hoa ngay lập tức và không có độ trễ
    for (let i = 0; i < 10; i++) { // Số lượng hoa ngay lập tức
      createFlower();
    }

    // Tạo cánh hoa liên tục sau đó
    const interval = setInterval(createFlower, 400);

    return () => clearInterval(interval); // Dọn dẹp khi component bị unmount
  }, []);

  return null;
};

export default FallingFlowers;