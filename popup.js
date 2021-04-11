
let currentState = null;

var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
let {offlineData} = background;
const renderStyleChange = (selector, value, elementID = null) => {

    if (document.getElementById(elementID)) {

        document.getElementById(elementID).innerHTML = `
            <h4>${selector}</h4>
            <span>${value}</span>
        `

        return;
    }



    const valueElem = document.createElement('span');
    valueElem.innerHTML = value;
    const selectorElem = document.createElement('h4');
    selectorElem.innerHTML = selector;
    const wrapperElem = document.createElement('div');
    wrapperElem.setAttribute("id", elementID)
    wrapperElem.appendChild(selectorElem);
    wrapperElem.appendChild(valueElem);
    document.querySelector('#show-data').appendChild(wrapperElem);
}


const renderStoredData = (data) => {
    console.log('data', data);
    const parsedSavedData = JSON.parse(data);
    Object.keys(parsedSavedData).forEach((keyName, i) => {
        renderStyleChange(keyName, parsedSavedData[keyName]['styles'], parsedSavedData[keyName]['elementID']);
    })
}

const savedData = localStorage.getItem('track-css');
if(offlineData && savedData) {
    const parsedSavedData = JSON.parse(savedData);
    const newData = {...parsedSavedData, ...offlineData};
    const newDataParsed = JSON.stringify(newData);

    localStorage.setItem('track-css', newDataParsed);
    offlineData = null;
}
if (savedData) {
    renderStoredData(savedData);
}




chrome.runtime.onMessage.addListener(function (message, callback) {
    const { selector, styles, elementID, type } = message;
    let savedData = null
    // Set the style changes in session storage
    if (type == "css_changed" && typeof styles === 'string' && selector) {

        const parsedSelector = selector.split(" ")[0];
        savedData = localStorage.getItem('track-css');
        if (savedData) {
            currentState = JSON.parse(savedData);
            currentState[parsedSelector] = { styles, elementID };
        } else {
            currentState = { [parsedSelector]: { styles, elementID } }
        }
        localStorage.setItem('track-css', JSON.stringify(currentState))


        // If data is present in current state then, just render the recently changed style
        // But if its not there (popup has been restarted) then, get it from session storage


        // Show the style changes in extention popup
        if (currentState) {
            renderStyleChange(selector, styles, elementID);
        }



    }



});

