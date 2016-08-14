import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel, TabbedMatrixSubpanel } from './panels'
import { RenderableElement, ChildRenderableElement, RootRenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

export class GUInterface {
    renderQueue: Array<RenderableElement> = []
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
        // Add __id or substract specific element from array passing it
        this.renderQueue.push(element)

    }

    removeElement(element: RenderableElement) {
        element.destroy()
        // loop renderQueue until matching id and splice

    }

}

export class EditionPanel extends Window {
    tabSubpanel: TabbedMatrixSubpanel
    $node: any

    constructor($container, $node, GUI: GUInterface, x, y) {
        super($container, GUI, x, y)
        this.$node = $node
    }

    render() {
        super.render()
        this.configureContents()
    }

    targetNode($node) {
        this.$node = $node
        this.destroy()
        this.render()
    }

    configureContents() {
        this.tabSubpanel = new TabbedMatrixSubpanel()
        this.addSubpanel(this.tabSubpanel)
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/format-icon.png',
            tabGenerator: this.posicionamientoTab
        })
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/style-icon.png',
            tabGenerator: this.estiloTab
        })
        this.tabSubpanel.loadTab(this.posicionamientoTab)
    }

    posicionamientoTab(panel) {

        let align_label = new Cells.Label('Alineación')
        let buttons: Array<Cells.IconButton> = [
            {
                label: 'Izquierda',
                icon_path: '/static/canvas/img/icons-panel/icon-align-left-inactive.png',
                callback: () => console.log('Izquierda')
            },
            {
                label: 'Centrado',
                icon_path: '/static/canvas/img/icons-panel/icon-align-center-inactive.png',
                callback: () => console.log('Centrado')
            },
            {
                label: 'Derecha',
                icon_path: '/static/canvas/img/icons-panel/icon-align-right-inactive.png',
                callback: () => console.log('Derecha')
            }]

        let align_entry = new Cells.IconButtons(buttons)

        let margin_label = new Cells.Label('Márgenes exteriores')
        let number_inputs: Array<Cells.NumberInput> = [
            { label: 'Arriba', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Derecha', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Abajo', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Izquierda', min: 0, max: 500, step: 1, callback: x => console.log(x) },
        ]
        let margin_entry = new Cells.NumberInputs(number_inputs)

        let padding_label = new Cells.Label('Márgenes interiores')
        number_inputs = [
            { label: 'Arriba', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Derecha', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Abajo', min: 0, max: 500, step: 1, callback: x => console.log(x) },
            { label: 'Izquierda', min: 0, max: 500, step: 1, callback: x => console.log(x) },
        ]
        let padding_entry = new Cells.NumberInputs(number_inputs)

        panel.addCell(align_label)
        panel.addCell(align_entry)
        panel.addCell(margin_label)
        panel.addCell(margin_entry)
        panel.addCell(padding_label)
        panel.addCell(padding_entry)
    }

    estiloTab(panel) {

        let bgimage_label = new Cells.Label('Imagen de fondo')
        let bgimage_entry = new Cells.FileUpload('placeholder')
        let bgimage_helper = new Cells.TextHelper('Selecciona una imagen de tu ordenador')

        let bgcolor_label = new Cells.Label('Color de fondo')
        let bgcolor_entry = new Cells.ColorPicker(x => console.log(x))
        let bgcolor_helper = new Cells.TextHelper('Si consultas las paletas, abrirá otra pestaña')

        let borders_label = new Cells.Label('Bordes')
        let number_inputs: Array<Cells.NumberInput> = [
            { label: 'Grosor', min: 0, max: 500, step: 1, callback: x => console.log(x) },
        ]
        let borders_entry = new Cells.NumberInputs(number_inputs)
        let borders_color = new Cells.ColorPicker(x => console.log(x))
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
}

export class NodeInterface {
    nodeLayer: NodeLayer
    nodeTopbar: NodeTopbar
    editionCallback: ($node) => any
    GUI: GUInterface
    $container: any
    $node: any

    constructor($container, $node, GUI: GUInterface, editionCallback: (n) => any) {
        this.editionCallback = editionCallback
        this.GUI = GUI
        this.$container = $container
        this.$node = $node
    }

    render() {
        this.nodeTopbar = new NodeTopbar(this.$container, this.$node, this.GUI, this.editionCallback)
        this.nodeTopbar.render()

        if (this.$node.hasClass('in-container')) {
            this.nodeLayer = new NodeLayer(this.$container, this.$node, this.GUI)
            this.nodeLayer.render()
        }
    }
}

export class NodeLayer extends RootRenderableElement {
    cssClasses = this.cssClasses + 'in-node-layer '
    renderQueue: Array<RenderableElement>
    elemHTML = '<div></div>'
    node_offset: any
    $node: any


    constructor($container, $node, GUI: GUInterface) {
        super($container, GUI)
        this.$node = $node
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
    mouseOver: boolean = true
    mouseOut1: boolean = false
    mouseOut2: boolean = false
    width: number
    $node: any

    constructor($container, $node, GUI: GUInterface, editionCallback: ($node) => any) {
        super($container, GUI)
        let node_offset = $node.offset()
        this.editionCallback = editionCallback
        this.x = node_offset.left
        this.y = node_offset.top
        this.width = $node.width()
        this.$node = $node
    }

    render() {
        super.render()
        this.$elem.css({ width: this.width })
        this.addListeners()
        this.renderContents()
    }

    renderContents() {
        let $title = $('<div class="in-node-topbar-title">title<div>')
        let $append_button = $('<div class="in-node-topbar-append-button">x<div>')
        let $duplicate_button = $('<div class="in-node-topbar-duplicate-button">x<div>')
        let $delete_button = $('<div class="in-node-topbar-delete-button">x<div>')
        this.$elem.append([$title, $append_button, $duplicate_button, $delete_button])


        $append_button.click(() => this.editionCallback(this.$node))
        $delete_button.click()
    }

    refresh() {
        if (this.$node.is(':visible')) {
            this.node_offset = this.$node.offset()
            this.$elem.css({
                left: this.node_offset.left,
                top: this.node_offset.top,
                width: this.$node.width()
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
            this.mouseOut1 = false
            if (!this.mouseOut1 && !this.mouseOut2) this.hide()
        }, this))
        this.$elem.mouseout($.proxy(function () {
            this.mouseOut2 = false
            if (!this.mouseOut1 && !this.mouseOut2) this.hide()
        }, this))
    }

    show() {
        this.$elem.show()
    }

    hide() {
        this.$elem.hide()
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

