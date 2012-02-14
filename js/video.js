$(function(){
	$videoCode = '<video controls="controls" poster="video/1.jpg" autoplay="autoplay" loop="loop" controls=""onclick="if(/Android/.test(navigator.userAgent))this.play();">
	 <source src="1.mp4" type="video/mp4" />
</video>
<nav id="ievid">
<h1>Ah, ah, ah, your browser sucks, please download on of these...</h1>
<a href="">Firefox</a>
<a href="">Opera</a>
<a href="">Chrome</a>
<a href="">Safari</a>
</nav>';
	$('body').prepend($videoCode);
});