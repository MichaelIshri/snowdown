let messageJson = {
    type: 'get-textarea-content'
}

document.addEventListener('DOMContentLoaded', function(event){
    chrome.runtime.sendMessage(messageJson, function(response){
        document.getElementById('calmdown').innerHTML = response.md
    })
})
