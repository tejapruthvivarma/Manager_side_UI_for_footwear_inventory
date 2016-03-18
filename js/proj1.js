/*
Nadimpally, Teja Pruthvi Varma
jadrn037 
CS0645 Spring 2016
Proj1
*/

//$('#wrapper').on("change",function() {
$("#wrapper").on("htmlchanged",function(){
    $("#tabs").tabs(); 
    $("#editForm").hide();
    
    $('[name="busy_wait"]').hide();
    
    // $('#form_add')[0].reset();
    // $('#form_edit')[0].reset();
    // $('#form_delete')[0].reset();
    
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
            errorStatus.html("Please enter SKU");
            element[0].focus();
            return false; 
        }
        else if(!validate_Sku(element[0].val())) {
        	element[0].addClass("error");
            errorStatus.html("Please enter a valid SKU");
            element[0].focus();
        	return false;
        }
        
        if(element[1].val()==-1) {
        	errorStatus.html("Please select a Category");
        	element[1].focus();
        	return false;
        }
        
        if(element[2].val()==-1) {
        	element[2].focus();
        	errorStatus.html("Please select a Vendor");
        	return false;
        }
        
        if(isEmpty(element[3].val())) {
            element[3].addClass("error");
            errorStatus.html("Please enter Manufacturer Id");
            element[3].focus();
            return false; 
        }
        
        if(isEmpty(element[4].val())) {
            element[4].addClass("error");
            errorStatus.html("Please enter Product Description");
            element[4].focus();
            return false; 
        }
        
        if(isEmpty(element[5].val())) {
            element[5].addClass("error");
            errorStatus.html("Please enter Features");
            element[5].focus();
            return false; 
        }
        
        if(isEmpty(element[6].val())) {
            element[6].addClass("error");
            errorStatus.html("Please enter cost");
            element[6].focus();
            return false; 
        }
        else if(!$.isNumeric(element[6].val())) {
        	element[6].addClass("error");
            errorStatus.html("Cost Field appears to be invalid, digits only");
            element[6].focus();
            return false;
        }
        
        if(isEmpty(element[7].val())) {
            element[7].addClass("error");
            errorStatus.html("Please enter retail");
            element[7].focus();
            return false; 
        }
        else if(!$.isNumeric(element[6].val())) {
        	element[7].addClass("error");
            errorStatus.html("Retail field appears to be invalid, digits only");
            element[7].focus();
            return false; 
        }
        
        if(!validate_ImgFile(element[8].val())) {
        	element[8].addClass("error");
            errorStatus.html("Please upload a Valid Image File i.e, .jpg, .jpeg, .png files");
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
        	errorStatus.html("");
			return; 
        }
        if(validate_Sku(Value)) {   
        	$('[name="busy_wait"]').show();      
            var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
            $.get(url, check_sku_for_dups);
            }
        else {
           $('[name="add_sku"]').addClass("error");
           errorStatus.html("Invalid SKU Format i.e, AAA-000");
        }
    }); 
    
    element[3].on('blur', function() {
    	if(isEmpty(element[3].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    
    element[4].on('blur', function() {
    	if(isEmpty(element[4].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    
    element[5].on('blur', function() {
    	if(isEmpty(element[5].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    
    element[6].on('blur', function() {
    	if(isEmpty(element[6].val()))
            return;
        $(this).removeClass("error");
        errorStatus.html("");  
    });
    
    element[7].on('blur', function() {
    	if(isEmpty(element[7].val()))
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
    	$('[name="busy_wait"]').hide();
    	$('[name="add_message"]').html("");
    	$('[name="add_sku"]').removeClass("error");
        return;
        }
    $('[name="add_message"]').html(" SKU already exists");
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
	$('[name="busy_wait"]').hide();
	
	$('[name="add_confirm"]').html(response);
	$('[name="add_confirm"]').show();
	setTimeout(function(){$('[name="add_confirm"]').fadeOut();}, 7000);
	$('#form_add')[0].reset();
}

