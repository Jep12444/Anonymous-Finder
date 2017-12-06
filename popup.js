// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}
//-------------------------------------------------------------------------------------------
var port = null;

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

function appendMessage(text) {
  document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
  } else {
    document.getElementById('connect-button').style.display = 'block';
  }
}
function onNativeMessage(message) {
  var str = JSON.stringify(message);
  str = str.replace(/["]/g, ' ');
  var tempList = str.split(']');
  var count = tempList.length - 2;
  var index = 0;
  var tempString;
  var resultList;
  while(count > 0)
  {
    tempString = tempList[index].replace(/['[']/g, '');
    // appendMessage("tempString: <b>    \n" + tempString + "</b>");

    resultList = tempString.split(',');
    if (count == tempList.length - 2)
    {
      appendMessage("<b>Username:</b> " + resultList[0]);
      appendMessage("<b>Anonymity:</b> \n" + resultList[1]);
      appendMessage("<b>Toxicity:</b> \n" + resultList[2]);
    }
    else
    {
      appendMessage("<b>Username:</b> " + resultList[1]);
      appendMessage("<b>Anonymity:</b> \n" + resultList[2]);
      appendMessage("<b>Toxicity:</b> \n" + resultList[3]);

    }
    appendMessage("----------------------------------------\n");

    index++;
    count--;
  }
  // str = str.replace(/[\[\]']+/g,'');
  // appendMessage("Received message: <b>" + str + "</b>");
}

function onDisconnected() {
  appendMessage("Analysis Done");
  port = null;
  updateUiState();
}

/**
* function that analyzes the twitter page
*/
function analyze() {
  var hostName = "com.anonymous.anonymous_finder";
  // appendMessage("Connecting to <b>" + hostName + "</b>");
  appendMessage("Running");

  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}



document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', analyze);
  updateUiState();
});
