//const { computeHeadingLevel } = require("@testing-library/dom");

// When the user opens the extension, get the toggle switch value that the user last set
document.getElementById("toggle").checked = JSON.parse(localStorage.getItem("toggleState"));
// Also get the intensity button selection
var intensityButtonChecked = JSON.parse(localStorage.getItem("intensitySelection"));

// Populate website information here, currently just an array for testing 
// Right now the site list reloads everytime the user closes/opens the extension
// Need to add functionality to talk to the server to get updated list when
// a user adds/ removes site
var testWebsites = ["https://ucsd.edu", "https://google.com", "https://welcome.com",
"https://fake1.com", "https://fake2.com", "https://fake3.com"];
localStorage.setItem("sites", JSON.stringify(testWebsites));

// Tracker array for testing
var testTrackers = ["123abc", "456def", "789ghi", "123jkl", "456mno", "789pqr"];
localStorage.setItem("trackers", JSON.stringify(testTrackers));

// Arbitrary value set for testing
var numberOfTrackersDetected = 3;
// Set to easy = 15
var trackerWarningThreshold = 16;

document.getElementById("toggle").addEventListener("click", tabInfo);

// This method runs when the user opens the extension
function tabInfo(){
  // User clicked the toggle switch to get here, save its new state
  localStorage.setItem("toggleState", JSON.stringify(document.getElementById("toggle").checked));
  intensityButtonChecked = JSON.parse(localStorage.getItem("intensitySelection"));
  
  /* Populate intensity button choice from previous session and listen for changes */

  // If no intensity is chosen
  if (intensityButtonChecked == null) {
    // Check easy by default
    document.getElementById("easy").checked = true;  
  } else {
  // Else set intensity to persist from last session
    document.forms.intensityButtons.intensity.value = intensityButtonChecked;  
    // Set the tracker warning threshold based on the value. 
    switch (intensityButtonChecked) {
      case "easy":
        trackerWarningThreshold = 15;
        break;
      case "medium":
        trackerWarningThreshold = 10;
        break;
      case "hard":
        trackerWarningThreshold = 3;
      //default:
      //  trackerWarningThreshold = 15;
    }
  }
  // Listen for the user to change the intensity selection
  document.addEventListener('input', (e) => {
    if (e.target.getAttribute('name') == "intensity") {
      // Set the change on the extension
      //document.forms.intensityButtons.intensity.value = e.target.value;  
      // Store the change in local storage
      localStorage.setItem("intensitySelection", JSON.stringify(e.target.value));
    }
  })
  

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    /* Display toggle switch, URL and enabled/disabled message always */

    // Should only be one tab so can just grab the first one
    var activeTab = tabs[0];
    // Make URL object and display it in the extension. 
    var url = new URL(activeTab.url);
    console.log(activeTab.url);
    // URL displays whether toggle is on or off
    document.getElementById("url").innerHTML=activeTab.url;
    // Send to server the url of the website
    var safeStatus = postData('http://143.198.97.103:8080/', { answer: activeTab.url })
    .then(data => {
        document.getElementById("response").innerHTML=data.Resp + "<br>";; // JSON data parsed by `data.json()` call
    }); 
    // Retrieve toggle switch state from local storage
    var toggleState = JSON.parse(localStorage.getItem("toggleState"));
    // Set toggle switch to correct state
    document.getElementById("toggle").checked = toggleState;

 
    /* Handle user enabling/disabling extension via toggle switch */

    // Toggle off extension disabled
    if (document.getElementById("toggle").checked == false){
      document.getElementById("enable").innerHTML = "Enable Extension?";
      //document.getElementById("trackers").innerHTML="Extension disabled. Not counting trackers";
      // Delete the children of the "approvedWebsiteList" ul
      clearWebsiteList(); 
      // Make the div that holds all the enabled information hide
      document.getElementById("visible").style.display = "none";
    } else {
      // Toggle on extension enabled
      document.getElementById("enable").innerHTML = "Disable Extension?";
      var trackers = localStorage.getItem("trackers");
      var trackersArray = JSON.parse(trackers);
      document.getElementById("trackers").innerHTML = trackersArray.length + " Trackers: (Click tracker number for more info)";
      document.getElementById("intensityQuestion").innerHTML = "How Intense do you want the extension to work?";
      document.getElementById("websiteList").innerHTML = "List of Approved Websites";
      //document.getElementById("addQuestion").innerHTML = "Would you like to add this site to the list of approved sites?"

      // Add li children to the "trackerList" ul
      populateTrackerList();
      // Add li children to the "approvedWebsiteList" ul
      populateWebsiteList();
      // Make the div that holds all the enabled information show
      document.getElementById("visible").style.display = "block";
    } 

    /* Helper methods */


    function addWebsiteToList () {
      window.alert("add website method called");
    }

    // Method to dynamically add tracker names (li) items to an unordered list (ul)
    function populateTrackerList(){
      // Load and parse site list as an array
      var trackers = localStorage.getItem("trackers");
      var trackersArray = JSON.parse(trackers);
      // Mark the website list location on the extension
      var ul = document.getElementById("trackerList");
      // Iterate the list adding each site as an li child to the ul
      trackersArray.forEach((item) => {
        var li = document.createElement("li");
        var numberButton = document.createElement("button");
        numberButton.innerHTML = trackersArray.indexOf(item);
        numberButton.setAttribute('class', "listSeparation");
        numberButton.addEventListener("click", function() {
          // Code here to load more tracker info
          // Or something to help the user make the 
          // decision to add the website to the list
          showExtraTrackerInfo(trackersArray.indexOf(item));
        }) 
        li.setAttribute('id', item);
        li.appendChild(numberButton);
        li.appendChild(document.createTextNode(item));
        // Finally add the li to the il
        ul.appendChild(li);
      })
    }

    
    function showExtraTrackerInfo(trackerNumber) {

      // Clear previous tracker info      
      var anchor = document.getElementById("popupTrackerHeadline");
      anchor.innerHTML = "Tracker # " + trackerNumber + " Additional Info";
      var ul = document.getElementById("popupTrackerInfo");
      removeAllChildren(ul);
      ul.appendChild(document.createTextNode("Tracker from Site: http://dangerous.com"));
      ul.appendChild(document.createTextNode("Tracker Danger Level: High"));
      ul.appendChild(document.createTextNode(""));
      var popupButton = document.getElementById("popupButton");
      removeAllChildren(popupButton);
      var whitelistButton = document.createElement("button");
      whitelistButton.innerHTML = "Whitelist this site";
      popupButton.appendChild(whitelistButton);
      var closeButton = document.createElement("button");
      closeButton.innerHTML = "Close Additional Info";
      popupButton.appendChild(closeButton);

      whitelistButton.addEventListener("click", function () {
        addWebsiteToList();
      })
      popupButton.addEventListener("click", function () {
        removeAllChildren(document.getElementById("popupTrackerHeadline"));
        removeAllChildren(document.getElementById("popupTrackerInfo"));
        removeAllChildren(document.getElementById("popupButton"));
      })
    }

    function removeAllChildren(parentNode) {
      while (parentNode.firstChild) {
        parentNode.firstChild.remove();
      }  
    }

    // Method to dynamically add website names (li) items to an unordered list (ul)
    function populateWebsiteList(){
      // Load and parse site list as an array
      var sites = localStorage.getItem("sites");
      var sitesArray = JSON.parse(sites);
      // Mark the website list location on the extension
      var ul = document.getElementById("approvedWebsiteList");
      // Iterate the list adding each site as an li child to the ul
      sitesArray.forEach((item) => {
        var li = document.createElement("li");
        // Remove button to left of each website name
        var button = document.createElement("button");
        button.innerHTML = "Remove";
        // Set button class to add separation between button and website name
        button.setAttribute('class', "listSeparation");
        // Make button remove website from list when clicked
        button.addEventListener("click", function() {
          removeItem(item);
          // Delete the item from the sites array
          sitesArray.splice(sitesArray.indexOf(item), 1);
          // Update sites array in local storage
          localStorage.setItem("sites", JSON.stringify(sitesArray));
        })
        // This li is titled with the website name from the array
        li.setAttribute('id', item);
        // Put the button next to the website name
        li.appendChild(button);
        li.appendChild(document.createTextNode(item));
        // Finally add the li to the il
        ul.appendChild(li);
      })
    }

    // Method to dynamically delete website names (li) items from an unordered list (ul) 
    function clearWebsiteList(){
      // Load and parse site list as an array
      var sites = localStorage.getItem("sites");
      var sitesArray = JSON.parse(sites);
      // For each site in the array, locate it and delete it from DOM
      sitesArray.forEach((item) => {
        removeItem(item);
      })
    }
  
    // Method to remove an item from the DOM if it exists
    function removeItem(item) {
      var toRemove = document.getElementById(item);
      if (toRemove != null) {
        toRemove.parentElement.removeChild(toRemove);
      }
    }
  }); // chrome.tabs.query () end
} // tabInfo() end

  
        /*


//console.log(safeStatus);
      //document.getElementById("response").innerHTML=safeStatus + "<br>";

      // // Get URL length
      // var url_len = activeTab.url.length;

      // // // Get top-level domain (com, net, org, etc.)
      // var tld = url.hostname.split(".").slice(-1)[0];
      
      // // // Get protocol (1 for https, 0 for http)
      // var protocol = (url.protocol=="https:") ? 1 : 0;

      // document.writeln("URL length: " + url_len);
      // document.writeln("Top-level Domain: " + tld);
      // document.writeln("Protocol: " + protocol);

          //document.writeln("Cookies detected: " + cookie.length);
            document.getElementById("trackers").innerHTML="Number of trackers on this website: " + cookie.length + '<br>';
            if (cookie.length > 0) {
                console.log(cookie);
                console.log(cookie[0]["domain"]);
            }
       

      

  });

}
*/
// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(data) // body data type must match "Content-Type" header
      body: JSON.stringify(data)
    });

    return response.json(); // parses JSON response into native JavaScript objects
}
  
//   postData('https://143.198.97.103/getdata', { answer: activeTab.url })
//     .then(data => {
//       console.log(data); // JSON data parsed by `data.json()` call
//     });
window.onload=tabInfo;

