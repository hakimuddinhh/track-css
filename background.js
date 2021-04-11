console.log("Backround S running")

var offlineData = null;
chrome.tabs.onActivated.addListener(tab => {
    console.log(tab);
    console.log(chrome);

            chrome.tabs.executeScript(null, { file: './content.js' }, () => {
                chrome.runtime.onMessage.addListener(function(message, callback) {
                    console.log('message ====>', message);
                    if (message.type == "css_changed") {
            
                        const hasPopupOpened = chrome.extension.getViews({ type: "popup" });
                        // if popup is closed then the data should be stored so when it opens it will store it in its own localStorage
                        if(hasPopupOpened.length === 0) {
                            const {selector, styles, elementID} = message;
                            const parsedSelector = selector.split(" ")[0];
                            if (offlineData) {
                                offlineData[parsedSelector] = { styles, elementID };
                            } else {
                                offlineData = { [parsedSelector]: { styles, elementID } }
                            }
                            console.log('offlineDataofflineDataofflineDataofflineData', offlineData);

            
                        }
            
                        
                    }
                  });
            })

   

     
})
