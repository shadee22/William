var live_url = 'http://13.234.226.190:80/image/'
var local_url = 'http://127.0.0.1:8000/image/'
//INDEX PAGE
$(document).ready(function(){
    $("#name").slideDown(30000);
});
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
    url = "http://13.234.226.190:80/"
    $.get(url,function(data, status) {
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


// Classifier page
Dropzone.autoDiscover = false

$(document).ready(function() {
    $("#result").hide();
    $("#error").hide();
    $(".progress").hide();
    $("#name").slideDown(30000);
    // $(".names_of_players").hide()
    init();
    
});
function init() {

    let dz= new Dropzone('#dropzone',{
        url:'/image/',
        maxFiles:1,
        maxFilesize:2,
        autoProcessQueue: true

    });
    
    dz.on("addedfile", function(file) {
            $('ul p').remove()
            // $('#result-img').remove()
            
            if (dz.files[1]!=null) {
                dz.removeFile(dz.files[0]);        
            }
    });
    count = 1

    dz.on("complete", function (file) {
        // console.log('current file is : ' , file)
        let imageData = file.dataURL;
        
            
        var CSRFtoken = $('input[name=csrfmiddlewaretoken]').val();
        
        $(".progress").fadeIn()
        $.post(live_url , { 
            image_data: imageData,
            csrfmiddlewaretoken: CSRFtoken,
            timeout: 188000 
        },function(data , status){
            console.log(data);
            if (data.image_data.length == 0) {
                $(".progress").fadeOut();
                $("#error").fadeIn().delay(5000).fadeOut();
                $("#result").hide(300);
                return;
            }
            let gdata = data.image_data[0]
            
            probs = gdata['probability']
            name2number = gdata['dictionary']
            function upperCaseString(str){
                str = String(str).charAt(0).toUpperCase() + String(str).slice(1)
                str = str.split('_').join(' ')
                return str
            }
            
            jQuery.each(probs, function(i, v) {
                n = i + 1
                e = document.createElement("p")
                e.innerHTML = upperCaseString(  "<b>" + Math.round(v) + "%"+"</b>"+" : "  + name2number[i]) ;
                $("ul").append(e)
            });

            $('#result #pred').text(upperCaseString(gdata.prediction));
            $('#result').show(500)
            $(".progress").fadeOut()
            $('#result-img').attr('src' , '/static/images/har.jpg');
            console.log('Everything Loaded Properly!')
        })
       
        // dz.removeFile(file)
    });
    dz.on('error' , function(file ,res){
        $("#error").text(res)
        $("#error").show(3000).delay.hide(3000)
        $(".progress").hide();

    });
    // $("#submitBtn").on('click', function (e) {
    //     dz.processQueue();		
    // });
}
// $("#test").on('click' , function(){
//     $('#result-img').attr('src' , '/static/images/har.jpg');
// })

