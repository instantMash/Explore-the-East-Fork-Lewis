var locations = [{
        title: "Lewisville Park",
        location: {
            lat: 45.816459,
            lng: -122.541811
        },
        services: ["Boat Ramp", "Hiking", "Kayak/Canoe Access", "Restrooms", "Fees Required"],
        fees: true
    },
    {
        title: "Paradise Point State Park",
        location: {
            lat: 45.865752,
            lng: -122.703986
        },
        services: ["Boat Ramp", "Hiking", "Kayak/Canoe Access", "Restrooms", "Fees Required"],
        fees: true
    },
    {
        title: "Daybreak Park",
        location: {
            lat: 45.813480,
            lng: -122.588698
        },
        services: ["Boat Ramp", "Kayak/Canoe Access", "Restrooms"],
        fees: false
    },
    {
        title: "Sunset Falls Campground",
        location: {
            lat: 45.819102,
            lng: -122.252303
        },
        services: ["Kayak/Canoe Access", "Restrooms", "Camping", "Fees Required"],
        fees: true
    },
    {
        title: "Moulton Falls Regional Park",
        location: {
            lat: 45.831679,
            lng: -122.389088
        },
        services: ["Hiking", "Restrooms"],
        fees: false
    },
    {
        title: "Kayak/Canoe Launch 1",
        location: {
            lat: 45.821464,
            lng: -122.236941
        },
        services: ["Kayak/Canoe Access"],
        description: "This is a popular put-in for the waterfall run. There is a small pull out here for parking. Follow the trail to the river. It is a steep climb down to the river.",
        fees: false
    },
    {
        title: "Kayak/Canoe Launch 2",
        location: {
            lat: 45.830943,
            lng: -122.212046
        },
        services: ["Kayak/Canoe Access"],
        description: "This put-in for the waterfall run is suitable when river level is 1,500 cfs or higher.",
        fees: false
    }
];

var categories = [
    { name: "Boat Ramp", class: "boat-ramp" },
    { name: "Camping", class: "camping" },
    { name: "Hiking", class: "hiking" },
    { name: "Kayak/Canoe Access", class: "kayak-canoe-access" },
    { name: "Restrooms", class: "restrooms" },
    { name: "Fees Required", class: "fees-required" }
];

// This utility function pushes all the location titles into the visible locations array. We call this when none of the checkboxes are selected.
function resetLocations(self) {
    locations.forEach(function(location) {
        self.visibleLocations.push(location);
    });
}

var map = document.getElementById("map");

var markers = [];

// This function creates the map. When the Google Maps API is ready, it calls this function which is specified using the callback parameter.
function initMap() {
    // Make Map
    map = new google.maps.Map(map), {
        styles: [{
            "featureType": "landscape",
            "stylers": [{
                "hue": "#FFBB00"
            }, {
                "saturation": 43.400000000000006
            }, {
                "lightness": 37.599999999999994
            }, {
                "gamma": 1
            }]
        }, {
            "featureType": "road.highway",
            "stylers": [{
                "hue": "#FFC200"
            }, {
                "saturation": -61.8
            }, {
                "lightness": 45.599999999999994
            }, {
                "gamma": 1
            }]
        }, {
            "featureType": "road.arterial",
            "stylers": [{
                "hue": "#FF0300"
            }, {
                "saturation": -100
            }, {
                "lightness": 51.19999999999999
            }, {
                "gamma": 1
            }]
        }, {
            "featureType": "road.local",
            "stylers": [{
                "hue": "#FF0300"
            }, {
                "saturation": -100
            }, {
                "lightness": 52
            }, {
                "gamma": 1
            }]
        }, {
            "featureType": "water",
            "stylers": [{
                "hue": "#0078FF"
            }, {
                "saturation": -13.200000000000003
            }, {
                "lightness": 2.4000000000000057
            }, {
                "gamma": 1
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "hue": "#00FF6A"
            }, {
                "saturation": -1.0989010989011234
            }, {
                "lightness": 11.200000000000017
            }, {
                "gamma": 1
            }]
        }],
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
    };

    infowindow = new google.maps.InfoWindow();

    // Set Bounds
    var swBounds = new google.maps.LatLng(45.822883, -122.719666);
    var neBounds = new google.maps.LatLng(45.866361, -122.163878);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(swBounds);
    bounds.extend(neBounds);
    map.fitBounds(bounds);

    makeMarkers();
} // end initMap

