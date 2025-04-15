$(document).ready(function () {
    const token = sessionStorage.getItem('token') ;
    const apiUrl = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/tin";
    const api_tin="http://nguyenquocdai-001-site1.ltempurl.com/api/tin";
    const api_addtin="http://nguyenquocdai-001-site1.ltempurl.com/api/admin/tin";// gửi thêm token và request
    const api_delete_tin="";// chưa có api
    const api_update_tin="http://nguyenquocdai-001-site1.ltempurl.com/api/admin/tin"; // thêm id để sửa theo id
    const api_loaitin = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/loaitin";
    // Khi nhấn Edit, mở modal và điền dữ liệu vào form
$("#data-table").on("click", ".edit-btn", function () {
  const idTin = $(this).data("id"); // Lấy id tin từ data attribute của nút Edit

  // Lấy danh sách loại tin
  $.ajax({
    url: `${api_loaitin}`, // API lấy danh sách loại tin
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    success: function (loaiTinData) {
      // Điền vào combobox loại tin
      const loaiTinSelect = $("#loaiTin");
      loaiTinSelect.empty(); // Xóa các tùy chọn cũ

      loaiTinData.forEach(function(loaiTin) {
        loaiTinSelect.append(`<option value="${loaiTin.idLoaiTin}">${loaiTin.tenLoaiTin}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi lấy loại tin:", error);
    }
  });

  // Lấy thông tin chi tiết tin tức
  $.ajax({
    url: `${api_tin}/${idTin}`,
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    success: function (data) {
      // Điền dữ liệu vào form modal
      $("#tieuDe").val(data.tieuDe);
      $("#moTa").val(data.moTa);
      $("#noiDung").val(data.noiDung);
      $("#hinhDaiDien").val(data.hinhDaiDien);
      $("#ngayDangTin").val(data.ngayDangTin.split("T").join(" "));
      $("#tacGia").val(data.tacGia);
      $("#loaiTin").val(data.idLoaiTin); // Điền idLoaiTin vào combobox

      // Lưu idTin để gửi khi cập nhật
      $("#editForm").data("id", idTin);

      // Mở modal
      $('#editModal').modal('show');
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi lấy tin:", error);
    }
  });
});

// Khi submit form cập nhật
$("#editForm").on("submit", function (e) {
  e.preventDefault();

  const idTin = $(this).data("id");
  const updatedNews = {
    tieuDe: $("#tieuDe").val(),
    hinhDaiDien: $("#hinhDaiDien").val(),
    moTa: $("#moTa").val(),
    noiDung: $("#noiDung").val(),
    ngayDangTin: $("#ngayDangTin").val(),
    tacGia: $("#tacGia").val(),
    idLoaiTin: $("#loaiTin").val(), // Lấy idLoaiTin từ combobox
  };

  $.ajax({
    url: `${api_update_tin}/${idTin}`,
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    data: JSON.stringify(updatedNews),
    success: function (response) {
      alert("Cập nhật tin thành công!");
      $('#editModal').modal('hide'); // Đóng modal
      loadNewsData(); // Tải lại dữ liệu tin tức sau khi cập nhật
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi cập nhật tin:", error);
      alert("Có lỗi xảy ra khi cập nhật tin!");
    }
  });
});

$("#addbutton").on("click",function(){
  $.ajax({
    url: `${api_loaitin}`, // Đảm bảo URL đúng để lấy loại tin
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    success: function(loaiTinData) {
      // Kiểm tra xem dữ liệu có hợp lệ không
      if (Array.isArray(loaiTinData)) {
        const loaiTinSelect = $("#loaiTinAdd");
        loaiTinSelect.empty(); // Xóa các tùy chọn cũ

        // Thêm các loại tin vào dropdown
        loaiTinData.forEach(function(loaiTin) {
          loaiTinSelect.append(`<option value="${loaiTin.idLoaiTin}">${loaiTin.tenLoaiTin}</option>`);
        });
      } else {
        console.error("Dữ liệu loại tin không hợp lệ");
      }
    },
    error: function(xhr, status, error) {
      console.error("Lỗi khi lấy loại tin:", error);
    }
  });
});
  // them tin khi nhấn vào nút thêm trong model
  $("#addForm").on("submit", function (e) {
    e.preventDefault();
  
    const newTin = {
      tieuDe: $("#tieuDeAdd").val(),
      hinhDaiDien: $("#hinhDaiDienAdd").val(),
      moTa: $("#moTaAdd").val(),
      noiDung: $("#noiDungAdd").val(),
      ngayDangTin: $("#ngayDangTinAdd").val(),
      tacGia: $("#tacGiaAdd").val(),
      idLoaiTin: $("#loaiTinAdd").val(),
    };
  
    // Kiểm tra nếu dữ liệu không hợp lệ
    if (!newTin.tieuDe || !newTin.hinhDaiDien || !newTin.moTa || !newTin.noiDung) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    $.ajax({
      url: `${api_addtin}`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(newTin),
      success: function (response) {
        console.log("Dữ liệu phản hồi từ server:", response);
        alert("Đăng tin thành công!");
        $("#addModal").modal("hide");
        $("#addForm").trigger("reset");
        loadNewsData();  // Tải lại dữ liệu sau khi thêm tin
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi thêm tin:", error);
        alert("Có lỗi xảy ra!");
      }
    });
  });

  // Hàm load dữ liệu tin tức từ API (Có thể gọi lại sau khi cập nhật)
  function loadNewsData() {
    $.ajax({
      url: apiUrl,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      success: function (data) {
        renderNewsTable(data);
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi lấy tin:", error);
      }
    });
  }
    //
    function loadNews() {
      $.ajax({
        url: apiUrl,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        success: function (data) {
          if (Array.isArray(data)) {
            renderNewsTable(data);
          } else if (data.message) {
            alert(data.message);
            $("#data-table").html(`<tr><td colspan="7" class="text-center">${data.message}</td></tr>`);
          }
        },
        error: function (xhr) {
          console.error("Lỗi khi lấy danh sách tin:", xhr.responseText);
        }
      });
    }
  
    function renderNewsTable(newsList) {
      const $tbody = $("#data-table");
      $tbody.empty();
    
      newsList.forEach(news => {
        const isHot = news.tinHot === 1;
        const btnClass = isHot ? "btn-danger" : "btn-outline-secondary";
        const btnText = isHot ? "🔥 Tin hot" : "Bình thường";
    
        const $tr = $(`
          <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img src="${news.hinhDaiDien}" class="avatar avatar-sm me-3 border-radius-lg" alt="Ảnh đại diện">
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">${news.idTin || 'N/A'}</h6>
                  <p class="text-xs text-secondary mb-0">${shorten(news.tieuDe,10)}</p>
                </div>
              </div>
            </td>
            <td><p class="text-xs text-secondary mb-0">${shorten(news.moTa,10)}</p></td>
            <td><p class="text-xs text-secondary mb-0">${shorten(news.noiDung, 10)}</p></td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${news.soLanXem || 0}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${formatDate(news.ngayDangTin)}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${news.tacGia}</span>
            </td>
            <td class="align-middle text-center">
              <button class="btn btn-sm ${btnClass} toggle-hot-btn" data-id="${news.idTin}">
                ${btnText}
              </button>
            </td>
            <td class="align-middle">
              <a href="#" class="text-secondary font-weight-bold text-xs edit-btn" data-id="${news.idTin}" data-toggle="tooltip" data-original-title="Edittin">
                Edit
              </a>
            </td>
          </tr>
        `);
    
        // Gắn sự kiện cho nút đổi trạng thái
        $tr.find(".toggle-hot-btn").on("click", function () {
          const idTin = $(this).data("id");
    
          $.ajax({
            url: `${api_update_tin}/${idTin}/tinhot`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`
            },
            success: function (res) {
              alert(res.message || "Cập nhật trạng thái thành công!");
              loadNews(); // Gọi lại để cập nhật trạng thái trong bảng
            },
            error: function (xhr) {
              const res = xhr.responseJSON;
              alert(res?.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
            }
          });
        });
    
        $tbody.append($tr);
      });
    }
    
    
  
    function shorten(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
  
    function formatDate(isoDateStr) {
      const date = new Date(isoDateStr);
      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    }
  
    // Khởi chạy khi tải trang
    loadNews();
  });
  