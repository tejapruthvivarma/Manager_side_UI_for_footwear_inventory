/*
Nadimpally, Teja Pruthvi Varma
jadrn037 
CS0645 Spring 2016
Proj1
*/

$(document).ready(function() {

	var user= $('[name="user"]');
	var pwd=  $('[name="password"]');
	var errorStatus = $('#message_line1');
	//$('#wrapper1').hide();
	 $('[name="busy_wait"]').hide();
	$('#confirm').on('click', function(e) { 
        $('*').removeClass("error");	
        errorStatus.html("");
        if(validate_Data()){
        	//$.get("/perl/jadrn037/proj1/login.cgi");
             params = "user="+$("[name='user']").val()+"&password="+$("[name='password']").val();
           
            $.post( "/perl/jadrn037/proj1/login.cgi",params, function( data ) {
          if(data == "OK")
$.post( "/perl/jadrn037/proj1/load.cgi", function( data ) { 
 $('#content').hide();
$('#content1').html(data);
add_tab_load();
edit_tab_load();
delete_tab_load();
// $('#wrapper').hide();
// $('#wrapper1').show();
 });
else{ 
    $('[name="busy_wait"]').show();
 setTimeout(function(){$('[name="busy_wait"]').hide();$('#err_login').text("Please enter a valid credentials");}, 5000);
  
    
        }
    
});
        }
		else { 
			 e.preventDefault();
		}
    });
    
  

    $(':reset').on('click', function() {
    	$('*').removeClass("error");	
        errorStatus.html("");
    });
    
function validate_Data()	{
	if(isEmpty(user.val())) {
        user.addClass("error");
        errorStatus.html("Please enter Username");
        user.focus();
        return false; 
        }
        
    if(isEmpty(pwd.val())) {
        pwd.addClass("error");
        errorStatus.html("Please enter Password");
        pwd.focus();            
        return false; 
        }
        
    return true;
}

	user.on('blur', function() {
        if(isEmpty(user.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");
        });
    
	pwd.on('blur', function() {
        if(isEmpty(pwd.val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");
        });





});

function isEmpty(fieldValue) {
    if($.trim(fieldValue).length == 0)
    	return true;
    return false;  
}


function validate_Sku(sku) {
    var value = $.trim(sku);
    var pattern = /^[A-Z]{3}-[0-9]{3}$/;
    if(pattern.test(value))
        return true;
    return false;
} 

function validate_ImgFile(file) {
    var f_Name=$.trim(file);
    var extensions = new Array("jpg","jpeg","JPG","JPEG","png");
    var f_Extension = f_Name.split('.').pop(); 
    for(var i = 0; i <= extensions.length; i++) {
        if(extensions[i]==f_Extension) {
            return true; 
        }
    }
    return false;
}

function load_Vendor(response) {
    var key = new Array();
    var description = new Array();
    var toWrite = "<option value=\"-1\">--Choose Vendor--</option>";
    var tmpStr = response.split("||");
    for(i=0; i<tmpStr.length; i++) {
        tmp = tmpStr[i].split("=");
        toWrite += "<option value=" + tmp[0] + ">"+tmp[1]+"</option>\n";
        }
    $('[name="add_vendor"]').append(toWrite);
    $('[name="e_vendor"]').append(toWrite);
}
    
function load_Category(response) {
    var key = new Array();
    var description = new Array();
    var toWrite = "<option value=\"-1\">--Choose Category--</option>";
    var tmpStr = response.split("||");
    for(i=0; i<tmpStr.length; i++) {
        tmp = tmpStr[i].split("=");
        toWrite += "<option value=" + tmp[0] + ">"+tmp[1]+"</option>\n";
        }
    $('[name="add_category"]').append(toWrite);
    $('[name="e_category"]').append(toWrite);
}

function check_sku_for_dups(response) {
    if(response == "ok") { 
       // $('[name="busy_wait"]').hide();
        $('[name="add_message"]').html("");
        $('[name="add_sku"]').removeClass("error");
        return;
        }
    $('[name="add_message"]').html("Entered SKU already exists");
    $('[name="add_sku"]').addClass("error");
}

function addItem() {
    send_image();
    $('[name="busy_wait"]').show();
}

function send_image() {
    var form_data = new FormData($('#form_add')[0]);       
    form_data.append("image", document.getElementById("add_image").files[0]);
    $.ajax( {
        url: "/perl/jadrn037/proj1/image_upload.cgi",
        type: "post",
        data: form_data,
        processData: false,
        contentType: false,
        success: function(response) {
        send_data();   
        },
        error: function(response) {
            alert(response);
        }
    });
    
}

function send_data() {
    var sku = $('[name="add_sku"]').val();      
    var category = $('[name="add_category"]').val();        
    var vendor = $('[name="add_vendor"]').val();
    var m_id = $('[name="add_m_identifier"]').val();
    var description = $('[name="add_desc"]').val();
    var features = $('[name="add_features"]').val();
    var cost = $('[name="add_cost"]').val();
    var retail = $('[name="add_retail"]').val();
    var image = $('[name="add_image"]').val(); 
    
    var i_Extension = image.split('.').pop();   
    var sku_img=sku+"."+i_Extension; 
                 
    var url = "/perl/jadrn037/proj1/insert.cgi";
    url += "?sku="+ sku +"&category=" + category + "&vendor="+ vendor + "&m_id="+ m_id + "&description="+ description + "&features="+ features + 
              "&cost="+ cost + "&retail="+ retail + "&image="+ sku_img;
    var req = new HttpRequest(url, handleData);
    req.send();
}

function handleData(response) {
    //$('[name="busy_wait"]').hide();
    
    $('[name="add_response_msg"]').html(response);
    $('[name="add_response_msg"]').show();
    setTimeout(function(){$('[name="add_response_msg"]').fadeOut();}, 10000);
    $('#form_add')[0].reset();
}

function add_tab_load(){
      $("#tabs").tabs(); 
    $("#editForm").hide();
    
    $('[name="busy_wait"]').hide();
    
     $('#form_add')[0].reset();
     $('#form_edit')[0].reset();
     $('#form_delete')[0].reset();
    
    var errorStatus = $('[name="add_message"]');
    
    
    $.get("/perl/jadrn037/proj1/get_vendor.cgi",load_Vendor);
    $.get("/perl/jadrn037/proj1/get_category.cgi",load_Category);
    
    var element = new Array();
    element[0] = $('[name="add_sku"]');
    element[1] = $('[name="add_category"]');
    element[2] = $('[name="add_vendor"]');
    element[3] = $('[name="add_m_identifier"]');
    element[4] = $('[name="add_desc"]');
    element[5] = $('[name="add_features"]');
    element[6] = $('[name="add_cost"]');
    element[7] = $('[name="add_retail"]');
    element[8] = $('[name="add_image"]');
    
    element[0].focus();
    
    $(':reset').on('click', function() {
        errorStatus.html("");
        $('*').removeClass("error");
        $('[name="busy_wait"]').hide();
    });
    
    $('[name="Logout"]').on('click', function(e) {
    
$.get( "/perl/jadrn037/proj1/logout.cgi", function( data ) { 

   
$('#content1').html("");
$('#content1').hide();
$('#content').show();
location.reload(true);

 });
});
    
    $('[name="add_submit"]').on('click', function(e) {
        $('*').removeClass("error");    
        errorStatus.html("");
        if(!validate_addForm()){
            e.preventDefault();
            return;    
        }   
        else {
            addItem(); 
        }       
    });
    
    
    function validate_addForm() {
    
        if(isEmpty(element[0].val())) {
            element[0].addClass("error");
            $('#err_a_sku').text("Please enter a SKU");
            element[0].focus();
            return false; 
        }
        else if(!validate_Sku(element[0].val())) {
            element[0].addClass("error");
            $('#err_a_sku').text("Please enter a valid SKU in AAA-000 format");
            element[0].focus();
            return false;
        }
        
        if(element[1].val()==-1) {
            $('#err_a_category').text("Please select a Category");
            element[1].focus();
            return false;
        }
        
        if(element[2].val()==-1) {
            element[2].focus();
            $('#err_a_vendor').text("Please select a Vendor");
            return false;
        }
        
        if(isEmpty(element[3].val())) {
            element[3].addClass("error");
            $('#err_a_manu').text("Please enter Manufacturer Id");
            element[3].focus();
            return false; 
        }
        
        if(isEmpty(element[4].val())) {
            element[4].addClass("error");
           $('#err_a_desc').text("Please enter Product Description");
            element[4].focus();
            return false; 
        }
        
        if(isEmpty(element[5].val())) {
            element[5].addClass("error");
            $('#err_a_feat').text("Please enter Features");
            element[5].focus();
            return false; 
        }
        
        if(isEmpty(element[6].val())) {
            element[6].addClass("error");
            $('#err_a_cost').text("Please enter cost");
            element[6].focus();
            return false; 
        }
        else if(!$.isNumeric(element[6].val())) {
            element[6].addClass("error");
            $('#err_a_cost').text("Cost Field appears to be invalid, digits only");
            element[6].focus();
            return false;
        }
        
        if(isEmpty(element[7].val())) {
            element[7].addClass("error");
            $('#err_a_retail').text("Please enter retail");
            element[7].focus();
            return false; 
        }
        else if(!$.isNumeric(element[6].val())) {
            element[7].addClass("error");
            $('#err_a_retail').text("Retail field appears to be invalid, digits only");
            element[7].focus();
            return false; 
        }
        
        if(!validate_ImgFile(element[8].val())) {
            element[8].addClass("error");
            $('#err_a_image').text("Please upload a Valid Image File i.e, .jpg, .jpeg, .png files");
            element[8].focus();
            return false;   
        }
        return true;


          
    }
      
    element[0].on('keyup',function() {
        this.value = this.value.toUpperCase();
        if(this.value.length == 3)
           element[0].val(this.value+"-");  
    });
    
    /* Functions to handle error messages on Blur */
    
   element[0].on('blur', function() { 
        var Value =  $.trim( $('[name="add_sku"]').val() );  
        if( Value == "") {
            element[0].removeClass("error");
             $('#err_a_sku').text("");
            return; 
        }
        if(validate_Sku(Value)) {   
            $('[name="busy_wait"]').show();      
            var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
            $.get(url, check_sku_for_dups);
            }
        else {
           $('[name="add_sku"]').addClass("error");
          $('#err_a_sku').text("Invalid SKU the entered SKU is not in AAA-000 format");
        }
    }); 

    // element[1].on('blur', function() {
    //     if(isEmpty(element[3].val())){
    //         $('#err_a_category').text("Please enter Manufacturer Id");
    //         return;
    //     }
    //     $(this).removeClass("error");
    //     $('#err_a_category').text(""); 
    // });

    //  element[2].on('blur', function() {
    //     if(isEmpty(element[3].val())){
    //         $('#err_a_vendor').text("Please enter Manufacturer Id");
    //         return;
    //     }
    //     $(this).removeClass("error");
    //     $('#err_a_vendor').text(""); 
    // });
    
    element[3].on('blur', function() {
        if(isEmpty(element[3].val())){
            $('#err_a_manu').text("Please enter Manufacturer Id");
            return;
        }
        $(this).removeClass("error");
        $('#err_a_manu').text(""); 
    });
    
    element[4].on('blur', function() {
        if(isEmpty(element[4].val())){
             $('#err_a_desc').text("Please enter Product Description");
            return;
        }
        $(this).removeClass("error");
        $('#err_a_desc').text("");
            });
    
    element[5].on('blur', function() {
        if(isEmpty(element[5].val())){
        $('#err_a_feat').text("Please enter Features");
            return;
        }
        $(this).removeClass("error");
        $('#err_a_feat').text("");  
    });
    
    element[6].on('blur', function() {
        if(isEmpty(element[6].val())){
             $('#err_a_cost').text("Please enter cost"); 
            return;
        }
        $(this).removeClass("error");
        $('#err_a_cost').text(""); 
    });
    
    element[7].on('blur', function() {
        if(isEmpty(element[7].val())){
             $('#err_a_retail').text("Please enter retail"); 
            return;
        }
        $(this).removeClass("error");
         $('#err_a_retail').text(""); 
    });

}


function edit_tab_load(){
    $('.tab-two').on("click",function(){

       
        $("#editForm").hide();
        
        var element = new Array();
        element[0] = $('[name="e_sku"]');
        element[1] = $('[name="e_category"]');
        element[2] = $('[name="e_vendor"]');
        element[3] = $('[name="e_m_identifier"]');
        element[4] = $('[name="e_desc"]');
        element[5] = $('[name="e_features"]');
        element[6] = $('[name="e_cost"]');
        element[7] = $('[name="e_retail"]');
        element[8] = $('[name="e_image"]');
        
        var errorStatus=$('[name="e_message"]');
        var errorStatusT=$('[name="e_message1"]');
        
        $('[name="e_submit"]').on('click', function(e) {
            e.preventDefault();
           // $('[name="e_busy_wait1"]').show();
            if(validate_editForm()){
                if(element[8].val()=="") {
                    edit_data();
                }
                else {
                    edit_image();
                }
            }       
        });
        
        $('[name="e_edit"]').on('click',function() {
            var Value =  $.trim( $('[name="e_sku"]').val() );
            $('[name="e_busy_wait1"]').hide();  
            if( Value == "") {
                $('#err_e_sku').text("Please Enter SKU");
                return; 
            }
            if(validate_Sku(Value)) {   
                $('[name="e_busy_wait"]').show();    
                var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
                $.get(url, check_Sku);
                }
            else {
               $('[name="e_sku"]').addClass("error");
               $('#err_e_sku').text("Invalid SKU the entered SKU is not in AAA-000 format");
            }
        });
        
        $('[name="e_clear"]').on('click',function() {
            $('#form_edit')[0].reset();
            errorStatus.html("");
            errorStatusT.html("");
            $('[name="e_sku"]').removeClass("error");
            $("#editForm").hide();
            document.getElementById("e_sku").readOnly = false;
        });
        
        $('[name="e_cancel"]').on('click',function() {
            $("#form_edit")[0].reset();
            errorStatusT.html("");
            errorStatus.html("");
            $("#editForm").hide();
            document.getElementById("e_sku").readOnly = false;
        });
        
        function validate_editForm() {
        
            if(isEmpty(element[0].val())) {
                element[0].addClass("error");
               $('#err_e_sku').text("Please enter SKU");
                element[0].focus();
                return false; 
            }
            else if(!validate_Sku(element[0].val())) {
                element[0].addClass("error");
                $('#err_e_sku').text("Please enter a valid SKU in AAA-000 format");
                element[0].focus();
                return false;
            }
            
            if(element[1].val()==-1) {
               $('#err_e_category').text("Please select a Category");
                element[1].focus();
                return false;
            }
            
            if(element[2].val()==-1) {
                element[2].focus();
                $('#err_e_vendor').text("Please select a Vendor");
                return false;
            }
            
            if(isEmpty(element[3].val())) {
                element[3].addClass("error");
                $('#err_e_manu').text("Please enter Manufacturer Id");
                element[3].focus();
                return false; 
            }
            
            if(isEmpty(element[4].val())) {
                element[4].addClass("error");
                $('#err_e_desc').text("Please enter Product Description");
                element[4].focus();
                return false; 
            }
            
            if(isEmpty(element[5].val())) {
                element[5].addClass("error");
                $('#err_e_feat').text("Please enter Features");
                element[5].focus();
                return false; 
            }
            
            if(isEmpty(element[6].val())) {
                element[6].addClass("error");
                $('#err_e_cost').text("Please enter cost");
                element[6].focus();
                return false; 
            }
            else if(!$.isNumeric(element[6].val())) {
                element[6].addClass("error");
                $('#err_e_cost').text("Cost Field appears to be invalid, digits only");
                element[6].focus();
                return false;
            }
            
            if(isEmpty(element[7].val())) {
                element[7].addClass("error");
                $('#err_e_retail').text("Please enter retail");
                element[7].focus();
                return false; 
            }
            else if(!$.isNumeric(element[6].val())) {
                element[7].addClass("error");
                $('#err_e_retail').text("Retail field appears to be invalid, digits only");
                element[7].focus();
                return false; 
            }
            
            if(!validate_ImgFile(element[8].val())) {
                element[8].addClass("error");
                 $('#err_e_image').text("Please upload a Valid Image File i.e, .jpg, .jpeg, .png files");
                element[8].focus();
                return false;   
            }
            return true;      
        }
        
    /* Functions to handle error messages on Blur */      
        element[0].on('keyup',function() {
            this.value = this.value.toUpperCase();
            if(this.value.length == 3)
               element[0].val(this.value+"-");  
        });
        
         element[1].on('blur', function() {
           if(isEmpty(element[1].val())){
            $('#err_e_sku').text("Please enter a valid SKU");
            return;
        }
        $(this).removeClass("error");
        $('#err_e_sku').text("");  
        });

        element[3].on('blur', function() {
           if(isEmpty(element[3].val())){
            $('#err_e_manu').text("Please enter Manufacturer Id");
            return;
        }
        $(this).removeClass("error");
        $('#err_e_manu').text("");  
        });


        
        element[4].on('blur', function() {
            if(isEmpty(element[4].val()))
                {
            $('#err_e_desc').text("Please enter description");
            return;
        }
            $(this).removeClass("error");
            $('#err_e_desc').text("");  
        });
        
        element[5].on('blur', function() {
            if(isEmpty(element[5].val()))
                {
            $('#err_e_feat').text("Please enter features");
            return;
        }
            $(this).removeClass("error");
            $('#err_e_feat').text("");  
        });
        
       element[6].on('blur', function() {
            if(isEmpty(element[6].val()))
                {
            $('#err_e_cost').text("Please enter cost");
            return;
        }
            $(this).removeClass("error");
            $('#err_e_cost').text("");  
        });
        
        
         element[7].on('blur', function() {
            if(isEmpty(element[7].val()))
                {
            $('#err_e_retail').text("Please enter retail");
            return;
        }
            $(this).removeClass("error");
            $('#err_e_retail').text("");  
        });

    });


    function isEmpty(fieldValue) {
        if($.trim(fieldValue).length == 0)
            return true;
        return false;  
    }

    function validate_Sku(sku) {
        var value = $.trim(sku);
        var pattern = /^[A-Z]{3}-[0-9]{3}$/;
        if(pattern.test(value))
            return true;
        return false;
    } 

    function validate_ImgFile(file) {
        var f_Name=$.trim(file);
        if (f_Name=="") {
            return true;
        }
        var extensions = new Array("jpg","jpeg","JPG","JPEG","png");
        var f_Extension = f_Name.split('.').pop(); 
        for(var i = 0; i <= extensions.length; i++) {
            if(extensions[i]==f_Extension) {
                return true; 
            }
        }
        return false;
    }

    function check_Sku(response) {
        if(response == "duplicate") { 
            $("#editForm").show();
           // $('[name="e_busy_wait"]').hide();
            $('[name="e_message1"]').html("");
            $('[name="e_sku"]').removeClass("error");
            document.getElementById("e_sku").readOnly = true;
            var sku=$('[name="e_sku"]').val();
            var url = "/perl/jadrn037/proj1/get_product.cgi";
            url += "?sku="+sku;
            var request = new HttpRequest(url, handle_edit_data);   
            request.send();
            return;
            }
        
        $('#err_e_sku').text(" Entered SKU doesn't exist");
        $('[name="e_sku"]').addClass("error");
    }

    function handle_edit_data(response) {      
        var obj_data = eval("("+response+")");
        $('[name="e_category"]').val(obj_data[0][9]);
        $('[name="e_vendor"]').val(obj_data[0][10]);
        $('[name="e_m_identifier"]').val(obj_data[0][3]);
        $('[name="e_desc"]').val(obj_data[0][4]); 
        $('[name="e_features"]').val(obj_data[0][5]);
        $('[name="e_cost"]').val(obj_data[0][6]);
        $('[name="e_retail"]').val(obj_data[0][7]);
        $('#eImage').html("<img class='p_image' src='http://jadran.sdsu.edu/~jadrn037/proj1/i___es/"+obj_data[0][8]+"' />");
        store_Imagename(obj_data[0][8]);   
    }

    function edit_image() {
        var form_data = new FormData($('#form_edit')[0]);
        image_name=$('#e_image').val();      
        form_data.append("image", document.getElementById("e_image").files[0]);
        $.ajax( {
            url: "/perl/jadrn037/proj1/e_image_upload.cgi",
            type: "post",
            data: form_data,
            processData: false,
            contentType: false,
            success: function(response) { 
                edit_data();   
            },
            error: function(response) {
                alert(response);
            }
        }); 
    }

    function edit_data() {
        var sku = $('[name="e_sku"]').val();        
        var category = $('[name="e_category"]').val();      
        var vendor = $('[name="e_vendor"]').val();
        var m_id = $('[name="e_m_identifier"]').val();
        var description = $('[name="e_desc"]').val();
        var features = $('[name="e_features"]').val();
        var cost = $('[name="e_cost"]').val();
        var retail = $('[name="e_retail"]').val();
        var image = image_name; 
        var i_Extension = image.split('.').pop();   
        var sku_img=sku+"."+i_Extension;              
        var url = "/perl/jadrn037/proj1/edit.cgi";
        url += "?sku="+ sku +"&category=" + category + "&vendor="+ vendor + "&m_id="+ m_id + "&description="+ description + "&features="+ features + 
                  "&cost="+ cost + "&retail="+ retail + "&image="+ sku_img;
        var req = new HttpRequest(url, handleEdit);
        req.send();
    }

    function handleEdit(response) {
      //  $('[name="e_busy_wait1"]').hide();
        $('[name="update_message_msg"]').show();
        $('[name="update_message_msg"]').html(response);
        setTimeout(function(){$('[name="update_message_msg"]').fadeOut();}, 10000);
        $('#form_edit')[0].reset();
        $('[name="e_sku"]').removeClass("error");
       $("#editForm").hide();
        document.getElementById("e_sku").readOnly = false;
    }

    function store_Imagename(name) {
        image_name=$.trim(name);
    }

}

function delete_tab_load() {
    $('.tab-three').on('click',function() {

        $("#d_display").hide();
        $('[name="d_busy_wait"]').hide();
        $('[name="d_busy_wait1"]').hide();  
        
        $('[name="d_delete"]').on('click',function() {
            var Value =  $.trim( $('[name="d_sku"]').val() );
           // $('[name="d_busy_wait1"]').hide();   
            if( Value == "") {
                 $('#err_d_sku').text("Please enter a valid SKU");
                return; 
            }
            if(validate_Sku(Value)) {   
                $('[name="d_busy_wait"]').show();      
                var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
                $.get(url, check_sku);
                }
            else {
               $('[name="d_sku"]').addClass("error");
               $('#err_d_sku').text("Invalid SKU the entered SKU is not in AAA-000 format");
            }
        });
        
        $('[name="d_clear"]').on('click',function() {
            $('#form_delete')[0].reset();
            $('#d_data').html('');
            $('[name="d_busy_wait"]').hide();
            $("#d_display").hide();
            $('[name="d_message"]').html("");
            $('[name="d_sku"]').removeClass("error");
            document.getElementById("d_sku").readOnly = false;
        });
        
        $('[name="d_confirm"]').on('click',function(e) {
            e.preventDefault();
            $('[name="d_busy_wait1"]').show();
            var sku=$('[name="d_sku"]').val();
            var url = "/perl/jadrn037/proj1/delete.cgi";
            url += "?sku="+ sku ;
            var req = new HttpRequest(url, handleDelete);
            req.send();
        });
        
        $('#d_sku').on('blur', function() {
           if(isEmpty($('#d_sku').val())){
            $('#err_d_sku').text("Please enter a valid SKU");
            return;
        }
        $(this).removeClass("error");
        $('#err_d_sku').text("");  
        });

        $('[name="d_cancel"]').on('click',function() {
            $('#d_data').html('');
            $("#d_display").hide();
            document.getElementById("d_sku").readOnly = false;
        });
        
        $('[name="d_sku"]').on('keyup',function() {
            this.value = this.value.toUpperCase();
            if(this.value.length == 3)
               $('[name="d_sku"]').val(this.value+"-");  
        });

    });

    function validate_Sku(sku) {
        var value = $.trim(sku);
        var pattern = /^[A-Z]{3}-[0-9]{3}$/;
        if(pattern.test(value))
            return true;
        return false;
    }

    function handleDelete(response) {
       // $('[name="d_busy_wait1"]').hide();
        $('[name="delete_msg"]').show();
        $('[name="delete_msg"]').html(response);
        setTimeout(function(){$('[name="delete_msg"]').fadeOut();}, 10000);
        $('#d_data').html('');
        $("#d_display").hide();
        document.getElementById("d_sku").readOnly = false;
        $('#form_delete')[0].reset();
    }

    function check_sku(response) {
        if(response == "duplicate") { 
            $('[name="d_busy_wait"]').hide();
            $('[name="d_message"]').html("");
            $('[name="d_sku"]').removeClass("error");
            document.getElementById("d_sku").readOnly = true;
            var sku=$('[name="d_sku"]').val();
            var url = "/perl/jadrn037/proj1/get_product.cgi";
            url += "?sku="+sku;
            var request = new HttpRequest(url, handle_delete_data);   
            request.send();
            return;
            }
            else {
        //$('[name="d_busy_wait"]').hide();
        $('#err_d_sku').text(" Entered SKU doesn't exist");
        $('[name="d_sku"]').addClass("error");
        }
    }     

    function handle_delete_data(response) {      
        var obj_data = eval("("+response+")");    
        var answer = "<table id='confirmtable'>";
        answer += "<tr><td class='title'>SKU:</td><td>"+obj_data[0][0]+"</td></tr>";
        answer += "<tr><td class='title'>Category:</td><td>"+obj_data[0][1]+"</tr>";
        answer += "<tr><td class='title'>Vendor:</td><td>"+obj_data[0][2]+"</td></tr><tr>";
        answer += "<td class='title'>Manufacturer Id:</td><td>"+obj_data[0][3]+"</td></tr>";
        answer += "<tr><td class='title'>Description:</td><td>"+obj_data[0][4]+"</td></tr>";
        answer += "<tr><td class='title'>Features:</td><td>"+obj_data[0][5]+"</td></tr>";
        answer += "<tr><td class='title'>Cost:</td><td>$"+obj_data[0][6]+"</td></tr><tr><td class='title'>Retail:</td><td>$ "+obj_data[0][7]+"</td></tr>";
        answer += "<tr><td class='title'>Image:</td><td ><img class='p_image' src='http://jadran.sdsu.edu/~jadrn037/proj1/i___es/"+obj_data[0][8]+"' /> </td></tr></table>";
        $("#d_display").show();
        var handle = document.getElementById('d_data');
        handle.innerHTML = answer; 
    }
}