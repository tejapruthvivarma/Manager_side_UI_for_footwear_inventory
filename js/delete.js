/*
Nadimpally, Teja Pruthvi Varma
jadrn037 
CS0645 Spring 2016
Proj1
*/

$(document).ready(function() {

	$("#d_display").hide();
	$('[name="d_busy_wait"]').hide();
	$('[name="d_busy_wait1"]').hide();	
    
    $('[name="d_delete"]').on('click',function() {
		var Value =  $.trim( $('[name="d_sku"]').val() );
		$('[name="d_busy_wait1"]').hide();   
        if( Value == "") {
        	$('[name="d_message"]').html("Please Enter SKU");
			return; 
        }
        if(validate_Sku(Value)) {   
        	$('[name="d_busy_wait"]').show();      
            var url = "/perl/jadrn037/proj1/check_dup_sku.cgi?sku=" + Value;
            $.get(url, check_sku);
            }
        else {
           $('[name="d_sku"]').addClass("error");
           $('[name="d_message"]').html("Invalid SKU Format i.e, AAA-000");
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
	$('[name="d_busy_wait1"]').hide();
	$('[name="del_confirm"]').show();
	$('[name="del_confirm"]').html(response);
	setTimeout(function(){$('[name="del_confirm"]').fadeOut();}, 8000);
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
    $('[name="d_busy_wait"]').hide();
    $('[name="d_message"]').html(" SKU doesn't exist");
    $('[name="d_sku"]').addClass("error");
    }
}     

function handle_delete_data(response) {      
    var obj_data = eval("("+response+")");    
    var answer = "<table id='confirmtable'>";
    answer += "<tr><td class='title'>SKU:</td><td colspan='3'>"+obj_data[0][0]+"</td></tr>";
    answer += "<tr><td class='title'>Category:</td><td colspan='3'>"+obj_data[0][1]+"</tr>";
    answer += "<tr><td class='title'>Vendor:</td><td>"+obj_data[0][2]+"</td>";
    answer += "<td class='title'>Manufacturer Id:</td><td>"+obj_data[0][3]+"</td></tr>";
    answer += "<tr><td colspan='2' class='title'>Description:</td><td colspan='2'>"+obj_data[0][4]+"</td></tr>";
    answer += "<tr><td colspan='2' class='title'>Features:</td><td colspan='2'>"+obj_data[0][5]+"</td></tr>";
    answer += "<tr><td class='title'>Cost:</td><td>"+obj_data[0][6]+"</td><td class='title'>Retail:</td><td>$ "+obj_data[0][7]+"</td></tr>";
    answer += "<tr><td class='title'>Image:</td><td colspan='3'><img class='p_image' src='http://jadran.sdsu.edu/~jadrn037/proj1/i___es/"+obj_data[0][8]+"' /> </td></tr></table>";
   	$("#d_display").show();
	var handle = document.getElementById('d_data');
    handle.innerHTML = answer; 
}