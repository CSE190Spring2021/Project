function tabInfo(){
   
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        // Should only be one tab so can just grab the first one
        var activeTab = tabs[0];

        // Make URL object
        var url = new URL(activeTab.url);

        // Get URL length
        var url_len = activeTab.url.length;

        // Get top-level domain (com, net, org, etc.)
        var tld = url.hostname.split(".").slice(-1)[0];
        
        // Get protocol (1 for https, 0 for http)
        var protocol = (url.protocol=="https:") ? 1 : 0;

        document.writeln("URL length: " + url_len);
        document.writeln("Top-level Domain: " + tld);
        document.writeln("Protocol: " + protocol);

        // Get number of cookies
        chrome.cookies.getAll({"url":activeTab.url}, function (cookie){
            document.writeln("Cookies detected: " + cookie.length);
        });

     });

}
window.onload=tabInfo;