

Dropzone.autoDiscover = false

$(document).ready(function() {
    $("#result").hide();
    $("#error").hide();
    $(".progress").hide();
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
        var url = 'http://13.234.226.190:80/image/'
        $(".progress").fadeIn()
        $.post(url , { 
            image_data: imageData,
            csrfmiddlewaretoken: CSRFtoken,
            timeout: 188000 //
        },function(data , status){
            console.log(data)
            // console.log('completed')
            // if (data.image_data.length == 0) {
            //     $(".progress").fadeOut();
            //     $("#error").fadeIn().delay(5000).fadeOut();
            //     $("#result").hide(300);
            //     return;
            // }
            // let gdata = data.image_data[0]
            
            // probs = gdata['probability']
            // name2number = gdata['dictionary']
            // function upperCaseString(str){
            //     str = String(str).charAt(0).toUpperCase() + String(str).slice(1)
            //     str = str.split('_').join(' ')
            //     return str


            // }
            
            // console.log(data.image_data.image_data);
            
            // jQuery.each(probs, function(i, v) {
            //     console.log(i)
            //     n = i + 1
            //     e = document.createElement("p")
            //     e.innerHTML = upperCaseString( name2number[i]) + " : " +"<b>" + Math.round(v) + "%"+"</b>";
            //     $("ul").append(e)
            // });
            // $('#result #pred').text(upperCaseString(gdata.prediction));
            $('#result').show(500)
            $(".progress").fadeOut()
            $('#result-img').attr('src' , '/static/images/har.jpg');
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

