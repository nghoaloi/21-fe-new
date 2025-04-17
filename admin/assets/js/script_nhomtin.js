

  function closeModalSua() {
    const modalElement = document.getElementById("modalSuaNhomTin");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  function closeModal() {
    const modalElement = document.getElementById("modalThemNhomTin");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
$(document).ready(function () {
  const api_nhomtin="http://nguyenquocdai-001-site1.ltempurl.com/api/admin/nhomtin";
  const token = sessionStorage.getItem('token');
  $.ajax({
    url: api_nhomtin,
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function (data) {
      const $groupList = $('#groupList');
      $groupList.empty();

      if (Array.isArray(data) && data.length > 0) {
        data.forEach(function (item) {
          
          const statusButton = item.trangThai === 1
            ? '<button class="btn btn-success btn-sm btn-toggle-trangthai" data-id="' + item.idNhomTin + '" data-status="1">Đang hiện</button>'
            : '<button class="btn btn-danger btn-sm btn-toggle-trangthai" data-id="' + item.idNhomTin + '" data-status="0">Ẩn nhóm tin</button>';
          $groupList.append(`
            <tr>
              <td><p class="text-secondary opacity-7">${item.idNhomTin}</p></td>
              <td><p class="text-xs text-secondary mb-0">${item.tenNhomTin}</p></td>
              <td><div class="text-xs text-secondary mb-0">
                    ${statusButton}
                  </div>
              </td>
              <td>
                  <button class="btn btn-sm btn-dark btn-edit-nhomtin" 
                          data-id="${item.idNhomTin}" 
                          data-ten="${item.tenNhomTin}">
                    Edit
                  </button>             
                </td>
            </tr>
          `);
        });
      } else {
        $groupList.append(`
          <tr>
            <td colspan="4" class="text-center text-secondary">Không có nhóm tin nào!</td>
          </tr>
        `);
      }
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi gọi API:", error);
    }
  });
  function loadNhomTin() {
    $.ajax({
      url: api_nhomtin,
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      },
      success: function (data) {
        const $groupList = $('#groupList');
        $groupList.empty();

        if (Array.isArray(data) && data.length > 0) {
          data.forEach(function (item) {
            const statusButton = item.trangThai === 1
              ? '<button class="btn btn-success btn-sm btn-toggle-trangthai" data-id="' + item.idNhomTin + '" data-status="1">Đang hiện</button>'
              : '<button class="btn btn-danger btn-sm btn-toggle-trangthai" data-id="' + item.idNhomTin + '" data-status="0">Ẩn nhóm tin</button>';
            $groupList.append(`
              <tr>
                <td><p class="text-secondary opacity-7">${item.idNhomTin}</p></td>
                <td><p class="text-xs text-secondary mb-0">${item.tenNhomTin}</p></td>
                <td><div class="text-xs text-secondary mb-0">
                      ${statusButton}
                    </div>
                </td>
                <td>
                  <button class="btn btn-sm btn-dark btn-edit-nhomtin" 
                          data-id="${item.idNhomTin}" 
                          data-ten="${item.tenNhomTin}">
                    Edit
                  </button>                 
                </td>
              </tr>
            `);
          });
        } else {
          $groupList.append(`
            <tr>
              <td colspan="4" class="text-center text-secondary">Không có nhóm tin nào!</td>
            </tr>
          `);
        }
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi load lại nhóm tin:", error);
      }
    });
  }
  // nhấn nút edit
  $("#groupList").on("click", ".btn-edit-nhomtin", function (e) {
    e.preventDefault();
    const idNhomTin = $(this).data("id");
    const tenNhomTin = $(this).data("ten");
    // Gán dữ liệu vào form
    $("#sua_idNhomTin").val(idNhomTin);
    $("#sua_tenNhomTin").val(tenNhomTin);
  
    // Mở modal sửa
    const modal = new bootstrap.Modal(document.getElementById("modalSuaNhomTin"));
    modal.show();
  });
  //
  $("#formSuaNhomTin").submit(function (e) {
    e.preventDefault(); // Ngăn form reload trang
  
    const id = $("#sua_idNhomTin").val(); // lấy id loại tin
    const tenNhomTin = $("#sua_tenNhomTin").val().trim();
  
    if (!tenNhomTin) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
  
    $.ajax({
      url: `${api_nhomtin}/${id}`,
      method: "PUT",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${token}` 
      },
      data: JSON.stringify({
        tenNhomTin: tenNhomTin,
        
      }),
      success: function (res) {
        alert(res.message || "Cập nhật thành công!");
  
        // Ẩn modal sau khi cập nhật
        closeModalSua()
  
        // Refresh lại bảng
        loadNhomTin();
      },
      error: function (xhr) {
        const res = xhr.responseJSON;
        alert(res?.message || "Cập nhật thất bại!");
      }
    });
  });
  // Sự kiện nhấn nút toggle trạng thái
  $("#groupList").on("click", ".btn-toggle-trangthai", function () {
    const idNhomTin = $(this).data("id");
    const button = $(this);
    const patchUrl = `${api_nhomtin}/${idNhomTin}/toggle`;
    $.ajax({
        url: patchUrl,
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        success: function (response) {
            alert(response.message); // Cập nhật trạng thái thành công!
            loadNhomTin(); // Tải lại danh sách
        },
        error: function (xhr) {
            const res = xhr.responseJSON;
            alert(res?.message || "Có lỗi xảy ra!");
        }
    });
});
});

  