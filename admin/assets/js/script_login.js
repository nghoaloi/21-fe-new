function getEmailFromToken(token) {
    // Kiểm tra xem token có hợp lệ không
    if (!token) {
        console.log("Không có token.");
        return null;
    }

    try {
        // Giải mã phần payload của JWT
        var payload = JSON.parse(atob(token.split('.')[1]));

        // Lấy email từ payload
        var email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        
        if (email) {
            return email; // Trả về email nếu tìm thấy
        } else {
            console.log("Không tìm thấy email trong token.");
            return null;
        }
    } catch (error) {
        console.log("Lỗi giải mã token:", error);
        return null;
    }
}
$(document).ready(function(){
    // Khi người dùng nhấn nút đăng nhập
    $("#login-admin").submit(function(e){
        e.preventDefault();
       

        var email = $("#email").val();
        var password = $("#password").val();

        // Gửi yêu cầu đăng nhập đến server
        $.ajax({
            url: 'http://nguyenquocdai-001-site1.ltempurl.com/api/nguoidung/dangnhap',  // Thay bằng URL API của bạn
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                Email: email,
                MatKhau: password
            }),
            success: function(response){
                if(response.token) {    
                    // Giải mã payload của token (JWT)
                    var payload = JSON.parse(atob(response.token.split('.')[1]));

                    // Kiểm tra role
                    if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'admin') {
                        // Chuyển đến trang admin
                        // Lưu token vào sessionStorage
                        sessionStorage.setItem('token', response.token);
                    
                        window.location.href = "index.html";
                    } else if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'user') {
                        // Chuyển đến trang index
                        alert("quyền hạn của bạn không đủ");
                        window.location.href="login_admin.html"
                    }
                } else {
                    alert("Sai email hoặc mật khẩu");
                }
            },
            error: function(){
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            }
        });
    });
    // chek đăng nhập 
    checkLoginStatus();
});
// Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
function checkLoginStatus() {
    var token = sessionStorage.getItem('token'); // Hoặc sessionStorage.getItem('token')

    // Nếu có token, tức là người dùng đã đăng nhập
    if (token) {
        var payload = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT để lấy thông tin
        var email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

        // Thay đổi nút "Đăng Nhập" thành "Đăng Xuất"
        document.getElementById('login-btn').innerText = 'Đăng Xuất  ';
        document.getElementById('login-btn').setAttribute('href', '#'); // Hủy href để không chuyển trang

        
        // Gắn sự kiện "Đăng Xuất"
        document.getElementById('login-btn').addEventListener('click', function() {
            // Xóa token khi người dùng đăng xuất
            sessionStorage.removeItem('token');
            // Thực hiện lại kiểm tra login status để cập nhật lại giao diện
            window.location.reload();
        });
    } else {
        if (!window.location.pathname.includes("login_admin.html")) {
            window.location.href = "login_admin.html";
        }
    }
}


