//Họ và tên: Nguyễn Phi Hùng
//Mã số sinh viên: 2123110475
//version: 1.0
using Microsoft.EntityFrameworkCore;
using CMS.Data;

var builder = WebApplication.CreateBuilder(args);

// =======================================================
// PHẦN 1: ĐĂNG KÝ DỊCH VỤ (SERVICES)
// *Bắt buộc phải nằm TRÊN lệnh builder.Build()*
// =======================================================

// Fix lỗi vòng lặp khi sinh dữ liệu JSON (Buổi 6)
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Cấu hình Swagger (Buổi 6)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🌟 THÊM MỚI BƯỚC NÀY: Mở cổng CORS cấp quyền cho Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.AllowAnyOrigin()  // Cho phép mọi domain truy cập (Khi thực tế có thể đổi thành http://localhost:3000)
              .AllowAnyHeader()  // Cho phép mọi loại dữ liệu gửi lên
              .AllowAnyMethod(); // Cho phép mọi thao tác GET, POST, PUT, DELETE
    });
});

// Kích hoạt dịch vụ Đăng nhập bằng Cookie (Buổi 5)
builder.Services.AddAuthentication("CMSAuthCookie")
    .AddCookie("CMSAuthCookie", options =>
    {
        options.Cookie.Name = "CMS_LoginCookie"; // Tên cookie lưu trên trình duyệt
        options.LoginPath = "/Auth/Login"; // Đường dẫn bị đẩy về nếu chưa đăng nhập
        options.AccessDeniedPath = "/Auth/AccessDenied"; // Đường dẫn báo lỗi nếu không đủ quyền
        options.ExpireTimeSpan = TimeSpan.FromDays(1); // Thời gian sống của Cookie là 1 ngày
    });

// Đăng ký DbContext vào hệ thống kết nối SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// =======================================================
// PHẦN 2: BUILD APP VÀ CẤU HÌNH LUỒNG CHẠY (MIDDLEWARE)
// =======================================================
var app = builder.Build(); // CHỈ GỌI 1 LẦN DUY NHẤT Ở ĐÂY

// Cấu hình Middleware Swagger (Chỉ hiển thị khi đang code)
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
app.UseStaticFiles();

app.UseRouting();

// 🌟 THÊM MỚI BƯỚC NÀY: Kích hoạt bảo vệ CORS
app.UseCors("AllowFrontendApp");

app.UseAuthentication(); // <-- Bắt buộc phải nằm trên UseAuthorization
app.UseAuthorization();

// Ánh xạ luồng chạy cho các file API Controller (Buổi 6)
app.MapControllers();

// Ánh xạ luồng chạy cho các file MVC Controller (Trang web)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run(); // Lệnh chạy web, cũng chỉ gọi 1 lần duy nhất ở cuối cùng