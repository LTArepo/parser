import { Panel, Window } from './panels'
import { GUInterface, SettingsPanel, EditionPanel, NodeTopbar, NodeInterface } from './interface'

declare var $: any
declare var dragula: any
declare var requestAnimFrame: any

var $interface = $('#interface-container')
var _GUI
var $canvas = $('#canvas-container')
var $body = $('body')

var _panels = []
var _editionPanel: EditionPanel
var _dragula

// ==================================================
//		   INITIALIZATION 
// ==================================================

$(document).ready(function () {
    init()
})

function init() {
    configureInterface()

    // Configure drag and drop
    // @TODO: Refresh on drop
    _dragula = dragula([document.querySelector('#canvas-container'), { allowNestedContainers: true }])
    startRenderLoop()
}

// ==================================================
//		     RENDER LOOP
// ==================================================

function startRenderLoop() {
    (function animloop() {
        requestAnimationFrame(animloop)
        render()
    })()
}

function render() {
    _GUI.refresh()
}

// ==================================================
//		INTERFACE CONFIGURATION
// ==================================================

function configureInterface() {
    _GUI = new GUInterface($('#interface-container'))
    _GUI.setAddComponentToCanvasFunction(addComponentToCanvas)
    _GUI.setAddComponentAfterFunction(addComponentAfter)
    configureTestButton()
    configureTopbar()
    configureMouseEvents()
}

function createEditionPanel($target_node) {
    destroyEditionPanel()
    _editionPanel = new EditionPanel($interface, $target_node, _GUI, $interface.width() - 400, 300)
    _editionPanel.render()
}

function destroyEditionPanel() {
    if (_editionPanel) {
        _editionPanel.destroy()
        _editionPanel = undefined
    }
}

function configureTopbar() {
    var $settingsMenu = $('#settingsMenu')

    // Preferencias button
    $settingsMenu.click(function () {
        let x = $settingsMenu.offset().left
        let y = $settingsMenu.offset().top + $settingsMenu.height()
        let settings_panel = new SettingsPanel($interface, _GUI, x, y, {
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
            $('#page-uploader').val('')
        }
    })

    // Descargar button
    $('#downloadMenu').click(downloadPage)

    configureNodeList() // Barra desplegable de seleccion de nodos
}

function configureNodeList() {
    var $containers = $('#containersOptions')
    var $blocks = $('#blocksOptions')
    var $contents = $('#contentsOptions')
    var $floats = $('#floatsOptions')
    var $topbar_options = $('.in-topbar-options')

    // Collapse node list
    $('.in-topbar-item.with-children').click(function (e) {
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
                $container.append('<div class="owl-carousel owl-topbar"></div>')
                let nodes = data.map(x => generateComponentOptionNode(x, path))
                $container.children('.owl-topbar').append(nodes)
            }
            if (path == '|floats')
                activateTopbarCarousel()
        })
    }
    loadComponents('|containers', $containers)
    loadComponents('|blocks', $blocks)
    loadComponents('|contents', $contents)
    loadComponents('|floats', $floats)

    function generateComponentOptionNode(component_filename, path) {
        let component_name = component_filename.replace('.html', '')
        let thumbnails_path = '/static/canvas/img/components_thumbnails'
        let html = `<div class="option-container text-center"><a href="#">
	<img class="option-img" src="${thumbnails_path}/${component_name}.gif" width="87" height="60"
	alt="${component_name}" title="${component_name}">
	<p class="no-margin option-label">${component_name}</p></a></div>`
        let $node = $(html)
        $node.click(function () {
            getComponent(path + '/' + component_filename, x => _GUI.addComponentToCanvas($(x.html), x.options))
            $topbar_options.slideUp()
            $('.in-topbar-item.active').removeClass('active')
        })
        return $node
    }

}

function activateTopbarCarousel() {
    $(".owl-topbar").owlCarousel({
        items: 8,
        navigation: true,
        navigationText: ['<img class="in-topbar-icon" src="/static/canvas/img/owl-arrow-left.png" width="16" height="16">',
            '<img class="in-topbar-icon" src="/static/canvas/img/owl-arrow-right.png" width="16" height="16">']
    })
}


function configureTestButton() {
    $('#test-button').click(toggleInterface)
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            toggleInterface()
        }
    })
}

var interface_visibility = 1
function toggleInterface() {
    if (interface_visibility) {
        interface_visibility = 0
        hideInterface()
    } else {
        interface_visibility = 1
        showInterface()
    }
}

function hideInterface() {
    $('#interface-container').hide()
    $body.removeClass('editing')
    $('#ed-ghost-topbar').hide()
}

function showInterface() {
    $('#interface-container').show()
    $body.addClass('editing')
    $('#ed-ghost-topbar').show()
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
    console.log(document.body.innerHTML.length)
    $('#ed-document').val('')
    $('#ed-document').val(document.body.innerHTML)
    document.getElementById('ed-save-form').submit()
}

/** Loads a backup file selected with the page-uploader input */
function loadUploadedPage(text: string) {
    _GUI.removeFragment($canvas)
    $canvas.children().remove()
    let $new_canvas = $($.parseJSON(text)['canvas'])
    $canvas.append($new_canvas.children())
    setTimeout(() => addInterfaceToFragment($('#canvas-container')))
    //addInterfaceToFragment($canvas)
}

function addComponentToCanvas($node, options = {}) {
    $canvas.append($node)
    addInterfaceToNode($node)
    addInterfaceToFragment($node)
}

function addComponentAfter($node, $after, options = {}) {
    $after.after($node)
    addInterfaceToNode($node)
    addInterfaceToFragment($node)
}

function addInterfaceToNode($node) {
    $node.addClass('canvas-component')
    parseNodeOptions($node)
    function parseNodeOptions($node) {
        if ($node.hasClass('in-container')) {
            addContainerToDragAndDrop($node[0])
        }
    }

    let node_interface = new NodeInterface($interface, $node, _GUI, selectNode)
    _GUI.addElement(node_interface)
    node_interface.render()
}

function addInterfaceToFragment($fragment) {
    $fragment.find('.canvas-component').each(function () {
        addInterfaceToNode($(this))
    })
}

function addContainerToDragAndDrop(container) {
    _dragula.containers.push(container)
}

function selectNode($node) {
    if (_editionPanel) {
        _editionPanel.targetNode($node)
    } else {
        createEditionPanel($node)
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
