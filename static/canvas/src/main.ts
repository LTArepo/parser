import { Panel, Window } from './panels'
import { SettingsPanel } from './interface'

declare var $: any
declare var dragula: any

var $interface = $('#interface-container')
var $canvas = $('#canvas-container')
var $body = $('body')

/** entry point */
$(document).ready(function () {
    init()
})

function init() {
    configureInterface()
    addTestNodes()

    // Configure drag and drop
    dragula([document.querySelector('#canvas-container')])
}

function configureInterface() {
    // var window = new SettingsPanel($interface, 0, 0)
    // window.render()
    configureTestButton()
    configureTopbar()
}

function configureTopbar() {
    var $settingsMenu = $('#settingsMenu')

    $settingsMenu.click(function () {
        let x = $settingsMenu.offset().left
        let y = $settingsMenu.offset().top + $settingsMenu.height()
        let settings_panel = new SettingsPanel($interface, x, y)
        settings_panel.render()
    })
}

function configureTestButton() {
    $('#test-button').click(function () {
        downloadPage()
    })
}

function addTestNodes() {
    // getComponents('/', x => console.log(x))
    getComponent('/blocks/test.html', x => addComponentToCanvas($(x.html), x.options))
    getComponent('/blocks/test2.html', x => addComponentToCanvas($(x.html), x.options))
    getComponent('/blocks/test.html', x => addComponentToCanvas($(x.html), x.options))
}

/** passes a list of the components (and directories) of a given path to the callback */
function getComponents(path, callback) {
    path = formatPath(path)
    $.getJSON('http://localhost:5000/listcomponents/' + path, callback)
}

/** returns a parsed json with the node html and an options dict */
function getComponent(path, callback) {
    path = formatPath(path)
    $.getJSON('http://localhost:5000/getcomponent/' + path, callback)
}

function downloadPage() {
    //let node_array = []; $('#canvas-container').children().each(function () { node_array.push(this.HTML) })
    $('#ed-document').val(document.body.innerHTML)
    document.getElementById('ed-save-form').submit()
}

function addComponentToCanvas($node, options = {}) {
    $canvas.append($node)
}


// ==================================================
//			UTILITIES
// ==================================================

function formatPath(path) {
    return replace(path, '/', '|')
}

function replace(str: string, search: string, replacement: string) {
    return str.split(search).join(replacement)
}
