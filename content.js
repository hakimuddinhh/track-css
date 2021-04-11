// content.js

chrome.runtime.sendMessage({type: 'onload'}, (response) => {
    // do stuff with response (which will be the value of messageQueue
    // sent from background.js).
});



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    console.log('somethings changing', mutations[0].target.style.cssText);

    if (mutations[0].attributeName === 'style') {
        const { target } = mutations[0];

        const data = {
            type: 'css_changed',
            selector: target.className || target.localName,
            styles: target.style.cssText,
            // this is probably a unique identification for a DOM element as the offsets + id + class are rarely a repeated combination
            elementID: target.offsetHeight + target.offsetLeft + target.offsetTop + target.offsetWidth + target.tagName + [...target.classList] + target.id
        }

        chrome.runtime.sendMessage(data, (response) => {
            // do stuff with response (which will be the value of messageQueue
            // sent from background.js).
        });
        
    };
    // ...
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
    subtree: true,
    attributes: true
    //...
});

