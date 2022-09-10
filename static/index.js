
url = "http://127.0.0.1:8000"

window.onload = function() {
    $('#modal').hide();
    setTimeout(function() {
        $( "#modal" ).fadeIn()
      }, 5000);

    setTimeout(function() {
        $( "#modal" ).fadeOut()
    }, 120000);
}
$('.close').click(function(){
    $("#modal").fadeOut();
});

$('.name').click(function () {

        window.location = 'http://127.0.0.1:8000/test_unit/';
        
});



$("#name").slideDown("slow");
function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i in uiBathrooms) {
      if(uiBathrooms[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }
  
function onPageLoad() {
    console.log( "document loaded" );
    // var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
    // var url = "/api/get_location_names"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
    url = "http://127.0.0.1:8000/"
    live_url = "http://13.234.226.190:80/"
    $.get(live_url,function(data, status) {
        console.log("got response for get_location_names request");
        if(data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for(var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
  }
$('.alexa-text').keypress(function (e) {
    if (e.which == 32){
        console.log('Space Detected');
        return false;
    }
    if (e.which == 13) {
        let val = capital_first_letter($('.alexa-text').val())
        $("#modal").fadeOut();
        $.post(url.concat("/saving_names/"),{
            names : val,
        },function(res){
            $('.name').text(val);
        });
    }
});
function capital_first_letter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);

}