"use strict"



// Меню бургер
const iconMenu = document.querySelector('.menu__icon'); // получаем иконку бургера
const menuBody = document.querySelector('.menu__body'); // константа вынесена, чтобы код внизу её тоже видел
if (iconMenu) { // проверка, есть ли такой класс в принципе
	iconMenu.addEventListener("click", function (e) { // событие клик по иконке
		document.body.classList.toggle('_lock'); //  добавление-убавление класса _lock при открытом меню для body
		iconMenu.classList.toggle('_active'); // для самой иконки добавляется или убирается класс _active
		menuBody.classList.toggle('_active'); // и для .menu__body
	});
}

// Прокрутка при клике
// при клике 1. Происходит плавная прокрутка до нужного раздела 2.Закрывается бургер и откатываются связанные классы

const menuLinks = document.querySelectorAll('.menu__link[data-goto]'); //найти .menu__link но только с атрибутом data-goto
if (menuLinks.length > 0) { // проверка есть ли что-нибудь из этого
	menuLinks.forEach(menuLink => { // forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
		menuLink.addEventListener("click", onMenuLinkClick); // вешаем клик и создаем функцию onMenuLinkClick
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target; // объект, на который кликаем (сама ссылка)
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) { // заполнен ли дата-атрибут && существует ли объект, на который ссылается данный дата-атрибут
			const gotoBlock = document.querySelector(menuLink.dataset.goto); // получаем в константу сам объект
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;
			// - document.querySelector('.first-screen').offsetHeight;
			// см. выше - высчитываем положение объекта с учетом высоты шапки
			// const gotoBlockValue  - создается константа, с помощью функции getBoundingClientRect() top - т.к. от верха объекта - итог - местоположение в пикселях 
			// + pageYOffset - прибавить количество прокрученных пикселей (Y тк по вертикали),  -document.querySelector('header').offsetHeight - отнимается высота шапки

			// if (iconMenu.classList.contains('_active')) { // без этой части кода будет происходить прокрутка при нажатии на пункты, но меню не закроется
			// 	document.body.classList.remove('_lock');
			// 	iconMenu.classList.remove('_active');
			// 	menuBody.classList.remove('_active');
			// }

			window.scrollTo({ // скролл - обращение к окну браузера и функция прокрутки scrollTo
				top: gotoBlockValue, // нужно прокрутиться сверху высчитанной константой
				behavior: "smooth" // плавная прокрутка
			});
			e.preventDefault(); // отключение работы ссылки, чтобы никуда не отсылала, а только прокручивала
		}
	}
}

// *** параллакс

$(window).scroll(function (event) {
	var s = 0 - $(this).scrollTop() / 3;
	$('.first-screen__bg').css('transform', 'translate3d(0, ' + s + 'px, 0)');
});

// ***

//FIELDS
$('input,textarea').focus(function () {
	if ($(this).val() == $(this).attr('data-value')) {
		$(this).addClass('focus');
		$(this).parent().addClass('focus');
		if ($(this).attr('data-type') == 'pass') {
			$(this).attr('type', 'password');
		};
		$(this).val('');
	};
	removeError($(this));
});
$('input[data-value], textarea[data-value]').each(function () {
	if (this.value == '' || this.value == $(this).attr('data-value')) {
		this.value = $(this).attr('data-value');
		if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
			$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
		}
	}
	if (this.value != $(this).attr('data-value') && this.value != '') {
		$(this).addClass('focus');
		$(this).parent().addClass('focus');
		if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
			$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
		}
	}

	$(this).click(function () {
		if (this.value == $(this).attr('data-value')) {
			if ($(this).attr('data-type') == 'pass') {
				$(this).attr('type', 'password');
			};
			this.value = '';
		};
	});
	$(this).blur(function () {
		if (this.value == '') {
			this.value = $(this).attr('data-value');
			$(this).removeClass('focus');
			$(this).parent().removeClass('focus');
			if ($(this).attr('data-type') == 'pass') {
				$(this).attr('type', 'text');
			};
		};
	});
});
$('.form-input__viewpass').click(function (event) {
	if ($(this).hasClass('active')) {
		$(this).parent().find('input').attr('type', 'password');
	} else {
		$(this).parent().find('input').attr('type', 'text');
	}
	$(this).toggleClass('active');
});

//$('textarea').autogrow({vertical: true, horizontal: false});


