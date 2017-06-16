$(document).ready(function(){
	// Get the modal
var modal = $('#commentModal');

// Get the button that opens the modal
var btn = $(".btn-comment");

// Get the <span> element that closes the modal
var span = $(".close")[0];


//Function to create submission for artical modal
function createForm(articleId){
    let $form = $(`<form action="/article/${articleId}" method="POST">`);
    let $comment = $('<input type="text"  id="comment-text" name="article-comment"> <br> ');
    let $commentBtn = $('<button class="btn btn-md btn-info" type="submit">Comment</button>');
    $form.append($comment);
    return $form;
}

// When the user clicks on the button, open the modal 

$('div.container').on("click", '.btn-comment', function(){
	
   
    let header = $('.modal-heading');
    let body = $('.modal-body');
    header.empty();
    body.empty();
    let id = $(this).data('article-id');
    $.ajax({
    	url: '/articles/' + id,
    	method: 'GET'
    }).done(function(article, status){
        let title = $("<h2>").html(article.title);
        let closeBtn =" <span class='close'>&times;</span>"
        let id_num = $("<span>").html("ID: " + article._id);
        header.append(title).prepend(closeBtn);
        body.append(id_num);
       
        body.append(createForm(article._id));
        modal.css('display', 'block');
    	
    })
})


// When the user clicks on <span> (x), close the modal
$(".modal").on('click', '.close', function(){
    modal.css('display', 'none');
});

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
// 	console.log($(event.target)[0] == modal);
// 	console.log(modal);
//     if ($(event.target) === modal) {
//     	console.log('x')
//         modal.css('display', 'none')
//     }
// }
})