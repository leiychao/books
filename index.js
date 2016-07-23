
!function() {

	// 调用函数 
	var into = function() {
		// alert(123)
		djshijian();
		getobj();	
	};
	into();

   ///get('books_list.php')
	function getobj() {
		var url = 'books_list.php';
		$.get(url, {}, function(obj) {
			if(obj.success) {
				createForm(obj.data);
			}else{
				alert('您的网络不稳定，请稍后重试！');
			}
		}, 'json');
	}

	/////////渲染表格
	function createForm(data) {
		// console.log(data);
		var form = [];
		$.each(data, function(i, obj) {
			form.push('<tr>',
             '<td>', obj.name ,'</td>',
             '<td>', obj.author ,'</td>',
             '<td>', obj.publisher ,'</td>',
             '<td>', obj.price ,'</td>',
             '<td>', obj.p_date ,'</td>',
             '<td>', obj.classify ,'</td>',
             '<td></td>',
             '<td></td>',
           '</tr>');
		});
		console.log(form);
		$('#bookTable tbody').html(form.join(''));
	}

   ///   绑定点击事件
	function djshijian() {
		$('#addBooks').on('click', showdhk);
		$('#save').on('click', getVal);	
	}

   ///显示对话框
	function showdhk() {
		$('#myModal').modal('show');
	}

   //// $.get('books_add.php');  隐藏对话框
	function getVal() {
		// alert(123)
		var data = {
			name:$('#booksName').val(),
			author:$('#booksAuthor').val(),
			publisher:$('#publisher').val(),
			price:$('#price').val(),
			p_date:$('#booksDate').val(),
			classify:$('#classify').val()
			
		},
			url = 'books_add.php';
		// console.log(data);

		$.get(url, data, function(arr) {   //回调函数   后台的返回值传给形参

			// console.log(arr);
			if(arr.success) {
				alert('保存成功！');
			}else {
				alert('您的网络不稳定，请稍后重试！');
			}
			// location.reload();
			getobj();
		}, 'json');
		$('#myModal').modal('hide');

	}
}();



// !function() {

// 	$('#addBooks').click(function() {
// 	    $('#myModal').modal('show');
// 	});

// 	$('#save').on('click', function() {
// 		var data = {
// 			name:$('#booksName').val(),
// 			author:$('#booksAuthor').val(),
// 			publisher:$('#publisher').val(),
// 			price:$('#price').val(),
// 			p_date:$('#booksDate').val(),
// 			classify:$('#classify').val()
// 		};
// 		// console.log(data);

// 		$.get("books_add.php", data, function(arr) {
// 			if(arr.success) {
// 				alert('保存成功！');
// 			}else {
// 				alert('您的网络不稳定，请稍后重试！');
// 			}

// 		}, 'json');

// 		$('#myModal').modal('hide');
// 	});


// 	function sclist() {
// 		var data = {
// 			name:$('#booksName').val(),
// 			author:$('#booksAuthor').val(),
// 			publisher:$('#publisher').val(),
// 			price:$('#price').val(),
// 			p_date:$('#booksDate').val(),
// 			classify:$('#classify').val()
// 		};
// 		console.log(data);
// 		$.get('books_add.php', data, function(obj) {
			
// 		}, 'json');
// 		var lis = [];
// 		$.each(data, function(i, obj) {
// 			lis.push(
// 				'<tr>',
// 		             '<td>', data.name, '</td>',
// 		             '<td>', data.author, '</td>',
// 		             '<td>', data.publisher, '</td>',
// 		             '<td>', data.price, '</td>',
// 		             '<td>', data.p_date, '</td>',
// 		             '<td>', data.classify, '</td>',
//                 '</tr>');
// 	});

// 		$('#bookTable tbody').html(lis.join(''));
// 	}
// 	sclist();
// }();


