console.log('background.js', Date.now())

let messageJson = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.type) {
        case 'set-textarea-content':
            messageJson = request
            messageJson.md = marked(messageJson.text)

            chrome.tabs.create({
                active: true,
                url: chrome.runtime.getURL('html/opentab.html')
            })
        break
        case 'get-textarea-content':
            sendResponse(messageJson)
            messageJson = null
        break
    }
})
