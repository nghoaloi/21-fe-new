    $(document).ready(function () {
    // Khi nhấn vào "Quản lý tin tức"
    $('#news-management').click(function (e) {
        e.preventDefault(); // Ngăn chặn việc tải lại trang
        $('#view').load('tin_table.html'); // Tải bảng tin tức vào #view
    });

    // Khi nhấn vào "Quản lý user"
    $('#user-management').click(function (e) {
        e.preventDefault(); // Ngăn chặn việc tải lại trang
        $('#view').load('user_table.html'); // Tải bảng người dùng vào #view
    });
    // nhấn vào quản lý nhóm tin
    $('#mhontin-management').click(function(e){
        e.preventDefault();
        $('#view').load('nhomtin_table.html');
    });
    $('#binhluan-management').click(function(e){
        e.preventDefault();
        $('#view').load('binhluan_table.html');
    });    
    $('#loaitin-management').click(function(e){
        e.preventDefault();
        $('#view').load('loaitin_table.html');
    });
});
