
      var map;
      
      function initMap() {
    	  
    	  //create map centered in tel aviv
         map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.08, lng: 34.8},
          zoom: 14,
          mapTypeId: 'roadmap'
        });

       //create the restaurant icons
         createIcons(map);
        
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }

         
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          

          map.fitBounds(bounds);
          
          //zoom map into city when bounds ar changed
          google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        	  map.setZoom(13);
        	});
          
        //update restaurant icons when a new search is performed  
        createIcons(map);
        });
      }
      
      //function that searches for restaruants and passes them to another function
      function createIcons(map){
    	  var request = {
                  location: map.getCenter(),
                  radius: 5000,
                  type: ['restaurant']    
          }
         var service = new google.maps.places.PlacesService(map);
         service.nearbySearch(request, callback1);
         
      }
      
      //gets data about each restaurant using its place ID
       function callback1(results, status) {
    	      if (status === google.maps.places.PlacesServiceStatus.OK) {
    	        for (var i = 0; i < results.length; i++) {
    	        	var requestdeets = {
                            placeId: results[i].place_id
                    };
                    
                    service2 = new google.maps.places.PlacesService(map);
                    service2.getDetails(requestdeets, callback2);
    	        }
    	      }
    	    }
    	   
    	   
       //function that calls createMarker for a individual restaurant
    	   function callback2(place, status){
    		   if (status === google.maps.places.PlacesServiceStatus.OK) {
    			    createMarker(place);
    			  }
    	   }
    	   
    	   //creates one marker for a restaurant using a fork and knife icon
    	   function createMarker(place){
    		   var restaurantIcon = {
    	                  url: 'rest.png',
    	                   scaledSize: new google.maps.Size(35, 35)
    	              };
    		   
    	              marker = new google.maps.Marker({
    	                map: map,
    	                position: place.geometry.location,
    	                animation: google.maps.Animation.DROP,
    	                icon: restaurantIcon
    	              });
    	              //call method that adds functionality to each icon
    	            iconFunctionality(place, marker);
    	   }
    	   
    	   
    	   //creates listeners for when a marker is hovered over or clicked on
    	   function iconFunctionality(place, marker){
    		   
    		   //if a marker is clicked, ask user to input email
               google.maps.event.addListener(marker, 'click', function() {
                   prompt('please enter your email to recieve information about this restaurant');
                 });
                
              //create info window variable
                var infowindow = new google.maps.InfoWindow();

                //call method that creates a string of html to output to infowindow
                var infoWContent = getContent(place);
              
              //if icon is hovered over, display the restaurant details in an infowindow
                google.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.setContent(infoWContent);
                    infowindow.open(map, this);
                  });
                //when mouse leaves icon, close infowindow
                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close(map, this);
                  });
           }
    	   
    	   function getContent(place){
    		   var content= '<p>'+ place.name +'\n<p><\p>Phone number: '+ place.formatted_phone_number +'\n<p><\p>';
               content += place.formatted_address +'\n<p><\p>Rating: '+place.rating +'\n<p><\p>';
               content += place.website;
               
               //check if the getDetails function returned any photos, if so add them to the content
               if(place.photos.length>0){
               content+= '\n<p><\p> <img src=\''+ place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}) + '\'<p>';
               }
               else{
             	  content+='<\p>';
               }
               
               return content;
    	   }