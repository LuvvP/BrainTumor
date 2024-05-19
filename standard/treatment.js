// Tìm nút "Tải Lên" và đăng ký sự kiện click
document.getElementById('uploadBtn').addEventListener('click', function(event) {
  event.preventDefault();
  event.stopPropagation(); 
  var selection = document.querySelector('.selection');
  selection.classList.remove('not-active');
  var isOpen = !selection.classList.contains('not-active');

		// Lưu trạng thái vào local storage
		if (isOpen) {
			saveSelectionState('yes');
		} else {
			saveSelectionState('no');
		}
  uploadFolder(); // Gọi hàm uploadFolder()
});

function uploadFolder() {
  var input = document.getElementById('folderInput');
  var files = input.files;
  var formData = new FormData();

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    formData.append('files[]', file);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/upload', true);

  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      var percentComplete = (e.loaded / e.total) * 100;
      document.getElementById('status').innerText = 'Đang tải lên: ' + percentComplete.toFixed(2) + '%';
    }
  };

  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var storageUrls = response.storageUrls;

      // Lưu trữ các URL lưu trữ trên storage
      localStorage.setItem('storageUrls', JSON.stringify(storageUrls));

      // Cập nhật URL mà không tải lại trang
      window.history.pushState({}, '', '/upload-success');

      document.getElementById('status').innerText = 'Tải lên thành công!';
    } else {
      document.getElementById('status').innerText = 'Đã xảy ra lỗi trong quá trình tải lên.';
    }
  };

  xhr.onerror = function() {
    document.getElementById('status').innerText = 'Đã xảy ra lỗi trong quá trình tải lên.';
  };

  xhr.send(formData);
  document.querySelector('.selection').classList.remove('not-active');
}


// Gán hàm xử lý sự kiện cho tùy chọn T1
var t1Option = document.getElementById('option1');
t1Option.addEventListener('click', function() {
    var uploadContainer = document.querySelector('.upload-container');
    var outsideDiv = document.querySelector('.outside');

    // Xóa class 'not-active' khỏi upload-container
    uploadContainer.classList.add('not-active');
  
    // Thêm class 'not-active' vào outside
    outsideDiv.classList.remove('not-active');
});
console.log(t1Option)

// Gán hàm xử lý sự kiện cho tùy chọn T2
var t2Option = document.getElementById('option2');
t2Option.addEventListener('click', function() {
    var uploadContainer = document.querySelector('.upload-container');
    var outsideDiv = document.querySelector('.outside');

    // Xóa class 'not-active' khỏi upload-container
    uploadContainer.classList.add('not-active');

    // Thêm class 'not-active' vào outside
    outsideDiv.classList.remove('not-active');
});

// Gán hàm xử lý sự kiện cho tùy chọn T1CE
var t1ceOption = document.getElementById('option3');
t1ceOption.addEventListener('click', function() {
    var uploadContainer = document.querySelector('.upload-container');
    var outsideDiv = document.querySelector('.outside');

    // Xóa class 'not-active' khỏi upload-container
    uploadContainer.classList.add('not-active');

    // Thêm class 'not-active' vào outside
    outsideDiv.classList.remove('not-active');
});

// Gán hàm xử lý sự kiện cho tùy chọn Flair
var flairOption = document.getElementById('option4');
flairOption.addEventListener('click', function() {
    var uploadContainer = document.querySelector('.upload-container');
    var outsideDiv = document.querySelector('.outside');

    // Xóa class 'not-active' khỏi upload-container
    uploadContainer.classList.add('not-active');

    // Thêm class 'not-active' vào outside
    outsideDiv.classList.remove('not-active');
});
