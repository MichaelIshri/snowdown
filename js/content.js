let domHelpers = {
    // Appends a dom element immediately after the rootNode.
    // The sibling must be created using createElement().
    appendSibling: function(rootNode, siblingNodeToAttach) {
        return rootNode.parentNode.insertBefore(siblingNodeToAttach, rootNode.nextSibling)
    }
}

let toggleButtons = {
    // Attach the toggle buttons bar to the bottom of the textarea.
    add: function(textarea, mdItem) {
        let toAppend = this.make(mdItem)
        domHelpers.appendSibling(textarea, toAppend)

        this.btnMarkdownSetup(textarea, mdItem)
        this.btnPlainTextSetup(textarea, mdItem)
        this.btnOpenTabSetup(textarea, mdItem)
    },

    // Generate the elements that will become the toggle buttons bar.
    make: function(mdItem) {
        let sibling = document.createElement('div')
        with (sibling) {
            className = "calmdown-toggle-buttons-container"
            innerHTML = `
                <div id="${mdItem.btnOpenTab}" class="calmdown-toggle-button">Open Tab</div>
                <div id="${mdItem.btnMarkdown}" class="calmdown-toggle-button">Markdown</div>
                <div id="${mdItem.btnPlainText}" class="calmdown-toggle-button bg-gray-200">Plain Text</div
            `
        }
        return sibling
    },

    // Setup activate & deactivate methods as well as the click event for the Markdown button.
    btnMarkdownSetup: function(textarea, mdItem) {
        let btnMarkdown = document.getElementById(mdItem.btnMarkdown)

        btnMarkdown.activate = function() {
            btnMarkdown.classList.add('bg-orange-300')

            with(document.getElementById(mdItem.markdown_id)) {
                innerHTML = marked(textarea.value)
                style.display = "block"
            }
        }

        btnMarkdown.deactivate = function() {
            btnMarkdown.classList.remove('bg-orange-300')

            with(document.getElementById(mdItem.markdown_id)) {
                style.display = "none"
            }
        }

        btnMarkdown.addEventListener('click', function(){
            markdown.show(mdItem)
        })
    },

    // Setup activate & deactivate methods as well as the click event for the Plain Text button.
    btnPlainTextSetup: function(textarea, mdItem) {
        let btnPlainText = document.getElementById(mdItem.btnPlainText)

        btnPlainText.activate = function() {
            btnPlainText.classList.add('bg-gray-200')
            textarea.style.display = "block"
        }

        btnPlainText.deactivate = function() {
            btnPlainText.classList.remove('bg-gray-200')
            textarea.style.display = "none"
        }

        btnPlainText.addEventListener('click', function(){
            plainText.show(mdItem)
        })
    },

    btnOpenTabSetup: function(textarea, mdItem) {
        let btnOpenTab = document.getElementById(mdItem.btnOpenTab)

        btnOpenTab.addEventListener('click', function(){
            openTab.show(textarea, mdItem)
        })
    }
}

let openTab = {
    show: function(textarea, mdItem) {
        let message = {
            type: 'set-textarea-content',
            text: textarea.value,
            source: window.location.toString()
        }

        chrome.runtime.sendMessage(message)
    }
}

let markdown = {
    elements: [],

    new: function(textarea) {
        let properties = {
            id: this.elements.length,
            enabled: false,
            markdown_id: `md_${textarea.id}`,
            textarea_id: textarea.id,
            width: textarea.offsetWidth,
            height: textarea.offsetHeight,
            btnOpenTab: `btnOpenTab_${textarea.id}`,
            btnMarkdown: `btnMarkdown_${textarea.id}`,
            btnPlainText: `btnPlainText_${textarea.id}`
        }

        this.elements.push(properties)

        return properties
    },

    add: function(textarea, mdItem) {
        let toAppend = this.make(mdItem)
        domHelpers.appendSibling(textarea, toAppend)
    },

    make: function(mdItem) {
        let sibling = document.createElement('div')
        with (sibling) {
            className = "calmdown"
            setAttribute("id", mdItem.markdown_id)
            style.display = "none"
            style.height = mdItem.height + "px"
        }
        return sibling
    },

    show: function(mdItem) {
        // Skip rendering if it's already active.
        if(mdItem.enabled == true) {
            return null;
        }

        mdItem.enabled = true
        document.getElementById(mdItem.btnMarkdown).activate()
        document.getElementById(mdItem.btnPlainText).deactivate()
    }
}

let plainText = {
    show: function(mdItem) {
        // Skip rendering if it's already active.
        if(mdItem.enabled == false) {
            return null;
        }

        mdItem.enabled = false
        document.getElementById(mdItem.btnMarkdown).deactivate()
        document.getElementById(mdItem.btnPlainText).activate()
    }
}

let snowdown = {

    boot: function() {
        snowdown.start()
        console.log('SnowDown has booted', Date.now())
    },

    start: function() {
        let textareas = document.getElementsByTagName('textarea')

        for(let textarea of textareas) {

            if (textarea.id == "undefined") {
                continue
            }

            mdItem = markdown.new(textarea)
            toggleButtons.add(textarea, mdItem)
            markdown.add(textarea, mdItem)
        }
    }
}

// Boot the application
snowdown.boot()
