/*
Nadimpally, Teja Pruthvi Varma
jadrn037 
CS0645 Spring 2016
Proj1
*/

var image_name;

//$(document).ready(function() {
$('.tab-two').on("click",function(){

    console.log("ckick");

	$('[name="e_busy_wait"]').hide();
	$('[name="e_busy_wait1"]').hide();
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
		$('[name="e_busy_wait1"]').show();
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
        	errorStatusT.html("Please Enter SKU");
			return; 
        }
        if(validate_Sku(Value)) {   
        	$('[name="e_busy_wait"]').show();    
            var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
            $.get(url, check_Sku);
            }
        else {
           $('[name="e_sku"]').addClass("error");
           $('[name="e_message1"]').html("Invalid SKU Format i.e, AAA-000");
        }
	});
	
	$('[name="e_clear"]').on('click',function() {
		$('#form_edit')[0].reset();
    	errorStatus.html("");
    	errorStatusT.html("");
    	$('[name="e_busy_wait"]').hide();
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
    
/* Functions to handle error messages on Blur */      
    element[0].on('keyup',function() {
    	this.value = this.value.toUpperCase();
    	if(this.value.length == 3)
           element[0].val(this.value+"-");  
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
    	$('[name="e_busy_wait"]').hide();
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
    $('[name="e_busy_wait"]').hide();
    $('[name="e_message1"]').html(" SKU doesn't exist");
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
	$('[name="e_busy_wait1"]').hide();
	$('[name="edit_confirm"]').show();
	$('[name="edit_confirm"]').html(response);
	setTimeout(function(){$('[name="edit_confirm"]').fadeOut();}, 7000);
	$('#form_edit')[0].reset();
	$('[name="e_sku"]').removeClass("error");
    $("#editForm").hide();
	document.getElementById("e_sku").readOnly = false;
}

function store_Imagename(name) {
	image_name=$.trim(name);
}