//const { computeHeadingLevel } = require("@testing-library/dom");

document.getElementById("toggle").addEventListener("click", tabInfo);



function tabInfo(){
   
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    // Should only be one tab so can just grab the first one
    var activeTab = tabs[0];

    // // Make URL object
    var url = new URL(activeTab.url);
    console.log(activeTab.url);
    document.getElementById("url").innerHTML=activeTab.url;
    //send to server the url of the website
    var safeStatus = postData('http://143.198.97.103:8080/', { answer: activeTab.url })
    .then(data => {
        document.getElementById("response").innerHTML=data.Resp + "<br>";; // JSON data parsed by `data.json()` call
    }); 


    // Dummy array for testing website list storage locally
    var testWebsites = ["Website 1", "Website 2", "Website 3"];
    
    // Stringify the array for local storage
    localStorage.setItem("sites", JSON.stringify(testWebsites));



    // Method to dynamically add website names (li) items to an unordered list (ul)
    function populateWebsiteList(){
      // Load and parse site list as an array
      var sites = localStorage.getItem("sites");
      var sitesArray = JSON.parse(sites);
      // Mark the website list location
      var ul = document.getElementById("approvedWebsiteList");
      // Iterate the list adding each site as an li child to the ul
      sitesArray.forEach((item) => {
        var li = document.createElement("li");
        li.setAttribute('id', item);
        li.appendChild(document.createTextNode(item));
        ul.appendChild(li);
      })
    }
    
    function clearWebsiteList(){
      // Load and parse site list as an array
      var sites = localStorage.getItem("sites");
      var sitesArray = JSON.parse(sites);
      // Mark the website list location
      var ul = document.getElementById("approvedWebsiteList");
      sitesArray.forEach((item) => {
        ul.removeChild(document.getElementById(item));
      })

      //var item = document.getElementById(candidate.value);
      //ul.removeChild(item);
    }

    document.getElementById("intensityQuestion").innerHTML = "How Intense do you want the extension to work?";
    document.getElementById("websiteList").innerHTML = "List of Approved Websites"
    //check if the on button for the extension is switched to on
    if (document.getElementById("toggle").checked == false){
        document.getElementById("trackers").innerHTML="Extension disabled. Not counting trackers";
        clearWebsiteList(); 
        document.getElementsByClassName("visible").style.display = "none";
     

        // document.getElementById("intensityButtons");
    }
    // Get number of cookies
    else {
      document.getElementById("trackers").innerHTML = "Extension enabled";
      populateWebsiteList();
      document.getElementsByClassName("visible").style.display = "block";
      
    }
  });
}

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





          chrome.cookies.getAll({"url":activeTab.url}, function (cookie){
          //document.writeln("Cookies detected: " + cookie.length);
            document.getElementById("trackers").innerHTML="Number of trackers on this website: " + cookie.length + '<br>';
            if (cookie.length > 0) {
                console.log(cookie);
                console.log(cookie[0]["domain"]);
            }
        document.getElementById("intensityQuestion");
        document.getElementById("intensityButtons");
        
        var list = document.getElementById("approvedWebsiteList");



        var approvedWebsites = new Array(3);
        approvedWebsites[0] = "Website 1";
        approvedWebsites[1] = "Website 2";
        approvedWebsites[2] = "Website 3";

        localStorage.setItem("sites", JSON.stringify(approvedWebsites));

        approvedWebsites.forEach((item) => {
          var li = document.createElement('li');
          li.appendChild(document.createTextNode(item));
          list.appendChild(li);
        })
          //buttons for different extension intensities
          // document.getElementById("intensityButtons").innerHTML= '<p> How intense would you like the extension to work?</p> <br>' + '<input type="radio" name="favourite_colour"' +
          // 'value="low" checked> Low - only warns when there are 30 or more cookies <br>' + 
          // '<input type="radio" name="favourite_colour"' + 
          // 'value="medium"> Medium - only warns when there are 20 or more cookies<br>' + 
          // '<input type="radio" name="favourite_colour"' +
          // 'value="high"> High - only warns when there are 10 or more cookies <br>';
      });
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