//VALIDATE FORMS
$('form button[type=submit]').click(function () {
	var er = 0;
	var form = $(this).parents('form');
	var ms = form.data('ms');
	$.each(form.find('.req'), function (index, val) {
		er += formValidate($(this));
	});
	if (er == 0) {
		removeFormError(form);
		/*
			var messagehtml='';
		if(form.hasClass('editprofile')){
			var messagehtml='';
		}
		formLoad();
		*/

		//ОПТРАВКА ФОРМЫ
		/*
		function showResponse(html){
			if(!form.hasClass('nomessage')){
				showMessage(messagehtml);
			}
			if(!form.hasClass('noclear')){
				clearForm(form);
			}
		}
		var options={
			success:showResponse
		};
			form.ajaxForm(options);
		
	
		setTimeout(function(){
			if(!form.hasClass('nomessage')){
				//showMessage(messagehtml);
				showMessageByClass(ms);
			}
			if(!form.hasClass('noclear')){
				clearForm(form);
			}
		},0);
	
		return false;
		*/

		if (ms != null && ms != '') {
			showMessageByClass(ms);
			return false;
		}
	} else {
		return false;
	}
});
function formValidate(input) {
	var er = 0;
	var form = input.parents('form');
	if (input.attr('name') == 'email' || input.hasClass('email')) {
		if (input.val() != input.attr('data-value')) {
			var em = input.val().replace(" ", "");
			input.val(em);
		}
		if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(input.val())) || input.val() == input.attr('data-value')) {
			er++;
			addError(input);
		} else {
			removeError(input);
		}
	} else {
		if (input.val() == '' || input.val() == input.attr('data-value')) {
			er++;
			addError(input);
		} else {
			removeError(input);
		}
	}
	if (input.attr('type') == 'checkbox') {
		if (input.prop('checked') == true) {
			input.removeClass('err').parent().removeClass('err');
		} else {
			er++;
			input.addClass('err').parent().addClass('err');
		}
	}
	if (input.hasClass('name')) {
		if (!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))) {
			er++;
			addError(input);
		}
	}
	if (input.hasClass('pass-2')) {
		if (form.find('.pass-1').val() != form.find('.pass-2').val()) {
			addError(input);
		} else {
			removeError(input);
		}
	}
	return er;
}
function formLoad() {
	$('.popup').hide();
	$('.popup-message-body').hide();
	$('.popup-message .popup-body').append('<div class="popup-loading"><div class="popup-loading__title">Идет загрузка...</div><div class="popup-loading__icon"></div></div>');
	$('.popup-message').addClass('active').fadeIn(300);
}
function showMessageByClass(ms) {
	$('.popup').hide();
	popupOpen('message.' + ms, '');
}
function showMessage(html) {
	$('.popup-loading').remove();
	$('.popup-message-body').show().html(html);
}
function clearForm(form) {
	$.each(form.find('.input'), function (index, val) {
		$(this).removeClass('focus').val($(this).data('value'));
		$(this).parent().removeClass('focus');
		if ($(this).hasClass('phone')) {
			maskclear($(this));
		}
	});
}
function addError(input) {
	input.addClass('err');
	input.parent().addClass('err');
	input.parent().find('.form__error').remove();
	if (input.hasClass('email')) {
		var error = '';
		if (input.val() == '' || input.val() == input.attr('data-value')) {
			error = input.data('error');
		} else {
			error = input.data('error');
		}
		if (error != null) {
			input.parent().append('<div class="form__error">' + error + '</div>');
		}
	} else {
		if (input.data('error') != null && input.parent().find('.form__error').length == 0) {
			input.parent().append('<div class="form__error">' + input.data('error') + '</div>');
		}
	}
	if (input.parents('.select-block').length > 0) {
		input.parents('.select-block').parent().addClass('err');
		input.parents('.select-block').find('.select').addClass('err');
	}
}
function addErrorByName(form, input__name, error_text) {
	var input = form.find('[name="' + input__name + '"]');
	input.attr('data-error', error_text);
	addError(input);
}
function addFormError(form, error_text) {
	form.find('.form__generalerror').show().html(error_text);
}
function removeFormError(form) {
	form.find('.form__generalerror').hide().html('');
}
function removeError(input) {
	input.removeClass('err');
	input.parent().removeClass('err');
	input.parent().find('.form__error').remove();

	if (input.parents('.select-block').length > 0) {
		input.parents('.select-block').parent().removeClass('err');
		input.parents('.select-block').find('.select').removeClass('err').removeClass('active');
		//input.parents('.select-block').find('.select-options').hide();
	}
}
function removeFormErrors(form) {
	form.find('.err').removeClass('err');
	form.find('.form__error').remove();
}
function maskclear(n) {
	if (n.val() == "") {
		n.inputmask('remove');
		n.val(n.attr('data-value'));
		n.removeClass('focus');
		n.parent().removeClass('focus');
	}
}
function searchselectreset() {
	$.each($('.select[data-type="search"]'), function (index, val) {
		var block = $(this).parent();
		var select = $(this).parent().find('select');
		if ($(this).find('.select-options__value:visible').length == 1) {
			$(this).addClass('focus');
			$(this).parents('.select-block').find('select').val($('.select-options__value:visible').data('value'));
			$(this).find('.select-title__value').val($('.select-options__value:visible').html());
			$(this).find('.select-title__value').attr('data-value', $('.select-options__value:visible').html());
		} else if (select.val() == '') {
			$(this).removeClass('focus');
			block.find('input.select-title__value').val(select.find('option[selected="selected"]').html());
			block.find('input.select-title__value').attr('data-value', select.find('option[selected="selected"]').html());
		}
	});
}
