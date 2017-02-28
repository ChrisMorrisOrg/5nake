// Get play count

$(document).ready(function(){
    $.ajaxSetup({cache:false});

    $.ajax({
        type: 'GET',
        url: '/plays',
        dataType: 'json',
        success: function(data) {
            $('.playcount').text(data.plays + " plays to date!");
        },
        error: function(data, textStatus, errorThrown) {
            $('.playcount').text("Thanks for sharing!");
        }
    });
});
