# Buổi 6: Kiến trúc Hybrid & Tối ưu Swagger API
**Sinh viên thực hiện:** Nguyễn Phi Hùng (2123110475)

## 🎯 Nội dung công việc hoàn thành:
- Xử lý thành công lỗi xung đột định tuyến (Lỗi 500) giữa mô hình MVC (Admin) và Web API.
- Cấu hình "bùa tàng hình" `[ApiExplorerSettings(IgnoreApi = true)]` để bảo vệ các Controller của Admin khỏi máy quét của Swagger.
- Hoàn thiện cổng cung cấp dữ liệu RESTful `PostsApiController`, trả về JSON chuẩn, lọc bớt các trường không cần thiết để tối ưu băng thông.
