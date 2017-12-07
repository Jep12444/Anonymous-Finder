# Anonymous-Finder

Using a Mac:

1) Grabbing our Code

	From the mac terminal, grab our code from the github by typing in...

	git clone https://github.com/Jep12444/Anonymous-Finder.git

	Or go to https://github.com/Jep12444/Anonymous-Finder.git and click the green "Clone or download" button and download the zip to your computer.



2) Setting up your Google Chrome Extension

	Once you have the Anonymous-Finder folder downloaded, you can place it anywhere easy to access.
	
		Open up Google Chrome and click the more options button in the top right (three dots vertically aligned).
	
		Click on "More Tools" and click "Extensions"

		Click on the "Load unpacked extension" button on the top left.
	
		Navigate to where you placed the Anonymous-Finder folder and select it.
	
		Once you select it, you will be able to see your extension details as well as seeing the actual extension in the top right.
	
		In the details, copy the extension ID because you will need it to set up your environment.


	THE EXTENSION WILL NOT WORK UNTIL YOU FINISH SETTING UP YOUR ENVIRONMENT.



3) Setting up your environment for Native Messaging Host

	To run this code, there are a few configurations you must set up.
	
	First you must navigate to your NativeMessagingHosts folder.

		To get here, you can use the Finder app and hold down the alt/option key while hovering over "Go" in the top menu bar.

		You should see the folder Library which is a hidden folder. Click on Library.

		Go into the path Application Support/Google/NativeMessagingHosts
	

	Once you are in the folder you will see a json file and a json-e file.

		Rename the json file to be com.anonymous.anonymous_finder.json

		Rename the json-e file to be com.anonymous.anonymous_finder.json-e
	
	You will need to change some configurations here inside the json file.

		Open up the json file and under name make sure the name is "com.anonymous.anonymous_finder"

		The path is the path to the native-messaging-example-host file you downloaded in the Anonymous-Finder folder from github

			For example on my computer it is "path": "/Users/danielim/Desktop/Anonymous-Finder/native-messaging-example-host"

		For allowed-origins, you will need the chrome extension ID that you saved earlier.

		That ID will be entered here "chrome-extension://CHROMEEXTENSIONID/"


	Once you have the Native Messaging Host set up, your chrome extension should now run.
	
	*If you do not see a json-e dont worry about it but if you do not see a file or any files at all create a json file named com.anonymous_finder.json with the contents:
	
	```
	{
  		"name": "com.anonymous.anonymous_finder",
		"description": "Group Project",
  		"path": "/File/Path/To/Location/of/native-messaging-example-host",
  		"type": "stdio",
  		"allowed_origins": [
    	"chrome-extension://CHROMEEXTENSIONID/"
  		]
	}
	```

4) To run your extension

	The extension does not run if you open up chrome as an application. You must open up chrome through the terminal using a few flags.

	First, right click on chrome to quit the application.

	Go to the terminal and type in this command to open up your chrome browser...
	
		/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --foo --bar=2


	Once the chrome browser is open, you should be able to see your chrome extension in the top right of the browser.

		Click on the extension and click the Analyze button.

		To know it is working, you should see "Running" pop up and the extension will take a couple seconds to finish executing.

		After a couple seconds, you will be able to see a popup window listing the Username, Anonymity, and Toxicity.



