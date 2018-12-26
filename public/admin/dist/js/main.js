
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

$(document).ready(function(){
	var ckbAll = $('.cbAll');
	var fmAdmin = $('#zt-form');


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

	$('select.id-name').each(function(){
		$('input.name-id').val($(this).find('option:selected').text());
		$('select.id-name').change(function(){
			$('input.name-id').val($(this).find('option:selected').text());
		});
	});


	$('select[name="filter_group"]').change(function(){
		var path = window.location.pathname.split('/');
		var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-group/' + $(this).val();
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

	submitUpload('form-upload','avatar');
	submitUpload('form-upload','thumbnail');

	// .on('change',function(){
	// 	var dataSrc = $(this).data('src');

	// })

});