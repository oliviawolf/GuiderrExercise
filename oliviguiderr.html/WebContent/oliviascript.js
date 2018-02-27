		
	/**
	 * Javascript file for website that displays a map with search results of 
	 * restaurants in a particular city.
	 * 
	 * @author Olivia Wolf
	 */

      var map;
      
    /** 
     * Searches for locations in the city that is displayed on the map.
     * 
     */
      function createIcons(){
    	  //initialize variable to define nearbySearch
    	  var request = {
                  location: map.getCenter(),
                  radius: 5000,
                  type: ['restaurant']    
          }
    	  
    	  //call google's nearbySearch function to locate restaurants in city
         var service = new google.maps.places.PlacesService(map);
         service.nearbySearch(request, callback1);
         
      }
      
      /**
       * Gets data about each location using its place ID.
       * @param results
       * 		An array of search results from nearbySearch function.
       * @param status
       * 		Contains the status of the request for details.

       */
       function callback1(results, status) {
    	      if (status === google.maps.places.PlacesServiceStatus.OK) {
    	    	//examine every element of results array
    	        for (var i = 0; i < results.length; i++) {
    	        	//create a variable containing the place id of a location
    	        	var requestdeets = {
                            placeId: results[i].place_id
                    };
                    
    	        	/*get additional details about a restaurant before creating 
    	        	a marker*/
                    service2 = new google.maps.places.PlacesService(map);
                    service2.getDetails(requestdeets, callback2);
    	        }
    	      }
    	    }
    	   
    	   
       /**
        * Method that calls createMarker for a individual restaurant if there were
        * no errors in finding details.
        * @param place
        * 		Object with attributes that are used to create a description 
        * 		of a location.
        * @param status
        * 		Contains the status of the request for details.
        */
    	   function callback2(place, status){
    		   if (status === google.maps.places.PlacesServiceStatus.OK) {
    			    createMarker(place);
    			  }
    	   }
    	   
    	   /**
    	    * Initializes one marker for a restaurant using a fork and knife icon.
    	    * @param place
    	    * 		Object with attributes that are used to create a description 
    	    * 		of a location.
    	    */
    	   
    	   function createMarker(place){
    		   
    		   //set up a unique icon for restaurant markers
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
    	   
    	   
    	   /**
    	    * Creates listeners for when a marker is hovered over or clicked on.
    	    * @param place
    	    * 		Object with attributes that are used to create a description 
    	    * 		of a location.
    	    * @param marker
    	    * 		The marker that will receive the functionality.
    	    */
    	   function iconFunctionality(place, marker){
    		    //create info window variable
                var infowindow = new google.maps.InfoWindow();

                //call method that creates a string of html to output to infowindow
                var infoWContent = getContent(place);
              
                //if a marker is clicked, ask user to input email
                google.maps.event.addListener(marker, 'click', function() {
                var email = prompt('please enter your email to recieve information about this restaurant');
                   //window.open('mailto:'+ email + '?subject=\'Restaurant search info\'body='+infoWContent);
                 });
               
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
    	   
    	   
    	   /**
    	    * Creates a string of details about a location to fill in infowindow.
    	    * @param place
    	    * 		Object with attributes that are used to create a description 
    	    * 		of a location.
    	    * @returns
    	    * 		A string containing details about a location and a photo, if 
    	    * 		available.
    	    */
    	   function getContent(place){
    		   
    		   //collect data about restaurant and fill into content string
    		   var content= '<p>'+ place.name +'\n<p><\p>' + place.formatted_address ;
               content +=  '\n<p><\p>Phone number: '+ place.formatted_phone_number; 
               content += '\n<p><\p>'+ place.website;
               content+='\n<p><\p>Rating: '+place.rating ;
               
               //check if the getDetails function returned any photos, if so add them to the content
               if(place.photos.length>0){
               content+= '\n<p><\p> <img src=\''+ place.photos[0].getUrl({'maxWidth': 250, 'maxHeight': 250}) + '\'<p>';
               }
               else{
             	  content+='<\p>';
               }
               
               return content;
    	   }
      
    	   /**
    	    * Sets up the search bar at the top of the page and listens for new
    	    * input.
    	    */
    	   function searchBar(){
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
    	          //examine search result
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
    	     
    	          //update map location
    	          map.fitBounds(bounds);
    	          
    	          //zoom map into city when bounds are changed
    	          google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
    	        	  map.setZoom(13);
    	        	});
    	        
    	        //update restaurant icons when a new search is performed  
    	        createIcons();
    	        });
    	   }
    	
    /**
     * Creates initial map and sets up main functionality. This method is a sort 
     * of main function that calls smaller methods.
     *
     */	   
      function initMap() {
    	  
    	  //create map centered in tel aviv
         map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.08, lng: 34.8},
          zoom: 14,
          mapTypeId: 'roadmap'
        });

       //create the restaurant icons
         createIcons();
        
       //call method that will create a search bar and listen for new input
        searchBar();
      }
      
      