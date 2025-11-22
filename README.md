# ADMINI

**Admini** là một ứng dụng mã nguồn mở gọn nhẹ, giúp bạn xây dựng nhanh chóng trang quản lý dành cho quản trị viên. Với giao diện kéo & thả trực quan và khả năng tích hợp các API của bạn, Admini giúp đơn giản hóa quy trình tạo dashboard quản lý mà không cần code phức tạp.

## Tính năng nổi bật

*   **Kéo & Thả (Drag & Drop):** Thiết kế giao diện trang quản trị dễ dàng bằng cách kéo thả các thành phần.
*   **Tích hợp API:** Kết nối trực tiếp với các API hệ thống của bạn để hiển thị và quản lý dữ liệu.
*   **Quản lý linh hoạt:** Hỗ trợ nhiều loại giao diện như bảng dữ liệu (table), biểu mẫu (form), và trang chi tiết.
*   **Gọn nhẹ & Nhanh chóng:** Được tối ưu hóa để triển khai nhanh và hoạt động mượt mà.

## Hướng dẫn cài đặt và triển khai

Admini được đóng gói dưới dạng Docker image, giúp bạn dễ dàng triển khai trên bất kỳ môi trường nào hỗ trợ Docker.

### Yêu cầu

*   [Docker](https://www.docker.com/) đã được cài đặt trên máy của bạn.

### 1. Build Docker Image

Đầu tiên, bạn cần tải mã nguồn về và build Docker image từ source code.

Mở terminal tại thư mục gốc của dự án và chạy lệnh sau:

```bash
docker build -t admini-app .
```

Lệnh này sẽ tạo ra một docker image có tên là `admini-app`. Quá trình này có thể mất vài phút tùy thuộc vào tốc độ mạng và cấu hình máy của bạn.

### 2. Triển khai với Docker

Sau khi build thành công, bạn có thể chạy ứng dụng bằng lệnh `docker run`.

**Lưu ý quan trọng:** Bạn cần thiết lập 2 biến môi trường `ADMINI_ADMIN_USERNAME` và `ADMINI_ADMIN_PASSWORD`. Đây là tài khoản dùng để đăng nhập vào trang thiết kế/quản trị của Admini. Tài khoản admin mặc định của Admini là "admini" và mật khẩu là "admini".

```bash
docker run -d -p 3000:3000 \
  -e ADMINI_ADMIN_USERNAME=admin \
  -e ADMINI_ADMIN_PASSWORD=your_secure_password \
  --name admini-container \
  admini-app
```

Sau khi container khởi động, bạn có thể truy cập ứng dụng tại địa chỉ: `http://localhost:3000`.

### 3. Triển khai với Docker Compose (Khuyên dùng)

Để quản lý cấu hình dễ dàng hơn, bạn nên sử dụng Docker Compose. Dưới đây là file mẫu `docker-compose.yml`.

Tạo file `docker-compose.yml` với nội dung sau:

```yaml
version: '3'

services:
  admini:
    image: admini-app
    container_name: admini-container
    ports:
      - "3000:3000"
    environment:
      - ADMINI_ADMIN_USERNAME=admin
      - ADMINI_ADMIN_PASSWORD=your_secure_password
    restart: unless-stopped
```

Sau đó, khởi chạy ứng dụng bằng lệnh:

```bash
docker-compose up -d
```

## Báo lỗi và đóng góp

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng hoặc muốn đóng góp ý kiến, vui lòng tạo **Issue** trên GitHub repository của dự án.

Khi tạo issue, vui lòng cung cấp:
1.  Mô tả chi tiết vấn đề bạn gặp phải.
2.  Các bước để tái hiện lỗi (nếu có).
3.  Thông tin môi trường (hệ điều hành, phiên bản Docker, v.v.).

## Giấy phép

Dự án này được phân phối dưới giấy phép **MIT**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.
