$(document).ready(function () {
        
    const apiUrl = "http://nguyenquocdai-001-site1.ltempurl.com/api/tin/danhsach";
    const menuApiUrl = "http://nguyenquocdai-001-site1.ltempurl.com/api/tin/menu";
    
    $("#header-placeholder").load("header.html");
    
   

    function renderArticles(articles, page) {
        const itemsPerPage = 6;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedArticles = articles.slice(start, end);

        const newsContainer = $("#news-container");
        newsContainer.empty();

        paginatedArticles.forEach(article => {
            // console.log(article); 
            newsContainer.append(`
                <div class="col-md-5">
                <div class="fh5co_hover_news_img">
                    <div class="fh5co_news_img"><img src="${article.hinhDaiDien || 'https://via.placeholder.com/150'}" alt=""/></div>
                    <div>
                    <a href="single.html?idTin=${article.idTin || ''}" class="fh5co_magna py-2">${article.tieuDe || 'No Title'}</a> 
                    <a href="" class="fh5co_mini_time py-3"> ${article.tacGia || 'không có tác giả'}  - ${article.ngayDangTin || 'no time'}</a>
                    <div class="fh5co_consectetur"> ${article.moTa || 'chưa có mô tả cụ thể'}
                    </div>
                    </div>

                </div>
            </div>

                ` 
            );
        });
    }

    // menu
function renderMenu(categories) {
const menuContainer = $("#menu-container");
menuContainer.empty(); // Clear existing menu items

categories.forEach(category => {
    const subMenuItems = category.loaiTin.map(loai => `
        <li><a class="dropdown-item" href="#" data-id-loai-tin="${loai.idLoaiTin}">${loai.tenLoaiTin}</a></li>
    `).join("");

    menuContainer.append(`
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-id-nhom-tin="${category.idNhomTin}">
                ${category.tenNhomTin}
            </a>
            <ul class="dropdown-menu">
                ${subMenuItems}
            </ul>
        </li>
    `);
});

// Add hover event to show/hide dropdown
$(".nav-item.dropdown").hover(
    function() {
        $(this).find(".dropdown-menu").stop(true, true).slideDown(200);
    },
    function() {
        $(this).find(".dropdown-menu").stop(true, true).slideUp(200);
    }
);

// Add click event for filtering articles based on loaiTin
$(".dropdown-item[data-id-loai-tin]").click(function(e) {
    e.preventDefault();
    const idLoaiTin = $(this).data("id-loai-tin");
    // Fetch articles for selected idLoaiTin
    fetchArticlesByCategory(idLoaiTin);
});
}

// Hàm lọc bài viết theo idLoaiTin
function fetchArticlesByCategory(idLoaiTin) {
const loaiTinApiUrl = "http://nguyenquocdai-001-site1.ltempurl.com/api/tin/loaitin/";

$.getJSON(menuApiUrl, function(data) { 
    if (data) {
       
        // Lấy tất cả các bài viết từ API dựa vào idLoaiTin
        $.getJSON(`${loaiTinApiUrl}${idLoaiTin}`, function(articles) {
            console.log(articles);  
            
            // Lưu bài viết đã lọc vào biến toàn cục
            window.filteredArticles = articles;
            
            // Hiển thị các bài viết đã lọc và phân trang
            renderArticles(filteredArticles, 1);
            renderPagination(filteredArticles.length, 1);
        }).fail(function() {
            console.error("Failed to fetch articles for idLoaiTin:", idLoaiTin);
        });
    } else {
        console.error("Category not found for idLoaiTin:", idLoaiTin);
    }
}).fail(function() {
    console.error("Failed to fetch menu categories.");
});
}
    
function renderPagination(totalArticles, currentPage) {
const itemsPerPage = 6;
const totalPages = Math.ceil(totalArticles / itemsPerPage);
const pagination = $("#pagination");
pagination.empty();

// Previous button
pagination.append(`
    <a href="#" class="btn_mange_pagging ${currentPage === 1 ? 'disabled' : ''}">
        <i class="fa fa-long-arrow-left"></i>&nbsp;&nbsp;Previous
    </a>
`);

// Page numbers with ellipsis if needed
for (let i = 1; i <= totalPages; i++) {
    pagination.append(`
        <a href="#" class="btn_pagging ${i === currentPage ? 'active' : ''}">${i}</a>
    `);
}

// Next button
pagination.append(`
    <a href="#" class="btn_mange_pagging ${currentPage === totalPages ? 'disabled' : ''}">
        Next&nbsp;&nbsp;<i class="fa fa-long-arrow-right"></i>
    </a>
`);

// Attach event listeners to pagination buttons
$(".btn_pagging").click(function(e) {
    e.preventDefault();
    const page = parseInt($(this).text());
    renderArticles(window.filteredArticles, page);  // Render articles based on page
    renderPagination(window.filteredArticles.length, page);  // Re-render pagination
});

$(".btn_mange_pagging").click(function(e) {
    e.preventDefault();
    if ($(this).hasClass('disabled')) return;  // Prevent click if disabled

    let newPage = currentPage;
    if ($(this).find("i").hasClass("fa-long-arrow-left")) {
        newPage = currentPage - 1;
    } else {
        newPage = currentPage + 1;
    }

    if (newPage >= 1 && newPage <= totalPages) {
        renderArticles(window.filteredArticles, newPage);  // Render articles based on new page
        renderPagination(window.filteredArticles.length, newPage);  // Re-render pagination
    }
});
}

    // Fetch all articles initially đọc hết tinh tức 
    $.getJSON(apiUrl, function(data) {
        window.articles = data; // Store articles globally
        window.filteredArticles = data; // Initially, all articles are displayed
        renderArticles(data, 1);
        renderPagination(data.length, 1);
    }).fail(function() {
        console.error("Failed to fetch articles from the API.");
    });
    
    // đọc lấy api menu 
    $.getJSON(menuApiUrl, function(data) {
        if (data && data.length > 0) {
            renderMenu(data); // Populate the menu dynamically
        } else {
            console.error("No categories found in the API response.");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Failed to fetch menu categories:", textStatus, errorThrown);
        alert("Không thể tải menu danh mục. Vui lòng thử lại sau!");
    });

    // tìm kím  
    const searchInput = document.getElementById("search");
    const suggestionsList = document.getElementById("suggestions");


    // xem nhiều 
    const api_xemnhieu="http://nguyenquocdai-001-site1.ltempurl.com/api/tin/xemnhieu";
    const $xemnhieu = $("#xemnhieucontain");
    $.get(api_xemnhieu, function (data) {
        const top3=data.slice(0,5)
        top3.forEach(function (item) {
            const html = `
                <div class="row pb-3">
                    <div class="col-5 align-self-center">
                        <img src="${item.hinhDaiDien}" alt="img" class="fh5co_most_trading"/>
                    </div>
                    <div class="col-7 paddding">
                        <div class="most_fh5co_treding_font">${item.tieuDe}</div>
                        <div class="most_fh5co_treding_font_123">${formatDate(item.ngayDangTin)}</div>
                    </div>
                </div>
            `;
            $xemnhieu.append(html);
        });
    }).fail(function (err) {
        console.error("Lỗi khi gọi API:", err);
    });

    // Hàm định dạng ngày
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    // tin hót
    const api_tinhot="http://nguyenquocdai-001-site1.ltempurl.com/api/tin/tinhot";
    const $tinhot = $("#tinhotcontain");
    $.get(api_tinhot, function (data) {
        const top3=data.slice(0,5)
        top3.forEach(function (item) {
            const html = `
                <div class="row pb-3">
                    <div class="col-5 align-self-center">
                        <img src="${item.hinhDaiDien}" alt="img" class="fh5co_most_trading"/>
                    </div>
                    <div class="col-7 paddding">
                        <div class="most_fh5co_treding_font">${item.tieuDe}</div>
                        <div class="most_fh5co_treding_font_123">${formatDate(item.ngayDangTin)}</div>
                    </div>
                </div>
            `;
            $tinhot.append(html);
        });
    }).fail(function (err) {
        console.error("Lỗi khi gọi API:", err);
    });

});