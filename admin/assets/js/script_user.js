$(document).ready(function () {
  const token = sessionStorage.getItem('token');
  const apiUrl_user = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/user";

  $.ajax({
    url: apiUrl_user,
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    success: function (data) {
      renderUserTable(data);
    },
    error: function (xhr, status, error) {
      console.error("Lỗi:", error);
    }
  });

  function loadNewsDatauser(){
    $.ajax({
      url: apiUrl_user,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      success: function (data) {
        renderUserTable(data);
      },
      error: function (xhr, status, error) {
        console.error("Lỗi:", error);
      }
    });
  }
  function renderUserTable(users) {
    const $tbody = $("#user-table");
    $tbody.empty(); // Xóa nội dung cũ

    users.forEach(user => {
      const statusButton = user.trangThai === 1
        ? '<button class="btn btn-success btn-sm change-status" data-id="' + user.idNguoiDung + '" data-status="1">Hoạt động</button>'
        : '<button class="btn btn-danger btn-sm change-status" data-id="' + user.idNguoiDung + '" data-status="0">Bị khóa</button>';

      const roleButton = user.role === 'admin'
        ? '<button class="btn btn-warning btn-sm change-role" data-id="' + user.idNguoiDung + '" data-role="admin">Admin</button>'
        : '<button class="btn btn-primary btn-sm change-role" data-id="' + user.idNguoiDung + '" data-role="user">User</button>';

      const $tr = $(`
        <tr>
          <td>
            <p class="align-middle text-center">${user.idNguoiDung}</p>
          </td>
          <td>
            <p class="text-xs text-secondary mb-0">${user.email}</p>
          </td>
          <td>
            <div class="text-center">
              ${statusButton}
            </div>
          </td>
          <td class="align-middle text-center">
            <div class="text-center">
              ${roleButton}
            </div>
          </td>
        </tr>
      `);

      $tbody.append($tr);
    });

    // Thêm sự kiện click vào nút thay đổi trạng thái
    $(".change-status").click(function () {
      const userId = $(this).data("id");

      // Gửi yêu cầu PATCH để thay đổi trạng thái người dùng
      $.ajax({
        url: `http://nguyenquocdai-001-site1.ltempurl.com/api/admin/user/${userId}/toggle`, // API endpoint
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          if (data.message === "Cập nhật trạng thái thành công!") {
            // Tự động làm mới lại bảng khi cập nhật thành công
            alert("Cập nhật trạng thái thành công!");
            $.ajax({
              url: apiUrl_user,
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              success: function (data) {
                renderUserTable(data);  // Cập nhật lại bảng sau khi thay đổi trạng thái
              },
              error: function (xhr, status, error) {
                console.error("Lỗi:", error);
              }
            });
          } else {
            alert("Không tìm thấy người dùng!");
          }
        },
        error: function (xhr, status, error) {
          console.error("Lỗi khi thay đổi trạng thái:", error);
          alert("Lỗi khi thay đổi trạng thái.");
        }
      });
    });

    // Thêm sự kiện click vào nút thay đổi role
    $(".change-role").click(function () {
      const userId = $(this).data("id");
      const currentRole = $(this).data("role");
      const newRole = currentRole === 'admin' ? 'user' : 'admin'; // Chuyển đổi giữa Admin và User

      // Gửi yêu cầu PATCH để thay đổi role người dùng
      $.ajax({
        url: `http://nguyenquocdai-001-site1.ltempurl.com/api/admin/user/${userId}/role`, // API endpoint
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          role: newRole
        }),
        success: function (data) {
          if (data.message === "Đã cập nhật quyền!") {
            // Tự động làm mới lại bảng khi cập nhật role thành công
            alert("Đã cập nhật quyền!");
            $.ajax({
              url: apiUrl_user,
              method: "PATCH",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              success: function (data) {
                renderUserTable(data);  // Cập nhật lại bảng sau khi thay đổi role
              },
              error: function (xhr, status, error) {
                console.error("Lỗi:", error);
              }
            });
          } else {
            alert("Không tìm thấy người dùng!");
          }
        },
        error: function (xhr, status, error) {
          console.error("Lỗi khi thay đổi quyền:", error);
          alert("Lỗi khi thay đổi quyền.");
        }
      });
    });
    // nút thêm user
  }
  $("#adduserbutton").on("click",function(){

  });
  $("#adduserForm").on("submit",function(e){
    e.preventDefault();
    const newUser = {
      email: $("#email").val(),
      matkhau: $("#password").val(),
      role: "user",
    }
    if (!newUser.email || !newUser.matkhau ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    $.ajax({
      url: `${apiUrl_user}`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(newUser),
      success: function (response) {
        console.log("Dữ liệu phản hồi từ server:", response);
        alert("thêm user thành công thành công!");
        $("#adduserModal").modal("hide");
        $("#adduserForm").trigger("reset");
        $('#view').load('user_table.html');
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi thêm user:", error);
        alert("Có lỗi xảy ra!");
      }
    });
  });
});
