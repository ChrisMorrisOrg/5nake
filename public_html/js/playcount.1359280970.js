// Get play count
// Will be posted soon to GitHub.

$(document).ready(function(){
    $.ajaxSetup({cache:false});

    $.ajax({
        type: 'GET',
        url: 'http://5nake.com/plays',
        dataType: 'json',
        success: function(data) {
            $('.playcount').text(data.plays + " plays to date!");
        },
        error: function(data, textStatus, errorThrown) {
            $('.playcount').text("Thanks for sharing!");
        }
    });
});
