
var changeFormAction = function(slb_selector, form_selector, id_btn_action){
	var optValue;
	var isDelete = false;
	var pattenCheckDelete = new RegExp('delete','i');



	$(slb_selector).on('change',function(){
		optValue = $(this).val();
        if(optValue !== ""){
			$(id_btn_action).removeAttr('disabled');
		}else{
			$(id_btn_action).attr('disabled','disabled');
		}
		console.log(optValue);
		$(form_selector).attr('action',optValue);
	});
	
	$(form_selector + " " + id_btn_action).on('click', function(){
		isDelete = pattenCheckDelete.test($(slb_selector).val());
		if(isDelete){
			var confirmDelete = confirm('bạn có muốn xoá không');
			console.log(confirmDelete);
			if(confirmDelete === false){
				return;
			}
		}

		var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
		if(numberOfChecked == 0){
			alert("hây chọn 1 phần tử");
			return;

		} else {
			var flag = false;
			var str = $(slb_selector + " option:selected").attr('data-comfirm');
			if(str != undefined) {
				flag = confirm(str);
				if(flag ==false){
					return flag;

				}else{
					$(form_selector).submit();

				}
			}else{
				console.log(optValue);
				if(optValue != undefined) {

					$(form_selector).submit();
				}
			}
		}
	})


}
function submitUpload(formUpload,fieldImage){
	$('form[name='+formUpload+']').submit(function(){
		let avatar = $(this).find('input[name='+fieldImage+']');
		$(this).find('input[name='+fieldImage+']').remove();
		$(this).append(avatar).css({'display':'none'});
	});
}
function ChangeToSlug(title){
    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();
 
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
	//In slug ra textbox có id “slug”
	return slug;
}

function checkTime(i) 
{
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function startTime() 
{
    // Lấy Object ngày hiện tại
    var today = new Date();
	
    // Giờ, phút, giây hiện tại
    var h = today.getHours();
	var d = today.getDate();
    var m = today.getMonth();
	var y = today.getFullYear();
    // Chuyển đổi sang dạng 01, 02, 03
	let time= h + '-' +d+'/'+ + m + "/" + y;
	return time ;
}
var appendMenu = function(frames){

	var time = startTime();
	var userAdmin = $('#user-locals').text();
	var xhtmlMenu = `
	<li class="gradeA odd" role="row" data-name="" data-slug="">
		<div class="item-menu">
			<div class="menu-item-col">
				<p class="menu-name"></p>
				<div class="menu-item__btn"><a class="btn btn-danger" href="" onclick="return confirm('bạn có muốn xoá phần tử này?');">Delete</a></div>
			</div>
			<div class="form-item-menu">
				<div class=" form-item-menu__content">Name :
					<input class="form-menu-name" type="text" value="" name="menu_name" />
				</div>
				<div class=" form-item-menu__content">Slug :
					<input class="form-menu-slug" type="text" value="" name="menu_slug" />
				</div>
			</div>
		</div>
		<ul></ul>
	</li>
	`
	$(frames).append(xhtmlMenu);
	$('.menu_name input').on('change',function(){
		$(this).val();
	});
	onKeyupChange();
}
var onKeyupChange = function(){
	$('input[name="menu_name"]').on('keyup',function(){
		let content = $(this).val();
		let mainLi = $(this).parents('.item-menu').parent('li.gradeA');
		mainLi.find('.menu-name').eq(0).text(content);
		mainLi.attr('data-name',content);
	})
	$('input[name="menu_slug"]').on('keyup',function(){
		let content = $(this).val();
		let mainLi = $(this).parents('.item-menu').parent('li.gradeA');
			mainLi.attr('data-slug',content);
	})
}
var changeInputHidden = function(selector,inputHidden){
	$(selector).each(function(){
		$(inputHidden).val($(this).find('option:selected').text());
		$(selector).change(function(){
			$(inputHidden).val($(this).find('option:selected').text());
		});
	});
}
$(document).ready(function(){

	changeInputHidden('select.id-name[name="categorys_id"]','input.name-id[name="categorys_name"]');
	changeInputHidden('select.id-name[name="domain_id"]','input.name-id[name="domain_name"]');
	var ckbAll = $('.cbAll');
	var fmAdmin = $('#zt-form');

	$('.btn-addNew-menu').on('click',function(){
		appendMenu('.contentListUser');
	})
	changeFormAction('#zt-form .slAction', "#zt-form", "#btn-action");

	ckbAll.on('click',function(){
		$('input:checkbox').not(this).attr('checked',this.checked);
		if($(this).is(':checked')){
			$('.ordering').attr('name','ordering');
		}else{
			$('.ordering').removeAttr('name');
		}
	})

	$('input[name=cid]').on('click',function(){
		if($(this).is(':checked')){
			$(this).parents('tr').find('.ordering').attr('name','ordering');
		}
		else{
			$(this).parents('tr').find('.ordering').removeAttr('name');
		}
	})

	


	$('select[name="filter_group"]').change(function(){
		var path = window.location.pathname.split('/');
		var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-categorys/' + $(this).val();
		window.location.pathname = linkRedirect;
	});

	$('input#name_slug').keyup(function(){
		$('input[name="slug"]').val(ChangeToSlug($(this).val()));
	})
	$('.data-avatar').on('change',function(){
		var dataSrc = $(this).val();
		// $('.img-avatar-form').attr("src",reader);
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.img-avatar-form').attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
		}
		
	})


	/************* menu page ************/
	$('.btn-delete-menu').on('click',function(){
		var resultConfirm = confirm('bạn có muốn xoá phần tử này?');
		if(resultConfirm){
			$(this).parents('.item-menu').parent('li.gradeA').remove();
			$('.btn-submit-menu').trigger('click');
		}
		
	})
	if ($('.form-item-menu').length) {
		$('.form-item-menu').slideUp('slow');
	}
	$('.btn-edit-menu').on('click',function(){
		$(this).parents('.item-menu').find('.form-item-menu').slideToggle('slow');
	});
	submitUpload('form-upload','avatar');
	submitUpload('form-upload','thumbnail');

	// .on('change',function(){
	// 	var dataSrc = $(this).data('src');

	// })



	/************* created menu ************/

	onKeyupChange();
});
