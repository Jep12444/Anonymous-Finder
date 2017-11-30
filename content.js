/* content.js */

alert("You are on Twitter");sudo ln -s /usr/bin/nodejs /usr/bin/node

	
// Event listener for getting text from tweet
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") 
    {
		$.ajax({
        	type: "POST",
        	url: "extension/test.py",
        	data: { param: input },
        	success: callbackFunc;
   		 });
		
		var elem = document.querySelector("#home-timeline").querySelector("div");
        var tweetBox = elem.outerHTML;
		var style = tweetBox;
		
		// Change the color of the text for negative words
        for (var i = 0; i < users.length; i++) 
        {
        	style = style.replace(new RegExp(users[i], 'g'), 
        		'<span style="color:red ! important;">' + users[i] + '</span>');
        }
	    
	    tweetBox = style;
		 
		// Update the style
	    elem.outerHTML = textBox;
    }
  }
  function callbackFunc(response) 
  {
    // do something with the response
    console.log(response);
}
);