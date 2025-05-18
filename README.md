Node js

### Bài1: tổ chức thư mục và cài các thư viện cần thiết
- nodemon
- express
- add gitignore
- tạo file app.js
- morgan: hiểu đơn giản là một thư viện báo log (đọc thêm ở link sau: https://expressjs.com/en/resources/middleware/morgan.html)
    + app.use(morgan("compile"));
    + app.use(morgan("common"));
    + app.use(morgan("short"));
    + app.use(morgan("tiny"));
- helmet: là một thư viện bảo vệ những thông tin nhạy cảm ở phần header của gói tin. (đọc thêm ở link sau: https://helmetjs.github.io/)
- compression: Nén dữ liệu gói tin khi gửi giúp làm giảm băng thông làm tăng tốc độ (đọc thêm ở link sau: https://github.com/expressjs/compression)
----------------------------------------------------------------------------
### Bài2: Kết nối mongodb (doc thêm tài liệu ở đây: https://mongoosejs.com/docs/index.html).
- Cài đặt mongodb trên trang chủ mongodb và start server.
- Cài đặt mongo compass
- Thực hiện connect
- Đọc thêm tài liệu của mongodb (https://www.mongodb.com/docs/manual/core/document/)
- Config check number of connection or over connection to db;
- Có nên đống connect không: không nhất thiết phải đóng kết nối vì mongodb theo 1 nhóm kết nối.
- PoolSize
-----------------------------------------------------------------------------------
### Bài3: Add env file.

----------------------------------------------------------
### Bài4: Viết SignUp api.
- Đọc thêm tài liệu về mongoose nha
- Install mongoose
- tạo model shop
- viết service

### Bài5: create custom dynamic middleware for api key

### Bài10: Khi bị attacker chiếm lấy refresh token thì backend nên xử lí như thế nào.