var makeMarkers = function() {

    vm.visibleLocations().forEach(function(location) {
        var title = location.title;
        var position = location.location;
        var description = location.description;
        var services = location.services;
        var fees = location.fees;

        // If the description is blank, set it to an empty string. This prevents "undefined" from showing up in the info window.
        if (location.description === undefined) {
            description = "";
        }

        // Create a marker for each location
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          id: location.title,
          description: description,
          services: services,
          fees: fees,
          icon: "http:\/\/maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

        // Add the marker as a property of the location object. That way we can do stuff later, such as associate the list of visible locations with their corresponding markers.
        location.marker = marker;

        markers.push(marker);

        // Create an onclick event listener to open an infowindow at each marker.
        marker.addListener("click", function() {
            markers.forEach(function(marker) {
                marker.setIcon("http:\/\/maps.google.com/mapfiles/ms/icons/red-dot.png");
            });
            this.setIcon("http:\/\/maps.google.com/mapfiles/ms/icons/blue-dot.png");
            var currentMarker = this; // Store 'this' as a variable so we can pass it to the wikiCall function.
            var markerTitle = marker.title;
            populateInfoWindow(this, infowindow);

        });

    });

}; // end of makeMarkers function

function populateInfoWindow(marker, infowindow) {


    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;


        // Add items from the service array to an HTML list.
        var serviceList = "";
        for (i = 0; i < marker.services.length; i++) {
            var serviceItem = marker.services[i];

        // Create the CSS class name from the service name. Replace spaces and forward slashes with hyphens.
        var serviceItemClass = serviceItem.replace(/\s|\//g, "-").toLowerCase();
        serviceList = serviceList + "<li class=" + serviceItemClass + ">" + serviceItem + "</li>";
        }

        // Create infowindow title
        var locationTitle =  "<h3>" + marker.title + "</h3>";

        // Create infoWindow description
        var locationDescription = "<p>" + marker.description + "</p>";


        var infowindowContent = "<div class=\"info-window\">" + locationTitle + locationDescription +
        "<ul class=\"info-window-services\">" + serviceList + "</ul></div>";

        infowindow.setContent(infowindowContent);
        infowindow.open(map, marker);


        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener("closeclick", function() {
            infowindow.setMarker = null;
        });
    }
}


// Trigger the markers when their corresponding list item is clicked
var highlightMarker = function(data, event) {
    google.maps.event.trigger(data.marker, "click");
};


// Fallback error handling method if Google Maps API does't load
function mapError() {

    // Create a paragraph to hold the error message.
    var mapErrorParagraph = document.createElement("p");

    // Create a text node and add it to the paragraph
    var mapErrorTextNode = document.createTextNode("There was an error loading Google Maps. Please try again later.");
    mapErrorParagraph.appendChild(mapErrorTextNode);

    // Add a class to the paragraph for styling
    mapErrorParagraph.className = "map-load-error";

    map.appendChild(mapErrorParagraph);

}


var AppViewModel = function() {
    var self = this;

    this.selectedCategories = ko.observableArray();

    this.visibleLocations = ko.observableArray();

    // If no boxes are checked, show all the locations
    resetLocations(this);

    // Filter visible locations based on which checkboxes are selected.
    this.filterLocations = function() {

        // First, we empty the array so we don't get duplicate location titles.
        self.visibleLocations.removeAll();

        // Loop through each location
        locations.forEach(function(location) {

            if (self.selectedCategories().length === 0) {
                locations.forEach(function(location) {
                    location.marker.setVisible(true);
                });
            }
            // Loop through the the services array of each location. I had to use a regular loop, instead of a forEach loop, so I could use the break statment
            for (i = 0; i < location.services.length; i++) {
                // If the service name (from the location) is present in the selectedCategories array, add that location title to the visibleLocations array.
                if (self.selectedCategories().indexOf(location.services[i]) !== -1) {
                    self.visibleLocations.push(location);
                    location.marker.setVisible(true);
                    // Break out of the loop if a match is found. That way locations can't get added multiple times to the visibleLocations array.
                    break;
                } else {
                    location.marker.setVisible(false);
                }
            } // close the for loop
        }); // close the forEach loop

        // If no boxes are checked, show all the locations
        if (self.visibleLocations().length === 0) {
            resetLocations(self);
        }

        // By default, the click binding prevents the default reaction to a click based on the assumption that the JavaScript click event handler will handle everything. We need to return "true" to get the default behavior anyway:
        // https://stackoverflow.com/questions/26355096/checkbox-not-getting-checked-in-knockoutjs

        return true;
    };


}; // end of AppViewModel


var vm = new AppViewModel();
ko.applyBindings(vm);
