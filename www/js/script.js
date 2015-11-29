/*
This is the main app js file.
*/

///// Called when app launch

function initializeScript() {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#LogoutBtn").click(onLogoutBtn);
}


var currentMemoID;
var MC = monaca.cloud;

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

var cal;
var patientData;
function initializeCal(patientData){
    cal = new CalHeatMap();
    cal.init({
//        data: "data/data.json",
        data: patientData,
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
        //    min: "#efefef",
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
        getPatientData();
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
    getPatientData();
    console.log("test2")
  });
});



