$(document).ready(function(){
	// Get the modal
var modal = $('#commentModal');

// Get the button that opens the modal
var btn = $(".btn-comment");
console.log(btn);

// Get the <span> element that closes the modal
var span = $(".close")[0];

// When the user clicks on the button, open the modal 

btn.bind("click", function(){
	console.log(modal);
    modal.css('display', 'block');
})
// btn.onclick = function() {
// 	console.log('click button');
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.css('display', 'none');
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
// 	console.log($(event.target)[0] == modal);
// 	console.log(modal);
//     if ($(event.target) === modal) {
//     	console.log('x')
//         modal.css('display', 'none')
//     }
// }
// })