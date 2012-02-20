$(function(){
	if(window.PIE){
		$('header#header nav, footer#footer').each(function(){
			PIE.attach(this);
		});
	}
});