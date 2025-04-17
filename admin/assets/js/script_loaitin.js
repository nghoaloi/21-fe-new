function loadDanhSachNhomTinVaoSelect(selectId, selectedValue) {
    fetch("http://nguyenquocdai-001-site1.ltempurl.com/api/tin/menu")
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Chọn nhóm tin --</option>';
        data.forEach(nhom => {
          const option = document.createElement("option");
          option.value = nhom.idNhomTin;
          option.textContent = nhom.tenNhomTin;
          if (nhom.idNhomTin == selectedValue) {
            option.selected = true;
          }
          select.appendChild(option);
        });
    });
  }
  function closeModal() {
    document.getElementById("modalThemLoaiTin").style.display = "none";
  }
  $(document).ready(function () {
    const token = sessionStorage.getItem('token') ;
    const api_loaitin = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/loaitin"; // GET API
    const api_nhomtin = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/nhomtin";
    // Gọi API để load loại tin khi trang vừa load
    $.ajax({
        url: api_loaitin,
        method: "GET",
        dataType: "json",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (data) {
            renderLoaiTin(data);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi gọi API loại tin:", error);
        }
    });
    function loadLoaiTin(){
        $.ajax({
            url: api_loaitin,
            method: "GET",
            dataType: "json",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                renderLoaiTin(data);
            },
            error: function (xhr, status, error) {
                console.error("Lỗi khi gọi API loại tin:", error);
            }
        });
    }
    function renderLoaiTin(data) {
        const groupList = $("#groupList");
        groupList.empty(); // Xóa dòng cũ nếu có

        data.forEach(item => {
            const statusButton = item.trangThai === 1
            ? '<button class="btn btn-success btn-sm change-status" data-id="' + item.idLoaiTin + '" data-status="1">Đang hiện</button>'
            : '<button class="btn btn-danger btn-sm change-status" data-id="' + item.idLoaiTin + '" data-status="0">Ẩn loại tin</button>';
            const row = `
                <tr>
                    <td>
                        <p class="text-secondary opacity-7">${item.idLoaiTin}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${item.tenLoaiTin}</p>
                    </td>
                    <td>
                        <div class="text-xs text-secondary mb-0">
                        ${statusButton}
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-info btn-edit-loaitin" 
                            data-id="BD01" 
                            data-ten="Dự Án" 
                            data-nhom="9">
                            Sửa
                        </button>
                    </td>
                </tr>
            `;

            groupList.append(row);
        });
    }
        // Sự kiện nhấn nút toggle trạng thái
        $("#groupList").on("click", ".change-status", function () {
            const idLoaiTin = $(this).data("id");
            const button = $(this);
            const patchUrl = `${api_loaitin}/${idLoaiTin}/toggle`;
    
            $.ajax({
                url: patchUrl,
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                success: function (response) {
                    alert(response.message); // Cập nhật trạng thái thành công!
                    loadLoaiTin(); // Tải lại danh sách
                },
                error: function (xhr) {
                    const res = xhr.responseJSON;
                    alert(res?.message || "Có lỗi xảy ra!");
                }
            });
        });
    // Khi mở modal: Tải danh sách nhóm tin
    $('#addbutton').on("click", function () {
        $.ajax({
            url: api_nhomtin,
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                const select = $('#idNhomTin');
                select.empty().append('<option value="">-- Chọn nhóm tin --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                        select.append(`<option value="${item.idNhomTin}">${item.tenNhomTin}</option>`);
                    });
                } else {
                    select.append('<option disabled>Không có nhóm tin nào!</option>');
                }
            },
            error: function () {
                alert("Không thể tải nhóm tin.");
            }
        });
    });

    // Submit form thêm loại tin
    $('#formThemLoaiTin').submit(function (e) {
        e.preventDefault();

        const idLoaiTin = $('#idLoaiTin').val().trim();
        const tenLoaiTin = $('#tenLoaiTin').val().trim();
        const idNhomTin = $('#idNhomTin').val();

        if (!idLoaiTin || !tenLoaiTin || !idNhomTin) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const dataPost = {
            idLoaiTin: idLoaiTin,
            tenLoaiTin: tenLoaiTin,
            idNhomTin: parseInt(idNhomTin),
        };

        $.ajax({
            url: api_loaitin,
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            contentType: "application/json",
            data: JSON.stringify(dataPost),
            success: function () {
                alert("Thêm loại tin thành công!");
                closeModal();
                loadLoaiTin();
            },
            error: function (xhr) {
                const res = xhr.responseJSON;
                alert(res?.message || "Thêm loại tin thất bại!");
            }
        });
    });
    //nhấn nút edit
    $("#groupList").on("click", ".btn-edit-loaitin", function (e) {
        e.preventDefault();
        const idLoaiTin = $(this).data("id");
        const tenLoaiTin = $(this).data("ten");
        const idNhomTin = $(this).data("nhom");
      
        // Gán dữ liệu vào form
        $("#sua_idLoaiTin").val(idLoaiTin);
        $("#sua_tenLoaiTin").val(tenLoaiTin);
      
        // 👉 Gọi hàm bạn đã có để load nhóm tin vào select
        loadDanhSachNhomTinVaoSelect("sua_idNhomTin", idNhomTin);
      
        // Mở modal sửa
        const modal = new bootstrap.Modal(document.getElementById("modalSuaLoaiTin"));
        modal.show();
      });
      
      $("#formSuaLoaiTin").submit(function (e) {
        e.preventDefault(); // Ngăn form reload trang
      
        const id = $("#sua_idLoaiTin").val(); // lấy id loại tin
        const tenLoaiTin = $("#sua_tenLoaiTin").val().trim();
        const idNhomTin = $("#sua_idNhomTin").val();
      
        if (!tenLoaiTin || !idNhomTin) {
          alert("Vui lòng nhập đầy đủ thông tin.");
          return;
        }
      
        $.ajax({
          url: `${api_loaitin}/${id}`,
          method: "PUT",
          contentType: "application/json",
          headers: {
            Authorization: `Bearer ${token}` // dùng token nếu có
          },
          data: JSON.stringify({
            tenLoaiTin: tenLoaiTin,
            idNhomTin: parseInt(idNhomTin)
          }),
          success: function (res) {
            alert(res.message || "Cập nhật thành công!");
      
            // Ẩn modal sau khi cập nhật
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalSuaLoaiTin"));
            modal.hide();
      
            // Refresh lại bảng
            loadLoaiTin();
          },
          error: function (xhr) {
            const res = xhr.responseJSON;
            alert(res?.message || "Cập nhật thất bại!");
          }
        });
      });
           
});

