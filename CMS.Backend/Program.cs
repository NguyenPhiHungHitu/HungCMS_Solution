// ==========================================================
// Họ và tên sinh viên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// Chức năng: Cấu hình luồng chạy hệ thống (Buổi 7 - Chuẩn hóa CORS)
// Version: 1.1 (Đã fix lỗi trùng lặp và xung đột CORS)
// ==========================================================

using Microsoft.EntityFrameworkCore;
using CMS.Data;

var builder = WebApplication.CreateBuilder(args);

// =======================================================
// PHẦN 1: ĐĂNG KÝ DỊCH VỤ (SERVICES)
// =======================================================

// Fix lỗi vòng lặp tuần hoàn khi sinh dữ liệu JSON cho Web API (Buổi 6)
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Cấu hình hiển thị tài liệu Swagger UI (Buổi 6)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CHUẨN HÓA CORS: Tạo 1 chính sách duy nhất cho ReactJS kết nối an toàn
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.WithOrigins("http://localhost:3000") // Chỉ định đích danh Port chạy của ReactJS
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Bắt buộc phải có để đi kèm với cơ chế bảo mật Cookie bên dưới
    });
});

// Kích hoạt dịch vụ Đăng nhập bằng Cookie bảo mật (Buổi 5)
builder.Services.AddAuthentication("CMSAuthCookie")
    .AddCookie("CMSAuthCookie", options =>
    {
        options.Cookie.Name = "CMS_LoginCookie"; // Tên cookie lưu trên trình duyệt
        options.LoginPath = "/Auth/Login"; // Đường dẫn bị đẩy về nếu chưa đăng nhập
        options.AccessDeniedPath = "/Auth/AccessDenied"; // Đường dẫn báo lỗi nếu không đủ quyền
        options.ExpireTimeSpan = TimeSpan.FromDays(1); // Thời gian sống của Cookie là 1 ngày
    });

// Đăng ký DbContext kết nối SQL Server thông qua chuỗi kết nối DefaultConnection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// =======================================================
// PHẦN 2: BUILD APP VÀ CẤU HÌNH LUỒNG CHẠY (MIDDLEWARE)
// =======================================================
var app = builder.Build();

// Middleware ghi log lỗi toàn cục để tìm nguyên nhân sập web vật lý
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        try
        {
            System.IO.File.AppendAllText(@"c:\!Disk D\NguyenPhiHung_ASP\HungCMS_Solution\global_errors.txt", $"\n[{DateTime.Now}] GLOBAL EXCEPTION: {ex.ToString()}");
        }
        catch { }
        throw;
    }
});

// Cấu hình Middleware Swagger (Chỉ hiển thị khi đang môi trường phát triển code)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS Web API v1");
        c.RoutePrefix = "swagger"; // Đường dẫn truy cập sẽ là /swagger
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Cho phép truy cập thư mục file tĩnh wwwroot (Ảnh bài viết, ảnh sản phẩm)

app.UseRouting();

// ĐÃ SỬA: Chỉ gọi duy nhất 1 lần chính sách AllowReactApp nằm TRƯỚC Authentication
app.UseCors("AllowReactApp");

app.UseAuthentication(); // Xác thực danh tính danh tính người dùng
app.UseAuthorization();  // Phân quyền kiểm tra vai trò kiểm soát hệ thống

// Ánh xạ luồng chạy cho các file API Controller (Dùng cho ReactJS gọi lấy JSON ở Buổi 7 & 8)
app.MapControllers();

// Ánh xạ luồng chạy cho các file MVC Controller (Trang quản trị Admin của hệ thống)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run(); // Lệnh thực thi chạy toàn bộ ứng dụng mạng web