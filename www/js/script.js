/*
This is the main app js file.
*/

///// Called when app launch

function initializeScript() {
  // $("#LoginBtn").click(onLoginBtn);
  // $("#RegisterBtn").click(onRegisterBtn);
  // $("#LogoutBtn").click(onLogoutBtn);
}


var currentMemoID;
//var MC = monaca.cloud;

function onRegisterBtn()
{
  var email = $("#reg_email").val();
  var password = $("#reg_password").val();
  var clinician = {"clinician" : JSON.stringify($("#reg_clinician_id").val())}
  console.log(clinician)
console.log(MC);
  MC.User.register(email, password, clinician)
    .done(function()
    {
      console.log('Registration is success!' + MC.User._oid);
      myNavigator.replacePage('main.html', { animation : 'slide' })
    })
    .fail(function(err)
    {
        console.log('FAILED');
      alert('Registration failed!');
      console.error(JSON.stringify(err));
    });
}

function onLoginBtn()
{
  var email = $("#login_email").val();
  var password = $("#login_password").val();
  var MC = monaca.cloud;
  MC.User.login(email, password)
    .done(function()
    {
      console.log('login: '  + MC.User._oid);
//      getMemoList();
      myNavigator.replacePage('main.html', { animation : 'slide' })
    })
    .fail(function(err)
    {
      alert('Login failed: ' + err.message);
      console.error(JSON.stringify(err));
    });
}

function onLogoutBtn()
{
  MC.User.logout()
    .done(function()
    {
      console.log('Logout is success!');
      myNavigator.replacePage('login.html', { animation : 'slide' })
    })
    .fail(function(err)
    {
      alert('Logout failed!');
      console.error(JSON.stringify(err));
    });
}


/*
The calendar heatmap is initialized with the desired settings.
Calendar Heatmap Source: https://github.com/wa0x6e/cal-heatmap
*/

/* Old Heatmap with rows of days */
//var cal;
//var patientData;
//function initializeCal(locPatientData){
//    patientData = locPatientData
//    cal = new CalHeatMap();
//    cal.init({
//       data: "data/data.json",
//        // data: locPatientData,
//        // start: new Date(1990, 12),
//        domain: "week",
//        domainLabelFormat: "",
//        range: 4,
//        // colLimit: 14,
//        // rowLimit: 1,
//        cellSize: getCellSize(), // The cell size needs to be dynamically changed according to device, etc.
//        verticalOrientation: true,
//        // tooltip: true
//        // legend: [0, 6, 11],
//        legend: [1, 4, 6, 8, 11],
//        legendCellPadding: 3,
//        legendColors: {
//            min: "#efefef",
//    	    max: "#77DD77",
//		    empty: "#ffcccc"
//    		// Will use the CSS for the missing keys
//    	},
//        itemName: ["hour", "hours"],
//        legendVerticalPosition: "top"
//    });
//}
/* Old Heatmap with rows of days */

var cal;
var patientData;
function initializeCal(locPatientData){
    patientData = locPatientData
    cal = new CalHeatMap();
    cal.init({
       data: "data/data.json",
        start: new Date(2015, 11),
        domain: "month",
        subDomain: "x_day",
        range: 1,
        cellRadius: 16,
        cellPadding: 7,
        cellSize: getCellSize(), // The cell size needs to be dynamically changed according to device, etc.
        verticalOrientation: true,
        domainLabelFormat: "%B %Y",
        subDomainTextFormat: "%d",
        label: {
            position: "top",
        },
        legend: [1, 4, 6, 8, 11],
        legendCellPadding: 3,
        legendCellSize: getCellSize()*0.5,
        legendColors: {
            min: "#efefef",
            max: "#77DD77",
		    empty: "#ffcccc"
    		// Will use the CSS for the missing keys
    	},
        itemName: ["hour", "hours"],
        // legendVerticalPosition: "top"
    });
    changeHeatMapStyle();
}

function getCellSize() {
    // This function returns the cellSize based on the screen width
    var windowWidth = window.innerWidth;
    var cellSize = Math.floor((windowWidth-35)/7);
    return cellSize;
}

function changeHeatMapStyle() {
    // adjusts subdomain text size dynamically
    $(".subdomain-text").css("font-size", JSON.stringify(getCellSize()*0.25));
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
        if (!patientData){
            console.log('data does not exist');
            getPatientData();
    }
        else {
            console.log('data exists');
            initializeCal(patientData);
        }
    }
)

/*
End of Calendar Heat Map
*/

/*
Data related functions
*/

function getPatientData(){
    // interface with the database callaback to return data
    var Patient = MC.Collection("Patient")
    Patient.find('user == "test@gmail.com"')
    .done(function(result)
    {
       console.log('Total items found: ' + result.items);
       console.log('The body of the first item: ' + result.items[0]);
       var patientData = result.items[0].data
       initializeCal(patientData)
    })
    .fail(function(err)
    {
       console.log("Err#" + err.code +": " + err.message);
    });
}


/*
End of Data related function
*/


// initialize the script after each page change
initializeScript();
ons.ready(function() {
  myNavigator.on('postpush', function(e) {
    initializeScript();
    if (!patientData){
        // getPatientData();
        initializeCal([1]);
    }
    else {
        console.log('data exists');
        initializeCal(patientData);
    }
    console.log("test2")
  });
});



