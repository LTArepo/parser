import { Panel } from './panels'

declare var $: any

var $interface = $('#interface-container')
var $canvas = $('#canvas-container')
var $body = $('body')

var panel = new Panel($interface, 0, 0)
panel.render()
panel.destroy()

getComponents('/', x => console.log(x))
getComponent('/blocks/test.html', x => addComponentToCanvas($(x.html), x.options))

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
