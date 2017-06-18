$(document).ready(function() {
  var screenSize = $(document).width();
  if (screenSize <= 435) {
    $("#search input").after("<br>");
    $("#search input").css("width", "175.333px");
  }
  var form = $("#contact_form");
  $(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    // TODO
    // Serialize the form data.
    var formData = $(form).serialize();
    // Submit the form using AJAX.
    $.ajax({
      type: "POST",
      url: $(form).attr("action"),
      data: formData,
      success: function(response) {
        if(window.location.href==="https://nightlife-gkazikas.c9users.io" || window.location.href==="https://nightlife-gkazikas.c9users.io/"){
           $(".res").hide();  
           $(".alert-success").hide();
          if(typeof response==="object"){
        document.getElementById("main").dataset.id = "active";
        $("#login").hide();
        $("#logout").show();
        $("#reg").hide();
        if (
          $("#search input").val() !== ""
        ) {
          $("#search input").val($("#search input").val());
          $("#search select").val($("#search select").val());
          $('.go').prop('disabled', false);
                
          getRelevantGoogleReviews(response[1]);
        }
      } else {
        $(".alert-danger, #extraAlert").html("");
          $("#nav").after("<div id='extraAlert' class='container'><p class='alert alert-danger container'>No user found</p></div>")
          $(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
               $(".alert-danger").slideUp(1200);
                });   
          
      }
      } else {
        if(typeof response==="object"){$(location).attr('href',"/")}
        else {
                  $(".alert-danger, #extraAlert").html("");
        $("#nav").after("<p class='alert alert-danger container'>No user found</p>")
           $(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
               $(".alert-danger").slideUp(1200);
                });   
        }
      }
      }
    });
});
   var regform = $("#regContact_form");
  $(document).on("submit",regform,function(event) {

    // Stop the browser from submitting the form.
    event.preventDefault();
    var formData = $(regform).serialize();
    // Submit the form using AJAX.
    $.ajax({
      type: "POST",
      url: $(regform).attr("action"),
      data: formData,
      success: function(response) {
       if(typeof response==="object"){
          //$("#extraAlert").html("")
          response.error_msg.map(error=>{
          $("#nav").after("<p class='alert alert-danger container'>"+error+"</p>")            
          });
          $(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
               $(".alert-danger").slideUp(1200);
                });   
       } 
       else {
        $(location).attr('href',"/");

       }
      }
    });
  });
});

$(document).on("keypress", "form", function(event) {
  return event.keyCode != 13;
});


        $("#search button").on("click",(function(e){
                e.preventDefault();
       $.ajax({
      type: "GET",
      url: "/search",
      data: {},
  beforeSend: function() {
     $('#loader').show();
  },      
      success: function(response) {
       if($("#search input").val()==="") {
        $('#loader').hide();
          $(".res").html("")        
        $("#search").after("<p class='container text-center res'>No results</p>")
        $("#main").hide();
         return false;
       }
            else {
                 $('#loader').hide();
          $(".res").html("")                   
                  $("#main").show();
                getRelevantGoogleReviews(response);  
            }
      }
    });
        }));

