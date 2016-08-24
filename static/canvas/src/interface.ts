import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel, TabbedMatrixSubpanel } from './panels'
import { RenderableElement, ChildRenderableElement, RootRenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

export class GUInterface {
    renderQueue: Array<RenderableElement> = []
    addComponentToCanvas: ($node, options) => any
    $container

    constructor($container) {
        this.$container = $container
    }

    refresh() {
        let length = this.renderQueue.length
        for (var i = 0; i < length; i++) {
            this.renderQueue[i].refresh()
        }
    }

    addElement(element: RenderableElement) {
        element.addID(generateID())
        this.renderQueue.push(element)
    }

    removeElementFromID(target_id: string) {
        let elem_data = this.getElementFromID(target_id)
        this.renderQueue.splice(elem_data.index, 1)
    }

    getElementFromID(target_id: string) {
        var element, index
        let length = this.renderQueue.length
        for (var i = 0; i < length; i++) {
            if (this.renderQueue[i].render_id == target_id) {
                element = this.renderQueue[i]
                index = i
                break
            }
        }
        return { element: element, index: index }
    }

    reset() {
        this.renderQueue.forEach(x => x.destroy())
    }

    removeElement(element: RenderableElement) {
        let target_id = element.render_id
        this.removeElementFromID(target_id)
    }

    removeFragment($fragment) {
        $fragment.find('.canvas-component').each($.proxy(function (i, e) {
            let elem_id = $(e).data('render-id')
            this.getElementFromID(elem_id).element.destroy()
        }, this))
    }

    addNodeToCanvas($node, options) {
        let $cloned_node = $node.clone()
        this.addComponentToCanvas($cloned_node, options)
    }

    setAddComponentToCanvasFunction(fun: ($node, options) => any) {
        this.addComponentToCanvas = fun
    }

    // This class is handy if we want to log css changes, revert them and so on
    changeNodeCSS($node, css_dict) {
        $node.css(css_dict)
    }

}

export class EditionPanel extends Window {
    tabSubpanel: TabbedMatrixSubpanel
    topbarTitle = 'Panel de edición'
    $nodeTitleSubpanel: Subpanel
    minimized: boolean = false
    $node: any

    constructor($container, $node, GUI: GUInterface, x, y) {
        super($container, GUI, x, y)
        this.$node = $node
    }

    render() {
        super.render()
        this.configureContents()
    }

    minimize() {
        if (this.minimized) {
            this.tabSubpanel.$elem.show()
            this.$nodeTitleSubpanel.$elem.show()
            this.minimized = false
        } else {
            this.tabSubpanel.$elem.hide()
            this.$nodeTitleSubpanel.$elem.hide()
            this.minimized = true
        }
    }

    targetNode($node) {
        this.minimized = false
        this.$node = $node
        this.destroy()
        this.render()
    }

    configureContents() {
        this.$nodeTitleSubpanel = new Subpanel()
        this.$nodeTitleSubpanel.generate(this)
        this.$nodeTitleSubpanel.$elem.addClass('edition-panel-node-title-container')
        this.$nodeTitleSubpanel.addFragment('<img class="edition-panel-node-title-icon" src="/static/canvas/img/icons-node/edition-node-icon.png">')
        this.$nodeTitleSubpanel.addFragment('<div class="edition-panel-node-title">Contenedor x</div>')
        this.tabSubpanel = new TabbedMatrixSubpanel()
        this.addSubpanel(this.tabSubpanel)
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/format-icon.png',
            tabGenerator: this.posicionamientoTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/style-icon.png',
            tabGenerator: this.estiloTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/code-icon.png',
            tabGenerator: this.HTMLTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.loadTab(this.posicionamientoTab, { '$node': this.$node, GUI: this.GUI })
    }

    posicionamientoTab(panel, options = {}) {

        var $node = options['$node']
        var GUI = options['GUI']

        function css(label: string, value) {
            let css_dict = {}
            css_dict[label] = value
            GUI.changeNodeCSS($node, css_dict)
        }

        let align_label = new Cells.Label('Alineación')
        let buttons: Array<Cells.IconButton> = [
            {
                label: 'Izquierda',
                icon_path: '/static/canvas/img/icons-panel/icon-align-left-inactive.png',
                callback: () => css('text-align', 'left')
            },
            {
                label: 'Centrado',
                icon_path: '/static/canvas/img/icons-panel/icon-align-center-inactive.png',
                callback: () => css('text-align', 'center')
            },
            {
                label: 'Derecha',
                icon_path: '/static/canvas/img/icons-panel/icon-align-right-inactive.png',
                callback: () => css('text-align', 'right')
            }]

        let align_entry = new Cells.IconButtons(buttons)

        let margin_label = new Cells.Label('Márgenes exteriores')
        let number_inputs: Array<Cells.NumberInput> = [
            { label: 'Arriba', min: 0, max: 500, step: 1, callback: x => css('margin-top', x) },
            { label: 'Derecha', min: 0, max: 500, step: 1, callback: x => css('margin-right', x) },
            { label: 'Abajo', min: 0, max: 500, step: 1, callback: x => css('margin-bottom', x) },
            { label: 'Izquierda', min: 0, max: 500, step: 1, callback: x => css('margin-left', x) },
        ]
        let margin_entry = new Cells.NumberInputs(number_inputs)

        let padding_label = new Cells.Label('Márgenes interiores')
        number_inputs = [
            { label: 'Arriba', min: 0, max: 500, step: 1, callback: x => css('padding-top', x) },
            { label: 'Derecha', min: 0, max: 500, step: 1, callback: x => css('padding-right', x) },
            { label: 'Abajo', min: 0, max: 500, step: 1, callback: x => css('padding-bottom', x) },
            { label: 'Izquierda', min: 0, max: 500, step: 1, callback: x => css('padding-left', x) },
        ]
        let padding_entry = new Cells.NumberInputs(number_inputs)

        panel.addCell(align_label)
        panel.addCell(align_entry)
        panel.addCell(margin_label)
        panel.addCell(margin_entry)
        panel.addCell(padding_label)
        panel.addCell(padding_entry)
    }

    estiloTab(panel, options = {}) {

        var $node = options['$node']
        var GUI = options['GUI']

        function css(label: string, value) {
            let css_dict = {}
            css_dict[label] = value
            GUI.changeNodeCSS($node, css_dict)
        }

        let bgimage_label = new Cells.Label('Imagen de fondo')
        let bgimage_entry = new Cells.FileUpload('Inserta URL',
            (x) => console.log(x),
            function (x) {
                css('background-image', 'url(' + x + ')')
                css('background-repeat', 'no-repeat')
                css('background-size', '100% auto')
                css('background-position', 'center top')
            })
        let bgimage_helper = new Cells.TextHelper('Selecciona una imagen de tu ordenador')

        let bgcolor_label = new Cells.Label('Color de fondo')
        let bgcolor_entry = new Cells.ColorPicker(x => css('background-color', x))
        let bgcolor_helper = new Cells.TextHelper('Si consultas las paletas, abrirá otra pestaña')

        let borders_label = new Cells.Label('Bordes')
        let number_inputs: Array<Cells.NumberInput> = [
            { label: 'Grosor', min: 0, max: 500, step: 1, callback: x => css('border-width', x) },
        ]
        let borders_entry = new Cells.NumberInputs(number_inputs)
        let borders_color = new Cells.ColorPicker(x => css('border-color', x))
        let borders_helper = new Cells.TextHelper('Color del borde. Si consultas las paletas, abrirá otra pestaña')

        let sombra_label = new Cells.Label('Sombra')
        number_inputs = [
            { label: 'Anchura', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Altura', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Radio', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Difusión', min: 0, max: 500, step: 1, callback: x => console.log(x) },
        ]
        let sombra_entry = new Cells.NumberInputs(number_inputs)
        let sombra_color = new Cells.ColorPicker(x => console.log(x))
        let sombra_helper = new Cells.TextHelper('Color sombra. Si consultas las paletas, abrirá otra pestaña')

        panel.addCell(bgimage_label)
        panel.addCell(bgimage_entry)
        panel.addCell(bgimage_helper)

        panel.addCell(bgcolor_label)
        panel.addCell(bgcolor_entry)
        panel.addCell(bgcolor_helper)

        panel.addCell(borders_label)
        panel.addCell(borders_entry)
        panel.addCell(borders_color)
        panel.addCell(borders_helper)

        panel.addCell(sombra_label)
        panel.addCell(sombra_entry)
        panel.addCell(sombra_color)
        panel.addCell(sombra_helper)
    }

    preferenciasTab(panel, options = {}) {

        if (options['classes'].indexOf('in-image')) {

        }
    }

    HTMLTab(panel, options = {}) {
        var $node = options['$node']
        var GUI = options['GUI']

        let html_label = new Cells.Label('Código HTML')
        let html_entry = new Cells.TextArea(x => $node.html(x), $node.get(0).innerHTML)

        panel.addCell(html_label)
        panel.addCell(html_entry)
    }
}

export class NodeInterface extends RenderableElement {
    nodeLayer: NodeLayer
    nodeTopbar: NodeTopbar
    editionCallback: ($node) => any
    GUI: GUInterface
    $container: any
    $node: any

    constructor($container, $node, GUI: GUInterface, editionCallback: (n) => any) {
        super()
        this.editionCallback = editionCallback
        this.GUI = GUI
        this.$container = $container
        this.$node = $node
    }

    addID(id: string) {
        this.render_id = id
        this.$node.data('render-id', this.render_id)
    }

    render() {
        if (this.$node.hasClass('in-container')) {
            this.nodeLayer = new NodeLayer(this.$container, this.$node, this.GUI, this)
            this.nodeLayer.render()
            this.nodeTopbar = new NodeTopbar(this.$container, this.$node, this.GUI, this, this.editionCallback)
        } else {
            this.nodeTopbar = new NodeTopbar(this.$container, this.$node, this.GUI, this, this.editionCallback)
        }

        this.nodeTopbar.render()
    }

    destroy() {
        if (this.nodeLayer) this.nodeLayer.destroy()
        this.nodeTopbar.destroy()
    }
}

export class NodeLayer extends RootRenderableElement {
    cssClasses = this.cssClasses + 'in-node-layer '
    renderQueue: Array<RenderableElement>
    elemHTML = '<div></div>'
    node_offset: any
    node_interface: NodeInterface
    $node: any


    constructor($container, $node, GUI: GUInterface, node_interface: NodeInterface) {
        super($container, GUI)
        this.$node = $node
        this.node_interface = node_interface
    }

    render() {
        super.render()
    }

    refresh() {
        if (this.$node.is(':visible')) {
            this.node_offset = this.$node.offset()
            this.$elem.css({
                left: this.node_offset.left,
                top: this.node_offset.top,
                width: this.$node.width(),
                height: this.$node.height()
            })
        }
    }
}

export class NodeTopbar extends Panel {
    cssClasses = this.cssClasses + 'in-node-topbar '
    editionCallback: ($node) => any
    node_offset: any
    node_interface: NodeInterface
    mouseOver: boolean = true
    mouseOut1: boolean = true
    mouseOut2: boolean = true
    width: number
    $node: any

    constructor($container, $node, GUI: GUInterface, node_interface: NodeInterface, editionCallback: ($node) => any) {
        super($container, GUI)
        let node_offset = $node.offset()
        this.editionCallback = editionCallback
        this.x = node_offset.left
        this.y = node_offset.top
        this.node_interface = node_interface
        this.$node = $node
    }

    render() {
        super.render()
        this.$elem.css({ width: this.width })
        //this.addListeners()
        this.renderContents()
    }

    renderContents() {
        let $title = $('<div class="in-node-topbar-title"><img class="in-node-topbar-icon" src="/static/canvas/img/icons-node/drag-icon.png" width="19" height="17"> title</div>')
        let $actions_container = $('<div class="in-node-topbar-actions-container"></div>')
        let $append_button = $('<div class="in-node-topbar-append-button"></div>')
        let $duplicate_button = $('<div class="in-node-topbar-duplicate-button"></div>')
        let $delete_button = $('<div class="in-node-topbar-delete-button"></div>')
        this.$elem.append([$title, $actions_container])
        $actions_container.append([$append_button, $duplicate_button, $delete_button])


        $append_button.click(() => this.editionCallback(this.$node))
        $duplicate_button.click(() => this.GUI.addNodeToCanvas(this.$node, {}))
        $delete_button.click($.proxy(function () {
            this.GUI.removeFragment(this.$node)
            this.node_interface.destroy()
            this.$node.remove()
        }, this))
    }

    refresh() {
        if (this.$node.is(':visible')) {
            this.node_offset = this.$node.offset()
            this.$elem.css({
                left: this.node_offset.left,
                top: this.node_offset.top,
                width: this.$node.outerWidth()
            })
        }
    }

    addListeners() {
        this.$node.mouseover($.proxy(function () {
            this.mouseOver = true
            this.mouseOut1 = false
            this.show()
        }, this))
        this.$elem.mouseover($.proxy(function () {
            this.mouseOver = true
            this.mouseOut2 = false
            this.show()
        }, this))
        this.$node.mouseout($.proxy(function () {
            this.mouseOut1 = true
            if (this.mouseOut1 && this.mouseOut2) this.hide()
        }, this))
        this.$elem.mouseout($.proxy(function () {
            this.mouseOut2 = true
            if (this.mouseOut1 && this.mouseOut2) this.hide()
        }, this))
    }

    show() {
        this.$elem.show()
    }

    hide() {
        this.$elem.hide()
    }

}

export class ContainerNodeTopbar extends NodeTopbar {
    cssClasses = this.cssClasses + 'in-container-topbar '

    refresh() {
        this.node_offset = this.$node.offset()
        this.$elem.css({
            left: this.$node.width() - this.$elem.width(),
            top: this.node_offset.top + this.$node.height(),
            //width: this.$node.width()
        })
    }
}

export class SettingsPanel extends Panel {
    contentSubpanel: MatrixSubpanel

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.contentSubpanel = new MatrixSubpanel()
        this.addSubpanel(this.contentSubpanel)

        let title_label = new Cells.Label('Título')
        let title_entry = new Cells.TextInput(x => console.log(x))
        let doctype_label = new Cells.Label('Tipo de documento')
        let doctype_select = new Cells.Select(x => console.log(x), ['Formato', 'Branded'])

        this.contentSubpanel.addCell(title_label)
        this.contentSubpanel.addCell(title_entry)
        this.contentSubpanel.addCell(doctype_label)
        this.contentSubpanel.addCell(doctype_select)
    }
}


// ==================================================
//		     	UTILITIES
// ==================================================

function generateID() {
    return Math.random().toString(36).substr(2, 5)
}

