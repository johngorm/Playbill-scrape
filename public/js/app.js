$(document).ready(function(){
	// Get the modal
var modal = $('#commentModal');

// Get the button that opens the modal
var btn = $(".btn-comment");

// Get the <span> element that closes the modal
var span = $(".close")[0];


//Function to create submission for artical modal
function createForm(articleId){
    let $form = $(`<form action="/articles/${articleId}" method="POST">`);
    let $commentTitle = $('<input type="text" name="title" id="comment-text" name="article-comment" required> <br> ');
     let $commentMessage = $('<input type="text" name="message" id="comment-text" name="article-comment" required> <br> ');
    let $commentBtn = $('<button class="btn btn-md btn-info" type="submit">Comment</button>');
    $form.append($commentTitle).append($commentMessage).append($commentBtn);
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
        let closeBtn =" <span class='close'>&times;</span>";
        let id_num = $("<span>").html("ID: " + article._id);
        let $commentSection = $('<div>').attr('id', 'commentSection').addClass('well').text('Comments');
        
       

        if(article.comment.length){
            console.log(article.comment);
            for(let doc in article.comment){
                let currentCom = article.comment[doc];
                let $comm = $('<div>').addClass('comment');
                //Get a title from the database or create one for the client that
                let $commTitle = $('<h3>').text(doc.title);
                let $commBody = $('<p>').text(doc.message);
                let $deleteCommBtn = $(`<button class="btn btn-lg btn-danger btn-delete-comm" data-commentID=${doc._id}>&times;</button>`);
                $comm.append($commTitle).append($commBody);
                $commentSection.append($comm);
            }
        }

        header.append(title).prepend(closeBtn).append(id_num);
        body.append($commentSection).append(createForm(article._id));
        modal.css('display', 'block');
    	
    })
});


$('div#commentSection').on('click', '.btn-delete-comm', function(){

});


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