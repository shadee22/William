var live_url = 'http://13.234.226.190:80/william_classifier/'
var local_url = 'http://127.0.0.1:8000/william_classifier/'
// Classifier page
Dropzone.autoDiscover = false

$(document).ready(function() {
    
    $("#result").hide();
    $("#error").hide();
    $(".loading").hide();

    init();
    
});
function init() {

    let dz= new Dropzone('#dropzone',{
        url:live_url,
        maxFiles:1,
        maxFilesize:2,
        autoProcessQueue: true

    });
    
    dz.on("addedfile", function(file) {
            $('ul p').remove()
            $('#result').hide(500);
            
            if (dz.files[1]!=null) {
                dz.removeFile(dz.files[0]);        
            }
    });
    count = 1

    dz.on("complete", function (file) {
        // console.log('current file is : ' , file)
        let imageData = file.dataURL;
        
            
        var CSRFtoken = $('input[name=csrfmiddlewaretoken]').val();
        
        $(".loading").fadeIn()
        $.post(live_url , { 
            image_data: imageData,
            csrfmiddlewaretoken: CSRFtoken,
            timeout: 188000 
        },function(data , status){
            console.log(data);
            if (data.image_data.length == 0) {
                $(".loading").fadeOut();
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
            $(".loading").hide()
            $('#result-img').attr('src' , '/static/images/har.jpg');
            console.log('Everything Loaded Properly!')
        })
       
        // dz.removeFile(file)
    });
    dz.on('error' , function(file ,res){
        $("#error").text(res)
        $("#error").show(3000).delay.hide(3000)
        $(".loading").hide();

    });
    // $("#submitBtn").on('click', function (e) {
    //     dz.processQueue();		
    // });
}
// $("#test").on('click' , function(){
//     $('#result-img').attr('src' , '/static/images/har.jpg');
// })
