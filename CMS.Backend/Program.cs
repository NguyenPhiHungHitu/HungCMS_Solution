
//Họ và tên: Nguyễn Phi Hùng
//Mã số sinh viên: 2123110475
//version: 1.0
using Microsoft.EntityFrameworkCore;
using CMS.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Kích hoạt dịch vụ Đăng nhập bằng Cookie
builder.Services.AddAuthentication("CMSAuthCookie")
    .AddCookie("CMSAuthCookie", options =>
    {
        options.Cookie.Name = "CMS_LoginCookie"; // Tên cookie lưu trên trình duyệt
        options.LoginPath = "/Auth/Login"; // Đường dẫn bị đẩy về nếu chưa đăng nhập
        options.AccessDeniedPath = "/Auth/AccessDenied"; // Đường dẫn báo lỗi nếu không đủ quyền (ví dụ Editor đòi vào trang của Admin)
        options.ExpireTimeSpan = TimeSpan.FromDays(1); // Thời gian sống của Cookie là 1 ngày
    });

// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication(); // <-- Bắt buộc phải nằm trên UseAuthorization

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
