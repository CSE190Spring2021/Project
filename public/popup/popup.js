function cookieinfo(){
   
  chrome.tabs.query({"status":"complete","windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tab){
         console.log(JSON.stringify(tab));
         chrome.cookies.getAll({"url":tab[0].url},function (cookie){
             console.log(cookie.length);
             allCookieInfo = "";
             for(i=0;i<cookie.length;i++){
                 console.log(JSON.stringify(cookie[i]));

                 allCookieInfo = allCookieInfo + JSON.stringify(cookie[i]);
             }
             //localStorage.currentCookieInfo = allCookieInfo;
             //document.write(allCookieInfo);
             //cookieCount++;
             document.write("Cookies detected: " + cookie.length);
         });
 });

}
window.onload=cookieinfo;