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
    $("#login-form").submit(function(e){
        e.preventDefault(); // Ngừng hành động mặc định của form

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
                    console.log("Token nhận được:", response.token);
                    // Lưu token vào localStorage hoặc sessionStorage
                    sessionStorage.setItem('token', response.token);
                    
                    // Giải mã payload của token (JWT)
                    var payload = JSON.parse(atob(response.token.split('.')[1]));

                    // Kiểm tra role
                    if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'admin') {
                        // Chuyển đến trang admin
                        window.location.href = "admin/index.html";
                    } else if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'user') {
                        // Chuyển đến trang index
                        window.location.href = "index.html";
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
        document.getElementById('login-btn').innerText = 'Đăng Xuất';
        document.getElementById('login-btn').setAttribute('href', '#'); // Hủy href để không chuyển trang

        // Hiển thị thông báo chào mừng
        document.getElementById('welcome-msg').innerText = 'Chào mừng, ' + email;
        
        // Gắn sự kiện "Đăng Xuất"
        document.getElementById('login-btn').addEventListener('click', function() {
            // Xóa token khi người dùng đăng xuất
            sessionStorage.removeItem('token');
            // Thực hiện lại kiểm tra login status để cập nhật lại giao diện
            checkLoginStatus();
        });
    } else {
        // Nếu không có token, người dùng chưa đăng nhập, chỉ hiển thị nút "Đăng Nhập"
        document.getElementById('login-btn').innerText = 'Đăng Nhập';
        document.getElementById('login-btn').setAttribute('href', 'login.html'); // Chuyển hướng đến trang login
    }
}

// Hàm đăng ký người dùng
function registerUser(email, password, confirmPassword) {
    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
    }

    // Tạo đối tượng dữ liệu để gửi đến API
    const data = {
        Email: email,
        MatKhau: password
    };

    // Gửi yêu cầu POST tới API đăng ký
    $.ajax({
        url: 'http://nguyenquocdai-001-site1.ltempurl.com/api/nguoidung/dangky', // Thay đổi nếu API URL khác
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            // Kiểm tra nếu email đã tồn tại
            if (response.message === "Email đã tồn tại") {
                alert("Email đã tồn tại!");
            } else if (response.message === "Đăng ký thành công") {
                alert("Đăng ký thành công!");
                window.location.href = "login.html"; // Chuyển hướng sang trang đăng nhập
            }
        },
        error: function(xhr, status, error) {
            // Khi có lỗi xảy ra, kiểm tra mã lỗi
            if (xhr.status === 400) {
                // Lỗi 400, đọc thông báo lỗi từ responseText
                const response = JSON.parse(xhr.responseText);
                alert(response.message); // Hiển thị thông báo lỗi từ server
            } else {
                // Nếu có lỗi khác ngoài 400
                alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }
    });
}



// Lưu token vào sessionStorage:

// javascript

// // Sau khi đăng nhập thành công và nhận token
// sessionStorage.setItem('token', response.token);

// Lấy token từ sessionStorage khi cần sử dụng:
// var token = sessionStorage.getItem('token');

// Xóa token khi người dùng đăng xuất:
// sessionStorage.removeItem('token');