function getRelevantGoogleReviews(datas) {
  var type = $("#search select").val();
  var location = $("#search input").val();
  var service = new google.maps.places.PlacesService($("#main").get(0)); // note that it removes the content inside div with tag '#service-helper'
  var placeId = "";
          $("#extraAlert").css("display","none");
  service.textSearch(
    {
      query: type + " " + location
    },
    function(place, status) {
      if (place.length === 0)
        $("#main").append("<p class='text-center'>No results found</p>");
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < place.length; i++) {
          var id = place[i].place_id;

          var resultcontent = "";
          var photo;
          if (place[i].photos === undefined) {
            photo =
              "https://res.cloudinary.com/dlvavuuqe/image/upload/v1492273823/image-not-found_im8zkq.jpg";
          } else {
            photo = place[i].photos[0].getUrl({
              maxWidth: 100,
              maxHeight: 100
            });
          }

          var name = place[i].name;
          var address = place[i].formatted_address;

          var rating = Math.floor(place[i].rating);
          var stars = "";
          var circle;
          var isOpen = true;
          if (
            place[i].opening_hours !== undefined &&
            place[i].opening_hours.open_now
          ) {
            circle = "green";
            isOpen = "open";
          } else {
            circle = "red";
            isOpen = "closed";
          }
          for (var j = 0; j < rating; j++) {
            stars += "<i class='fa fa-star rating' aria-hidden='true'></i>";
          }
          var dis = "";
          if (!$("#main").data("id")) {
            dis = "disabled";
          }
          resultcontent +=
            "<div id=" +
            name +
            " class=mainInfo><div><img class='mainImg' src=" +
            photo +
            " ></div><div class='mainInfo1'><span class='mainName'>" +
            name +
            "</span>" +
            stars +
            "<p class='mainAddress'>" +
            address +
            "</p><button id="+id +" data-id="+id +" class='go btn btn-info'" +
            dis +
            ">Check in</button><button data-id=" +
            id +
            " class='more btn btn-danger'>View more</button><br><i class='fa fa-circle fa-lg " +
            circle +
            "'> " +
            isOpen +
            "</i><span id="+id+" ></span></div></div>";
          $("#main").append(resultcontent);
var test1=datas.indexOf($("button"+ "#" + id).data("id"));

            if(test1 !=-1) {
             $("button"+ "#" + id).html("not interested");
            } else {
             $("button"+ "#" + id).html("check in");
              
            }
        }
   $(".go").on("click",function(e){
var ChekInUrl="check_in/"+$(this).data("id");
var removeUrl="remove_check_in/"+$(this).data("id");
var id=$(this).data("id");
if($(this).hasClass("go")) {
     $.ajax({
      type: "GET",
      url: ChekInUrl,   
      data:{},
      success: function(response) {
              $("button"+ "#" + id).removeClass("go");
             $("button"+ "#" + id).addClass("remove");   
             $($("button"+ "#" + id)).text("not interested")
     $("span" + "#" + id  ).html("");
      $("span" + "#" + id  ).append("<span>"+response[0]+" going</span>");
      
      }
      
    });
} else {
       $.ajax({
      type: "GET",
      url: removeUrl,   
      data:{},
      success: function(response) {

              $("button"+ "#" + id).removeClass("remove");
             $("button"+ "#" + id).addClass("go");   
             $("button"+ "#" + id).text("check in")             
     $("span" + "#" + id  ).html("");
      $("span" + "#" + id  ).append("<span>"+response[0]+" going</span>");
      
      }
      
    });
}
  });   
  
        $(".more").on("click", function() {
          placeId = $(this).data("id");

          service.getDetails(
            {
              placeId: placeId // get a placeId using https://developers.google.com/places/web-service/place-id
            },
            function(place, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                var site;
                if (place.website !== undefined)
                  site =
                    "<a href=" +
                    place.website +
                    " target=_blank>" +
                    place.website +
                    "</a>";
                else site = "-";
                var review = [];
                var phone = place.formatted_phone_number || "No phone number";
                $("#myModal").find(".modal-body ").html("");
                $("#myModal").modal("show");
                $("#myModal").find(".modal-title ").text(place.name);
                $("#myModal")
                  .find(".modal-body ")
                  .append(
                    "<div class='cont'><div class='secInfo'><h3 id='head'>Review(s):</h3><span><strong>website</strong>: " +
                      site +
                      "</span><br><i class='fa fa-phone fa-lg'> " +
                      phone +
                      "</i></div></div>"
                  );

                var rev = "";
                if (place.reviews) {
                  for (var i = 0; i < place.reviews.length; i++) {
                    if (place.reviews[i].text !== "") {
                      rev = place.reviews[i].text;
                    }
                    $("#myModal").find("#head").after("<p>" + rev + "</p>");
                  }
                } else {
                  $("#myModal")
                    .find("#head")
                    .after("<p>No reviews at the moment</p>");
                }
              }
            }
          );
        });
      }
    }
  );

}

