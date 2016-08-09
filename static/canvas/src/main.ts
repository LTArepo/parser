import { Panel, Window } from './panels'
import { SettingsPanel, EditionPanel } from './interface'

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

// ==================================================
//		INTERFACE CONFIGURATION
// ==================================================


function configureInterface() {
    configureTestButton()
    configureEditionPanel()
    configureTopbar()
    configureMouseEvents()
}

function configureEditionPanel() {
    var edition_panel = new EditionPanel($interface, $interface.width() - 400, 300)
    edition_panel.render()
}

function configureTopbar() {
    var $settingsMenu = $('#settingsMenu')

    // Preferencias button
    $settingsMenu.click(function () {
        let x = $settingsMenu.offset().left
        let y = $settingsMenu.offset().top + $settingsMenu.height()
        let settings_panel = new SettingsPanel($interface, x, y, {
            slideUpOnClickOut: true
        })
        settings_panel.render()
    })

    // Importar button
    document.getElementById('page-uploader').addEventListener('change', function (event) {
        var reader = new FileReader()
        reader.onload = onReaderLoad
        reader.readAsText(event.target.files[0])
        function onReaderLoad(event) {
            var text = event.target.result
            loadUploadedPage(text)
        }
    })

    configureNodeList() // Barra desplegable de seleccion de nodos

}

function configureNodeList() {
    var $containers = $('#containersOptions')
    var $blocks = $('#blocksOptions')
    var $contents = $('#contentsOptions')
    var $floats = $('#floatsOptions')
    var $topbar_options = $('.in-topbar-options')

    // Collapse node list
    $('.in-topbar-item').click(function (e) {
        e.preventDefault()
        if (!$(this).hasClass('active')) {
            var target = $(this).attr('href')
            $('.in-topbar-item').removeClass('active')
            $('.options-container').hide()
            $(target).show()
            $('.in-topbar-options').slideDown()
            $(this).addClass('active')
        } else {
            $('.in-topbar-options').slideUp()
            $(this).removeClass('active')
        }
    });

    // Load component list contents 
    function loadComponents(path, $container) {
        getComponents(path, function (data) {
            if (data.length) {
                let nodes = data.map(x => generateComponentOptionNode(x, path))
                $container.append(nodes)
            }
        })
    }
    loadComponents('|containers', $containers)
    loadComponents('|blocks', $blocks)
    loadComponents('|contents', $contents)
    loadComponents('|floats', $floats)

    function generateComponentOptionNode(component_filename, path) {
        let component_name = component_filename.replace('.html', '')
        let html = '<div class="option-container text-center"><a id="containerFullWidth" href="#">'
        html += '<img class="option-img" src="/static/canvas/img/components_thumbnails/' + component_name
        html += '.gif" width="87" height="60" alt="' + component_name + '" title="' + component_name + '">'
        html += '<p class="no-margin option-label">' + component_name + '</p></a></div>'
        let $node = $(html)
        $node.click(function () {
            getComponent(path + '/' + component_filename, x => addComponentToCanvas($(x.html), x.options))
            $topbar_options.slideUp()
        })
        return $node
    }

}

function configureTestButton() {
    $('#test-button').click(function () {
        downloadPage()
    })
}

function configureMouseEvents() {
    // Menu closing system
    $('body').click(function (e) {
        var $target = $(e.target)
        if (!$target.closest('.close-on-click-out').length && !$target.closest('.in-interface').length) {
            closeCloseOnClickOutElements()
        }
    })
}

function closeCloseOnClickOutElements() {
    $('.close-on-click-out').each(function () {
        if ($(this).is(':visible')) {
            $(this).fadeOut()
        }
    })

    $('.slide-up-on-click-out').each(function () {
        if ($(this).is(':visible')) {
            $(this).slideUp()
        }
    })
}

function addTestNodes() {
    getComponent('/blocks/test.html', x => addComponentToCanvas($(x.html), x.options))
    getComponent('/blocks/test2.html', x => addComponentToCanvas($(x.html), x.options))
    getComponent('/blocks/test.html', x => addComponentToCanvas($(x.html), x.options))
}


// ==================================================
//		    CANVAS METHODS
// ==================================================


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
    $('#ed-document').val(document.body.innerHTML)
    document.getElementById('ed-save-form').submit()
}

/** Loads a backup file selected with the page-uploader input */
function loadUploadedPage(text: string) {
    console.log(text)
}

function addComponentToCanvas($node, options = {}) {
    $canvas.append($node)
    let node_offset = $node.offset()

    if (options.container) {
        let $interface_layer = $('<div class="in-node-layer" style="border: 1px dashed black; position: absolute;"></div>')

        // add to refresh!!
        $interface.append($interface_layer)
        $interface_layer.css({
            left: node_offset.left,
            top: node_offset.top,
            width: $node.width(),
            height: $node.height()
        })


    }
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
