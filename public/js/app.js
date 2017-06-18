$(document).ready(function() {
    // Get the modal
    var modal = $('#commentModal');

    // Get the button that opens the modal
    var btn = $(".btn-comment");

    // Get the <span> element that closes the modal
    var span = $(".close")[0];

    //Function to create submission for artical modal
    function createForm(articleId) {
        let $form = $(`<form action="/articles/${articleId}" method="POST">`);
        let $commentTitle = $('<input type="text" name="title" id="comment-text" name="article-comment" required> <br> ');
        let $commentMessage = $('<input type="text" name="message" id="comment-text" name="article-comment" required> <br> ');
        let $commentBtn = $('<button class="btn btn-md btn-info" type="submit">Comment</button>');
        $form.append($commentTitle).append($commentMessage).append($commentBtn);
        return $form;
    }
    //Takes in an array of ObjectIDs for Comments that get added to the Comment Section 
    function renderComments(commentIdArray) {

        $("#commentSection").empty();
        if (commentIdArray.length) {

            for (let doc in commentIdArray) {
                let currentCom = commentIdArray[doc];
                let $comm = $('<div>').addClass('comment');
                let $commTitle = $('<h4>').text(currentCom.title);
                let $commBody = $('<p>').text(currentCom.message);
                let $deleteCommBtn = $(`<button class="btn btn-md btn-danger btn-delete-comm" data-comment-id=${currentCom._id}>&times;</button>`);
                $comm.append($deleteCommBtn).append($commTitle).append($commBody);
                $("#commentSection").append($comm);
            }

        } else {
            //Inform user if no comments attached to article
            $('#commentSection').html('<h3 class="error comment-error"><strong> No comments</strong></h3>')
        }

    }

    $(".btn-enter").click(function() {
       
        window.location = "/scrape"
    });
    // When the user clicks on the button, open the modal 

    $('div.container').on("click", '.btn-comment', function() {


        let header = $('.modal-heading');
        let body = $('.modal-body');
        header.empty();
        body.empty();
        let id = $(this).data('article-id');
        $.ajax({
            url: '/articles/' + id,
            method: 'GET'
        }).done(function(article, status) {
            let title = $(`<h2><a href=${article.link}>${article.title}</a></h2>`);
            let closeBtn = " <span class='close'>&times;</span>";
            let id_num = $("<span>").html("ID: " + article._id);
            let $commentSection = $('<div>').attr('id', 'commentSection').addClass('well').text('Comments');

            header.append(title).prepend(closeBtn).append(id_num);
            body.append($commentSection);
            renderComments(article.comment)
            body.append(createForm(article._id));
            modal.css('display', 'block');

        })
    });


    $('.modal-body').on('click', '.btn-delete-comm', function() {
        let id = $(this).data('comment-id');
        $.ajax({
            url: "/comment/" + id,
            method: "DELETE"
        }).done(function(result) {
            $.ajax({
                url: "/articles",
                method: "GET"
            }).done(function(article) {
                renderComments(article.comments);
            })
        });
    });


    // When the user clicks on <span> (x), close the modal
    $(".modal").on('click', '.close', function() {
        modal.css('display', 'none');
    });

})

