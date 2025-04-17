$(document).ready(function () {
  const token = sessionStorage.getItem('token') ;
    const apiUrl_comments = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/binhluan";
  
    // Lấy danh sách bình luận
    function loadComments() {
      $.ajax({
        url: apiUrl_comments,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          renderCommentTable(data);
        },
        error: function (xhr, status, error) {
          console.error("Lỗi khi lấy bình luận:", error);
        }
      });
    }
  
    // Hàm hiển thị bình luận lên bảng
    function renderCommentTable(comments) {
      const $tbody = $("#user-table");
      $tbody.empty();
  
      comments.forEach(comment => {
        const $tr = $(`
          <tr>
            <td><p class="text-xs text-secondary mb-0">${comment.idBinhLuan}</p></td>
            <td><p class="text-xs text-secondary mb-0">${formatDateTime(comment.thoiGian)}</p></td>
            <td><p class="text-xs text-secondary mb-0">${comment.trangThai === 1 ? 'Hiển thị' : 'Đã ẩn'}</p></td>
            <td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">${comment.idTin}</span></td>
            <td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">${comment.emailNguoiDung}</span></td>
            <td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">${comment.noiDung}</span></td>
            <td class="align-middle">
              <button class="btn btn-sm btn-warning toggle-btn" data-id="${comment.idBinhLuan}">
                bật/tắt
              </button>
            </td>
          </tr>
        `);
        $tbody.append($tr);
      });
    }
  
    // Hàm định dạng ngày giờ
    function formatDateTime(dateTimeStr) {
      const date = new Date(dateTimeStr);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  
    // Hàm gọi API toggle trạng thái
    function toggleCommentStatus(idBinhLuan) {
      $.ajax({
        url: `${apiUrl_comments}/${idBinhLuan}/toggle`,
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        success: function (response) {
          alert(response.message);
          loadComments(); // Reload lại bảng sau khi cập nhật
        },
        error: function (xhr) {
          const response = xhr.responseJSON;
          alert(response.message || "Đã xảy ra lỗi khi cập nhật!");
        }
      });
    }
  
    // Gán sự kiện toggle sau khi load xong bảng
    $(document).on("click", ".toggle-btn", function () {
      const id = $(this).data("id");
      toggleCommentStatus(id);
    });
  
    // Load bình luận khi trang được tải
    loadComments();
  });
  