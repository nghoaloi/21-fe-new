
// Hàm để hiện/ẩn bảng loại tin
function toggleLoaiTin(id) {
    const tableRow = document.getElementById(`loaiTin-${id}`);
    if (tableRow.style.display === 'none') {
      tableRow.style.display = 'table-row';
    } else {
      tableRow.style.display = 'none';
    }
}

function loadDanhSachNhomTin() {
    fetch("http://nguyenquocdai-001-site1.ltempurl.com/api/tin/menu") // <-- Đặt đúng URL API của bạn ở đây
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("idNhomTin");
        select.innerHTML = '<option value="">-- Chọn nhóm tin --</option>'; // reset
        
        data.forEach(nhom => {
          const option = document.createElement("option");
          option.value = nhom.idNhomTin;
          option.textContent = nhom.tenNhomTin;
          select.appendChild(option);
        });
      })
      .catch(err => {
        console.error("Lỗi khi tải nhóm tin:", err);
      });
  }
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
  function openModalSuaLoaiTin(idLoaiTin, tenLoaiTin, idNhomTin) {
    // Mở modal
    document.getElementById("modalSuaLoaiTin").style.display = "block";
  
    // Load danh sách nhóm tin vào select
    loadDanhSachNhomTinVaoSelect("sua_idNhomTin", idNhomTin);
  
    // Đổ dữ liệu vào form
    document.getElementById("sua_idLoaiTin").value = idLoaiTin;
    document.getElementById("sua_tenLoaiTin").value = tenLoaiTin;
  }
  function closeModalSua() {
    document.getElementById("modalSuaLoaiTin").style.display = "none";
  }
  function closeModal() {
    document.getElementById("modalThemLoaiTin").style.display = "none";
  }
