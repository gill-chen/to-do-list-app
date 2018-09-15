
// Crosses off specific todo by clicking (by adding event click listener to anything in the parent (ul) element) -----------------------------
$("ul").on("click", "li", function(){
	$(this).toggleClass("done");
	var complete;
	if ($(this).hasClass("done")){
	    complete = true;
	}else {
	    complete = false;
	}
	$.ajax({
        // The URL for the request
        
        url: "/items/:" + $(this).data("id"),
     
        // The data to send (will be converted to a query string)
        data: JSON.stringify({
           id: $(this).data("id"),
           cross: complete
        }),
        
        // Whether this is a POST or GET request
        type: "POST",
     
        // The type of data we expect back
        dataType : "json",
        contentType: "application/json",  
        success: function(result) {
            console.log("UPDATED");
        },
        
         error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });
});

//click on trash can icon to permanently get rid of todo-----------------------------------------------------------------------------
$("ul").on("click", "span", function(event){
    $.ajax({
        // The URL for the request
        url: "/items/:" + $(this).data("id"),
     
        // The data to send (will be converted to a query string)
        data: JSON.stringify({
           id: $(this).data("id")
        }),
        
        // Whether this is a POST or GET request
        type: "DELETE",
     
        // The type of data we expect back
        dataType : "json",
        contentType: "application/json",  
        success: function(result) {
            console.log("Delete Success");
        },
        
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });
    //removes item from list 
	$(this).parent().remove();
	//stops event bubbling
	event.stopPropagation();
});

//enters input into todo list when 'plus' button is clicked -------------------------------------------------------------------------------------------
$(".fa-plus-square").on("click", function(event){
    var todoText = $("input[type='text']").val();
	event.preventDefault();
	$.ajax({
        // The URL for the request
        url: "/items",
     
        // The data to send (will be converted to a query string)
        data: JSON.stringify({
           item: todoText
        }),
        
        // Whether this is a POST or GET request
        type: "POST",
     
        // The type of data we expect back
        dataType : "json",
        contentType: "application/json",  
        success: function(result) {
            console.log("SUCESSS YASS ITEM CREATED");
            console.log(result);
            $("ul").append("<li data-id=\""+result.created._id+"\"><span data-id=\""+result.created._id+"\"><i class='far fa-trash-alt'></i></span>"+ result.created.text +"</li>");
        },
        
         error: function(XMLHttpRequest, textStatus, errorThrown) { 
            alert("Status: " + textStatus); alert("Error: " + errorThrown); 
        } 
    });
      // Code to run if the request succeeds (is done)
    
    // clears the input field
    $("input[type='text']").val("");
        
    
	
});

//enters input in todo list when the key 'enter' is pressed---------------------------------------------------------------------------
$("input[type='text']").keypress(function(event){

	if(event.which === 13){
        $(".fa-plus-square").click();
	}
});