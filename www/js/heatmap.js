/*
The calendar heatmap is initialized with the desired settings.
Calendar Heatmap Source: https://github.com/wa0x6e/cal-heatmap
*/

/*
The calendar heatmap is initialized with the desired settings.
Calendar Heatmap Source: https://github.com/wa0x6e/cal-heatmap
*/
var cal;
function initializeCal(){
    cal = new CalHeatMap();
    cal.init({
        data: "data/data.json",
        // start: new Date(1990, 12),
        domain: "week",
        domainLabelFormat: "",
        range: 4,
        // colLimit: 14,
        // rowLimit: 1,
        cellSize: getCellSize(), // The cell size needs to be dynamically changed according to device, etc.
        verticalOrientation: true,
        // tooltip: true
       // legend: [0, 2, 4, 6, 8, 10],
        legend: [0, 6, 10],
        legendColors: {
        //	min: "#efefef",
    	//	max: "steelblue",
            min: "#ff0000",
        	max: "#00ff00",
    		empty: "black"
    		// Will use the CSS for the missing keys
    	},
        itemName: ["hour", "hours"],
        legendVerticalPosition: "top"
    });
}

function getCellSize(){
    // This function returns the cellSize based on the screen width
    var windowWidth = window.innerWidth;
    var cellSize = Math.floor((windowWidth-24)/14);
    return cellSize;
}

$(window).on("orientationchange",
    // If the orientation of the display changes,
    // the sizing of the calendar heat map is changed.
    // This may be better achieved without reinitializing
    // the entire heat map by inerfacing with the library
    // or changing html elements directly
    function() {
        // destroy the old calendar element first
        cal.destroy();
        initializeCal();
    }
)

// initialize the calendar heat map only after we login
ons.ready(function() {
  myNavigator.on('postpush', function(e) {
    initializeCal();
  });
});