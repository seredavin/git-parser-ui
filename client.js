
const sseAddress = '/emitter'
const addAddress = '/add-repo'
const listAddress = '/all' 


class App {
    constructor(selector) {
        this.$ = document.querySelector(selector)
        this.#init()
    }

    #init() {
        this.clickHandler = this.clickHandler.bind(this)
        this.$.addEventListener('click', this.clickHandler)
        this.startEvents()
        fillList()
    }

    clickHandler(e) {
        if (e.target.tagName === 'BUTTON') {
            const {
                type
            } = e.target.dataset

            if (type === 'add-btn') {
                document.querySelector('#add-form').addEventListener('submit', function (e) {
                    e.preventDefault();
                })
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                        console.log(xmlHttp.status)
                    }
                }
                var path = addAddress + '?repoName=' + document.forms["add-form"].elements["url"].value
                xmlHttp.open("GET", path, true); // true for asynchronous 
                xmlHttp.send(null);
            }

        }
    }
    startEvents() {
        this.eventSource = new EventSource(sseAddress)


        this.eventSource.addEventListener('message', e => {
            var text = ''
            if (e.data === 'update') {
                console.log(e)
                fillList()
            }
        })

        this.eventSource.addEventListener('error', e => {
            this.eventSource.close()
        }, {once: true})
    }
}

function fillList() {
    var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", listAddress); // true for asynchronous 
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if (xmlHttp.responseText !== '') {
            var repoDate = JSON.parse(xmlHttp.responseText)
            var text = ''
            repoDate.forEach(element => {
                text = text 
                + '<a href="' + element.url + '" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">'
                + element.url 
                + '</h5>'
                + '<p class="list-group-item-text">'
                + element.license + '</p></a>'
            });
    
            document.getElementById('licenseList').innerHTML = '<div class="list-group">' + text + '</div>'
        }
    }
    
    xmlHttp.send(null);
}

const app = new App('main')
