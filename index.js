
!function(window, document, $, undefined) {
    
    //loading显示
	$('.load').show();
	var param = {
		size:20,
		page:0,
		totalPage:2
	};
    var cache = {};

	////////模拟后台数据
		var fenleiArr = [
			{"id": 1, name: "历史类"},
			{"id": 2, name: "文学类"},
			{"id": 3, name: "科技类"},
			{"id": 4, name: "军事类"},
			{"id": 5, name: "小说类"}
		];


	// 调用函数 
	var into = function() {
		// alert(123)
		djshijian();
		getobj();
		panduan();
		fenlei();
		showDateTimePickerClick();	
		keydown13();
	};
	into();

 /////渲染分类sel
	function fenlei() {
		var data = fenleiArr,
			option = ['<option value=0 >请选择</option>'];
		$.each(data, function(i, obj) {
			option.push('<option value=',i+1 ,'>', obj.name,'</option>');
		});
		// console.log(data);
		$('#fenleiSel').html(option.join(''));
	}

   ///get('books_list.php')
	function getobj() {
		var url = 'books_list.php';
		// console.log(param);
		$.extend(param, {query:param.query||''})
		$.get(url, param, function(obj) {
			if(obj.success) {
				// console.log(param.query);
				createForm(obj.data);
				renderPaging(obj);
			}else{
				alert('您的网络不稳定，请稍后重试！');
			}
		}, 'json');
	}

	function renderPaging(obj) {

		var total = obj.total,
			size = param.size,
			totalPage = Math.ceil(total / size),
			i,
			totalArr = [];
		// console.log(size);

		if (param.page == 0) {
				totalArr.push(
					'<li class="disabled" class="first-page">',
						'<a href="javascript:;" aria-label="Previous">',
						  '<span aria-hidden="true">&laquo;</span>',
						'</a>',
					'</li>',
					'<li class="disabled" class="prev">',
						'<a href="javascript:;">',
						  '<span aria-hidden="true">&lsaquo;</span>',
						'</a>',
					'</li>'
				);
			} else {
				totalArr.push(
					'<li class="first-page">',
						'<a href="javascript:;" aria-label="Previous">',
						  '<span aria-hidden="true">&laquo;</span>',
						'</a>',
					'</li>',
					'<li class="prev">',
						'<a href="javascript:;">',
						  '<span aria-hidden="true">&lsaquo;</span>',
						'</a>',
					'</li>'
				);
			}

		for(i=0; i<totalPage; i++) {
			if(i == param.page) {
				totalArr.push('<li class="active" page="', i ,'"><a href="javascript:;">', (i + 1), '</a></li>');
			}else {

				totalArr.push('<li page="', i ,'"><a href="javascript:;">', (i + 1), '</a></li>');
			}
		}

		totalArr.push(
				'<li class="next">',
					'<a href="javascript:;" aria-label="Next">',
					  '<span aria-hidden="true">&rsaquo;</span>',
					'</a>',
				'</li>',
				'<li class="last-page">',
					'<a href="javascript:;" aria-label="Next">',
					  '<span aria-hidden="true">&raquo;</span>',
					'</a>',
				'</li>'
			);

		// console.log(totalArr.join(''))
		$('#renderPage').html(totalArr.join(''));
	}


	
	/////////渲染表格
	function createForm(data) {
		// console.log(data);
		var form = [];
		$.each(data, function(i, obj) {
			var status = obj.status;        
			var inStatus = {1:'上架', 0:'下架'};

			var borrow_status = obj.borrow_status;
			var inBorrowStatus = {0:'借出', 1:'未借出'};

			// var p_date =obj.p_date.split(' ')[0];
			var p_date = obj.p_date.substr(0 ,10);	///////?????????????????

			var fenleiys = {    ///分类映射
				1: "历史类",
				2: "文学类",
				3: "科技类",
				4: "军事类",
				5: "小说类",
				0: "其它类"
			};

			form.push('<tr>',
			'<td>', '<input type="checkbox" id=', obj.id,'>' ,'</td>',
             '<td data-name="name">',i+1, '. ' ,  obj.name ,'</td>',
             '<td>', obj.author ,'</td>',
             '<td>', obj.publisher ,'</td>',
             '<td> ￥ ', obj.price ,'</td>',
             '<td>', p_date ,'</td>',
             '<td>',fenleiys[obj.classify] ,'</td>',
             '<td>', inStatus[status], '</td>',
             '<td>', inBorrowStatus[borrow_status],'</td>',
           '</tr>');
			// console.log(inStatus[status]);
			cache[obj.id] = obj;    ////////////////??????????????
		});

		// console.log(cache);
		$('#bookTable tbody').html(form.join(''));
		$('.load').hide();

	}

   ///   绑定点击事件
	function djshijian() {
		$('#addBooks').on('click', showdhk);  //新增图书按钮事件
		$('#save').on('click', getVal);	  // 保存按钮事件
		$('#ttCheckBox').on('click', onTtCheckBoxClick); // 全选按钮事件
		$('#delBooks').on('click', onDelBooksClick);  // 删除按钮事件
		$('#bookTable').on('click', 'tbody input[type="checkbox"]', onInputClick); // 多选按钮
		$('#alterBooks').on('click', onAlterBooksClick); //修改按钮事件
		$('#searchBtn').on('click', onSearchBtnClick);	//搜索按钮事件
		$('#renderPage').on('click', 'li', onRenderPageLiClick);  //分页li
		$('#jumpBtn').on('click', onJumpBtnClick);
	}


 	function onJumpBtnClick() {
			var $jumpIpt = $('#jumpIpt'),
				page = $jumpIpt.val();
			if (isNaN(page)) {
				alert('请输入一个正常的页数！');
				$jumpIpt.select();
				return;
			}

			if (page > param.totalPage) {
				page = param.totalPage;
			}

			if (page < 1) {
				page = 1;
			}

			param.page = --page;
			getobj();
			$('#jumpIpt').val(page * 1 + 1);
		}


	//分页li点击事件
	function onRenderPageLiClick() {

		var $this = $(this),
		    currPage = $this.attr('page');
		    param.page = currPage;
		    console.log(currPage);
		    getobj();
	}

	
    /////////搜索按钮事件
	function onSearchBtnClick() {
		var searchIptVal = $('#searchIpt').val();
		// console.log(searchIptVal);
		param.query = searchIptVal;
		getobj();
		$(this).addClass('loading-sm');
		$(this).text('退出')

	}

	//回车键（13）事件
	function keydown13() {
		$('body').on('keydown', function() {
	 		if (event.keyCode == "13") {   //keyCode=13是回车键
	                 $('#searchBtn').click();
	        }
		});
	}


	////修改按钮绑定点击事件
	function onAlterBooksClick() {
		var $alterCheckBox = $('#bookTable tbody input[type="checkbox"]:checked'),
			id = $alterCheckBox[0].id;
			// console.log(id);
		var currCheckBox = cache[id];
		// console.log(currCheckBox);
		var $listForm = $('#listForm');
		$listForm.find('#hiddenId').val(currCheckBox.id);
		$listForm.find('#booksName').val(currCheckBox.name);
		$listForm.find('#booksAuthor').val(currCheckBox.author);
		$listForm.find('#publisher').val(currCheckBox.publisher);
		$listForm.find('#price').val(currCheckBox.price);
		$listForm.find('#booksDate').val(currCheckBox.p_date.substr(0, 10));
		$listForm.find('#fenleiSel').val(currCheckBox.classify);
		$listForm.find('input[name="status"][value="'+ currCheckBox.status +'"]').trigger('click');
		$listForm.find('input[name="borrow_status"][value="'+ currCheckBox.borrow_status +'"]').trigger('click');

		$('#myModalLabel').text('修改图书信息');
		$('#save').text('修改并退出').removeClass('update');
		$('#myModal').modal('show');
	}

	////显示日历组件
	function showDateTimePickerClick() {
		$("#booksDate").datetimepicker({
			format: "yyyy-mm-dd",
			todayBtn: true,
			weekStart:1,
			minView:2,
			autoclose:true,
			language:'zh-CN'
		});
	}

   /////判断删除按钮的禁用
	function onInputClick() {
		var len = $('#bookTable tbody input[type="checkbox"]:checked').length,
			$delBooks = $('#delBooks'),
			$alterBooks= $('#alterBooks');
		if(len > 0) {
			$delBooks.removeAttr('disabled', 'disabled');
			if(len == 1) {
				$alterBooks.removeAttr('disabled', 'disabled');
			}else {
				$alterBooks.attr('disabled', 'disabled');
			}

		}else {
			$delBooks.attr('disabled', 'disabled');	
			$alterBooks.attr('disabled', 'disabled');
		}
	}

	//////删除按钮的绑定事件
	function onDelBooksClick() {
		var $inputChecked, ids = [];
		if(!confirm('你却定要删除图书吗？')) {
			return;
		}
			$('.load').show();
			$inputChecked = $('#bookTable tbody input[type="checkbox"]:checked');
			$inputChecked.each(function() {
				ids.push(this.id);
				console.log(ids);
			});

			$.get('books_del.php', {ids:ids.join(',')}, function(response) {
				if(response.success) {
					getobj();  
				}else {
					alert('删除失败')
				}
			}, 'json');
		
	} 

	////全选和取消全选
	function onTtCheckBoxClick() {

		$('#ttCheckBox').toggleClass('ceshi');
			if($('#ttCheckBox').hasClass('ceshi')) {
				$('#bookTable tbody input[type=checkbox]').attr('checked', 'checked');		
			}else {
				$('#bookTable tbody input[type=checkbox]').removeAttr('checked', 'checked');
			}
	}

   ///显示对话框
	function showdhk() {
		$('#myModalLabel').text('新增图书信息');
		$('#save').text('保存并退出').addClass('update');
		$('#myModal').modal('show');
	}

   //// $.get('books_add.php');  隐藏对话框
	function getVal() {	
		var $this = $(this), data, url;
		$this.addClass('loading-sm');
 	// 	if($this.hasClass('loading-sm')) {
		// 	return;
		// }
		
		$this.addClass('loading-sm');

	    data = {
			name:$('#booksName').val(),
			author:$('#booksAuthor').val(),
			publisher:$('#publisher').val(),
			price:$('#price').val(),
			p_date:$('#booksDate').val(),
			classify:$('#fenleiSel').val(),
			status:$('input[name=status]:checked').val(),
			borrow_status:$('input[name=borrow_status]:checked').val()
		};
		// console.log($('input[name=status]:checked').val());
		// console.log($('input[name=borrow_status]:checked').val());
		
		// console.log(data);

////表单验证START
		// 验证书名
		if($('#booksName').val() == "") {
 			$('#booksName').parent().addClass('has-error');
 			$('#booksName').attr('placeholder', '书名不能为空！！！');
 			return false;
 		}
 	    //验证作者
 	    if($('#booksAuthor').val() == "") {
 			$('#booksAuthor').parent().addClass('has-error');
 			$('#booksAuthor').attr('placeholder', '作者不能为空！！！');
 			return false;
 		}
 		//验证出版社
 		if($('#publisher').val() == "") {
 			$('#publisher').parent().addClass('has-error');
 			$('#publisher').attr('placeholder', '出版社不能为空！！！');
 			return false;
 		}
 		//验证价格 isNaN($('#price').val())
 		if($('#price').val() == "" ) {
 			$('#price').parent().addClass('has-error');
	 		$('#price').attr('placeholder', '价格不能为空！！！');
	 		return false;
 		}
 		if(isNaN($('#price').val())) {
 			alert('这写的是啥呀')
 			// $('#price').parent().addClass('has-error');
	 		// $('#price').attr('placeholder', '请填写正确的价格格式！！！');
	 		return false;
 		}
 		//验证出版日期
 		if($('#booksDate').val() == "" ) {
 			$('#booksDate').parent().addClass('has-error');
	 		$('#booksDate').attr('placeholder', '点击此处选择时间！！！');
	 		return false;
 		}
///表单验证END


		///判断点击的是新增按钮还是修改按钮
		if($this.hasClass('update')) {  //新增
			url = 'books_add.php';
		}else {  // 修改
			data['id'] = $('#hiddenId').val();
			url = 'books_update.php';
		}

		// console.log($('#hiddenId').val());
		// console.log(data);
 	
 		// return;

		$.get(url, data, function(arr) {   //回调函数   后台的返回值传给形参

			// console.log(arr);
			if(arr.success) {
				$('#myModal').modal('hide');
				$('#save').removeClass('loading-sm');
				$('.load').show();

			}else {
				alert('您的网络不稳定，请稍后重试！');
			}
			getobj();
		}, 'json');
	}

	//判断借出状态，上架状态的逻辑点击
	function panduan() {
		$('#inlineRadio3').click(function() {
			$('#borrow_status2').attr({"data-ceshi":"ceshi", "disabled":""});
		});
		$('#inlineRadio5').click(function() {
			$('#status2').attr({"data-ceshi":"ceshi", "disabled":""});
		});
		$('#inlineRadio2, #inlineRadio4').click(function() {
			$('#borrow_status2, #status2').removeAttr('disabled');
		});
	}
	
}(window, document, jQuery);




//////数组去重1
// var arr1 = [1, 3, 2, 1, 4, 3];
// function qiue(arr) {
// 	var newArr = [], i;
// 	for(i=0; i<arr.length; i++) {
// 		if(newArr.indexOf(arr[i]) == -1) {
// 		newArr.push(arr[i]);
// 		}
// 	}
// 	return newArr;
// }
// var x = qiue(arr1);
// console.log(x);

// 数组去重2
// var unique3 = function(arr1){
//  var res = [];
//  var json = {};
//  for(var i = 0; i < arr1.length; i++){
//   if(!json[arr1[i]]){
//    res.push(arr1[i]);
//    json[arr1[i]] = 1;
//   }
//  }
//  return res;
// }
// var arr = [112,112,34,'你好',112,112,34,'你好','str','str1'];
// console.log(unique3(arr));

// (function(x){
//     delete x;
//     alert(x);
// })(1+5);