$(document).ready(function () {
    const api_nhomtin="http://nguyenquocdai-001-site1.ltempurl.com/api/tin/menu";
    const api_addloaitin="http://nguyenquocdai-001-site1.ltempurl.com/api/admin/loaitin";//post

    const API_NHOM_TIN = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/nhomtin";
    const API_LOAI_TIN = "http://nguyenquocdai-001-site1.ltempurl.com/api/admin/loaitin";//get

    const token = sessionStorage.getItem('token') ;

    fetch(api_nhomtin, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        console.log(data.message);
      } else {
        renderGroupList(data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));

    // load nhóm tin 

    function loadGroupList() {
      $.ajax({
        url: API_NHOM_TIN,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        success: function (data) {
          if (Array.isArray(data)) {
            renderGroupList(data);
          } else if (data.message) {
            alert(data.message);
            $("#groupList").html(`<tr><td colspan="4" class="text-center text-danger">${data.message}</td></tr>`);
          }
        },
        error: function (xhr) {
          console.error("Lỗi khi lấy nhóm tin:", xhr);
          alert("Không thể tải nhóm tin. Hãy kiểm tra lại token hoặc máy chủ.");
        }
      });
    }

    // load loại tin theo nhóm 
    function loadLoaiTinTheoNhom(idNhomTin, callback) {
      $.ajax({
        url: API_LOAI_TIN,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        success: function (data) {
          // console.log("DỮ LIỆU TRẢ VỀ TỪ API LOẠI TIN:", data);
    
          if (!Array.isArray(data)) {
            callback([], "Dữ liệu không hợp lệ.");
            return;
          }
    
          const filtered = data.filter(loai => Number(loai.idNhomTin) === Number(idNhomTin));
          // console.log("LOẠI TIN CỦA NHÓM", idNhomTin, ":", filtered);
          callback(filtered);
        },
        error: function (xhr, status, errorThrown) {
          console.error("XHR Error:", xhr);
          console.error("Status:", status);
          console.error("Thrown:", errorThrown);
          callback([], "Không thể tải loại tin.");
        }
      });
    }
    
    
    // 
    function toggleLoaiTin(idNhomTin) {
      console.log("GỌI toggleLoaiTin VỚI ID:", idNhomTin);
      const row = document.getElementById(`loaiTin-${idNhomTin}`);
    
      if (row.style.display === 'none') {
        row.style.display = '';
        const cell = row.querySelector('td');
        cell.innerHTML = '<p>Đang tải...</p>';
    
        // Gọi hàm riêng để load loại tin
        loadLoaiTinTheoNhom(idNhomTin, function(filtered, error) {
          if (error) {
            cell.innerHTML = `<p class="text-danger">${error}</p>`;
            return;
          }
    
          if (filtered.length === 0) {
            cell.innerHTML = '<p>Không có loại tin nào cho nhóm này.</p>';
            return;
          }
    
          let tableHtml = `
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>ID loại tin</th>
                  <th>Tên loại tin</th>
                  <th> trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
          `;
    
          filtered.forEach(loai => {
            const isVisible = loai.trangThai === 1;
            const statusText = isVisible ? 'Đang hiện' : 'Đang ẩn';
            const btnClass = isVisible ? 'btn-warning' : 'btn-success';
            const toggleText = isVisible ? 'Ẩn' : 'Hiện';
    
            tableHtml += `
              <tr>
                <td>${loai.idLoaiTin}</td>
                <td>${loai.tenLoaiTin}</td>
                <td><span class="badge bg-${isVisible ? 'success' : 'secondary'}">${statusText}</span></td>
                <td>
                  <button class="btn btn-sm ${btnClass} btn-toggle-trangthai" 
                          data-id="${loai.idLoaiTin}" 
                          data-nhom="${idNhomTin}">
                    ${toggleText}
                  </button>
                </td>
                <td>
                <button class="btn btn-sm btn-primary" onclick="openModalSuaLoaiTin('${loai.idLoaiTin}', '${loai.tenLoaiTin}', ${loai.idNhomTin})">Edit</button>
                </td>
              </tr>
            `;
          });
    
          tableHtml += `</tbody></table>`;
          cell.innerHTML = tableHtml;
        });
      } else {
        row.style.display = 'none';
      }
    }
  
  // load bảng nhóm tin
  function renderGroupList(nhomTinList) {
    const tbody = document.getElementById('groupList');
    tbody.innerHTML = '';
  
    nhomTinList.forEach(group => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><p class="text-xs text-secondary mb-0">${group.idNhomTin}</p></td>
        <td><p class="text-xs text-secondary mb-0">${group.tenNhomTin}</p></td>
        <td>
          <button class="btn btn-dark btn-toggle-loai" data-id="${group.idNhomTin}">Hiện loại tin</button>
        </td>
        
      `;
  
      const loaiTinRow = document.createElement('tr');
      loaiTinRow.id = `loaiTin-${group.idNhomTin}`;
      loaiTinRow.style.display = 'none';
  
      const loaiTinCell = document.createElement('td');
      loaiTinCell.colSpan = 4;
      loaiTinCell.innerHTML = `<p>Đang tải...</p>`;
      loaiTinRow.appendChild(loaiTinCell);
  
      tbody.appendChild(row);
      tbody.appendChild(loaiTinRow);
    });
  }
  
  $(document).on("click", ".btn-toggle-loai", function () {
    const id = $(this).data("id");
    console.log("GỌI toggleLoaiTin với ID:", id);
    toggleLoaiTin(id);
  });
  
  // sự kiện nhấn vào nút hiện loại tin 
  document.addEventListener("DOMContentLoaded", () => {
    loadGroupList();
  });
  // sự kiện nhấn vào nút ẩn hiện của bảng loại tin
  $(document).on("click", ".btn-toggle-trangthai", function () {
    const idLoaiTin = $(this).data("id");
    const idNhomTin = $(this).data("nhom");

    // Gọi API để thay đổi trạng thái
    $.ajax({
      url: `${API_LOAI_TIN}/${idLoaiTin}/toggle`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: function (res) {
        alert(res.message || "Cập nhật trạng thái thành công!");
        toggleLoaiTin(idNhomTin); // reload lại bảng loại tin sau khi cập nhật
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.message || "Lỗi khi cập nhật trạng thái.";
        alert(msg);
      }
    });
  });
// các sự kiện khi nhấn thêm loại tin 




// Mở modal thêm loại tin
document.getElementById("tbn_themloaitin").addEventListener("click", function () {
    document.getElementById("modalThemLoaiTin").style.display = "block";
    loadDanhSachNhomTin();
  });
  
  
  // nhấn ra ngoài để thoát model 
  $(window).on("click", function (event) {
    const modal = document.getElementById("modalThemLoaiTin"||"modalSuaLoaiTin");
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Gửi dữ liệu khi submit thêm loại tin
  document.getElementById("formThemLoaiTin").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const data = {
      idLoaiTin: document.getElementById("idLoaiTin").value,
      tenLoaiTin: document.getElementById("tenLoaiTin").value,
      idNhomTin: parseInt(document.getElementById("idNhomTin").value)
    };
  
    $.ajax({
        url: `${api_addloaitin}`,
        method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        alert("Thêm loại tin thành công!");
        closeModal();
  
        // (Tuỳ chọn) Gọi lại API để cập nhật bảng:
        fetch(api_nhomtin)
          .then(res => res.json())
          .then(data => renderGroupList(data));
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi thêm loại tin:", error);
        alert("Lỗi khi thêm loại tin!");
      }
    });
  });
  
  // gửi dữ liệu khi nhấn cập nhật 
  document.getElementById("formSuaLoaiTin").addEventListener("submit", function (e) {
    e.preventDefault();
    // Lấy id ra riêng (dùng cho URL)
    const idLoaiTin = document.getElementById("sua_idLoaiTin").value;

    // Tạo data gửi trong body (không cần idLoaiTin nữa)
    const data = {
        tenLoaiTin: document.getElementById("sua_tenLoaiTin").value,
        idNhomTin: parseInt(document.getElementById("sua_idNhomTin").value)
    };
  
    $.ajax({
      url: `${api_addloaitin}/${idLoaiTin}`, // hoặc `${api}/loaitin/${id}`
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (res) {
        // Kiểm tra message trả về
      // Kiểm tra message trả về
      if (res.message === "Cập nhật loại tin thành công!") {
        alert(res.message);
        closeModalSua();

        // Cập nhật lại bảng
        fetch(api_nhomtin)
          .then(res => res.json())
          .then(data => renderGroupList(data));
      } else {
        alert("Cảnh báo: " + res.message);
      }
      },
      error: function (xhr) {
        console.error(xhr.responseText);
        alert("Lỗi khi cập nhật loại tin!");
      }
    });
  });
});

    // function renderGroupList(data) {
  //   const tbody = document.getElementById('groupList');
  //   tbody.innerHTML = ''; // Xóa nội dung cũ
  
  //   data.forEach(group => {
  //     const row = document.createElement('tr');
      
  //     // Tạo các cột cho mỗi nhóm tin
  //     row.innerHTML = `
  //       <td><p class="text-xs text-secondary mb-0">${group.idNhomTin}</p></td>
  //       <td><p class="text-xs text-secondary mb-0">${group.tenNhomTin}</p></td>
  //       <td><button class="btn-dark" onclick="toggleLoaiTin(${group.idNhomTin})">hiện loại tin</button></td>`;
      
  //     // Tạo một phần tử con để chứa bảng loại tin
  //     const loaiTinRow = document.createElement('tr');
  //     loaiTinRow.id = `loaiTin-${group.idNhomTin}`;
  //     loaiTinRow.style.display = 'none'; // Ban đầu ẩn bảng loại tin
      
  //     const loaiTinCell = document.createElement('td');
  //     loaiTinCell.colSpan = 4; // Bảng loại tin chiếm hết 4 cột
  //     loaiTinCell.innerHTML = `
  //       <table class="table table-bordered">
  //         <thead>
  //           <tr>
  //             <th>ID loại tin</th>
  //             <th>Tên loại tin</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${group.loaiTin.map(loai => `
  //             <tr>
  //               <td>${loai.idLoaiTin}</td>
  //               <td>${loai.tenLoaiTin}</td>
  //               <td>
  //               <button class="btn btn-sm btn-primary" onclick="openModalSuaLoaiTin('${loai.idLoaiTin}', '${loai.tenLoaiTin}', ${group.idNhomTin})">Edit</button>
  //               </td>
  //             </tr> 
  //           `).join('')}
  //         </tbody>
  //       </table>
  //     `;
  //     loaiTinRow.appendChild(loaiTinCell);
  
  //     // Thêm dòng nhóm tin vào bảng
  //     tbody.appendChild(row);
  //     tbody.appendChild(loaiTinRow);
  //   });
  // }