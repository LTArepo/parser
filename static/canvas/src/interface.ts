import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel, TabbedMatrixSubpanel } from './panels'
import { RenderableElement, ChildRenderableElement, RootRenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

export var nodeShortTitles = {
    'one half': '1/2',
    'one third': '1/3',
    'two third': '2/3',
    'one fourth': '1/4',
    'three fourth': '3/4',
    'large 1338px': 'lg.',
    'small 996px': 'sm.',
    'fullwidth': 'fw.',
}

export class GUInterface {
    renderQueue: Array<RenderableElement> = []
    addComponentToCanvas: ($node, options) => any
    addComponentAfter: ($node, $after) => any
    autosaveFunction: () => void
    eventHistoryQueue: Array<any> = []
    redoHistoryQueue: Array<any> = []
    nodeConfigurationDict: {}
    $container



    constructor($container) {
        this.$container = $container
        this.configureKeyboardInput()
        //$.getJSON('/static/components/data/nodeConfigurationdict.json', this.setNodeConfigurationDict)
    }

    configureKeyboardInput() {
        $(document).keydown($.proxy(function (e) {
            if (e.which === 90 && e.ctrlKey && e.shiftKey) {
                this.redoNext()
            }
            else if (e.which === 90 && e.ctrlKey) {
                this.undoNext()
            }
        }, this));
    }

    getNodeConfigurationData($node) {
        var output = []
        $node.find('.ed-configuration').each(function () {
            let $elem = $(this)
            let data = $elem.data()
            for (var key in data) {
                if (key.indexOf('label') < 0) {
                    let configuration_parameter = {
                        key: key,
                        label: data[key + 'label'],
                        value: data[key]
                    }
                    output.push(configuration_parameter)
                }
            }
        })
        return output
    }

    // Returns the invisible ed-configuration element containing the JS configuration
    getNodeConfigElement($node) {
        return $node.find('.ed-configuration').first()
    }

    getNodeOptions($node) {
        return JSON.parse($node.attr('data-interface-options'))
    }

    setAutosave(autosaveFunction) {
        this.autosaveFunction = autosaveFunction
    }

    autosave() {
        if (this.autosaveFunction) this.autosaveFunction()
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
        let $cloned_node = $node.clone(true)
        this.addComponentToCanvas($cloned_node, options)
        this.autosave()
    }

    setAddComponentToCanvasFunction(fun: ($node, options) => any) {
        this.addComponentToCanvas = fun
    }

    setAddComponentAfterFunction(fun: ($node, options) => any) {
        this.addComponentAfter = fun
    }

    // Apply css change
    changeNodeCSS($node, css_dict) {
        $node.css(css_dict)
        this.autosave()
    }

    // This class is handy if we want to log css changes, revert them and so on
    css($node, label: string, value) {
        let old_value = $node.css(label)
        let css_dict = {}
        css_dict[label] = value
        this.changeNodeCSS($node, css_dict)
        this.addCSSEventToHistory($node, label, old_value)
    }

    addCSSEventToHistory($node, property_name: string, old_value: any) {
        let event = {
            event_type: 'css_property_change',
            $node: $node,
            property_name: property_name,
            value: old_value,
        }
        this.eventHistoryQueue.push(event)
    }

    undoNext() {
        let event = this.eventHistoryQueue.pop()
        if (event) this.undoEvent(event)
    }


    redoNext() {
        let event = this.redoHistoryQueue.pop()
        if (event) this.redoEvent(event)
    }

    applyCSSEvent(event) {
        let css_dict = {}
        css_dict[event.property_name] = event.value
        this.changeNodeCSS(event.$node, css_dict)
    }

    undoEvent(event) {
        if (event.event_type = 'css_property_change') {
            let current_value = event.$node.css(event.property_name)
            this.applyCSSEvent(event)

            let redo_event = event
            redo_event.value = current_value
            this.redoHistoryQueue.push(redo_event)
        }
    }

    redoEvent(event) {
        if (event.event_type = 'css_property_change') {
            let current_value = event.$node.css(event.property_name)
            this.applyCSSEvent(event)

            let undo_event = event
            undo_event.value = current_value
            this.eventHistoryQueue.push(undo_event)
        }
    }

}

export class EditionPanel extends Window {
    cssClasses = this.cssClasses += 'in-edition-panel '
    tabSubpanel: TabbedMatrixSubpanel
    topbarTitle = 'Panel de edición'
    $nodeTitleSubpanel: Subpanel
    targetNodeLabel: string = '[indefinido]'
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

    changeTargetNodeLabel(label: string) {
        this.targetNodeLabel = label
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
        let options = this.GUI.getNodeOptions(this.$node)
        this.changeTargetNodeLabel(options['title'])

        let viewportOffset = this.$elem.get(0).getBoundingClientRect();
        this.x = viewportOffset.left
        this.y = viewportOffset.top
        this.destroy()
        this.render()
    }

    configureContents() {
        this.$nodeTitleSubpanel = new Subpanel()
        this.$nodeTitleSubpanel.generate(this)
        this.$nodeTitleSubpanel.$elem.addClass('edition-panel-node-title-container')
        this.$nodeTitleSubpanel.addFragment('<img class="edition-panel-node-title-icon" src="/static/canvas/img/icons-node/edition-node-icon.png">')
        this.$nodeTitleSubpanel.addFragment('<div class="edition-panel-node-title">' + this.targetNodeLabel + '</div>')
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
            icon_path: '/static/canvas/img/icons-panel/text-icon.png',
            tabGenerator: this.textoTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/code-icon.png',
            tabGenerator: this.HTMLTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.addTab({
            icon_path: '/static/canvas/img/icons-panel/settings-icon.png',
            tabGenerator: this.configuracionTab,
            options: { '$node': this.$node, GUI: this.GUI }
        })
        this.tabSubpanel.loadTab(this.posicionamientoTab, { '$node': this.$node, GUI: this.GUI })
    }

    posicionamientoTab(panel, options = {}) {

        var $node = options['$node']
        var GUI = options['GUI']
        function css(label: string, value) {
            GUI.css($node, label, value)
        }

        var cells = []

        // Alineation
        cells.push(new Cells.Label('Alineación'))
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
        cells.push(new Cells.IconButtons(buttons))

        // Margin
        cells.push(new Cells.Label('Márgenes exteriores'))
        let number_inputs: Array<Cells.NumberInput> = [
            {
                label: 'Arriba',
                value: $node.css('margin-top'),
                min: 0, max: 500, step: 1,
                callback: x => css('margin-top', x)
            },
            {
                label: 'Derecha',
                value: $node.css('margin-right'),
                min: 0, max: 500, step: 1,
                callback: x => css('margin-right', x)
            },
            {
                label: 'Abajo',
                value: $node.css('margin-bottom'),
                min: 0, max: 500, step: 1,
                callback: x => css('margin-bottom', x)
            },
            {
                label: 'Izquierda',
                value: $node.css('margin-left'),
                min: 0, max: 500, step: 1,
                callback: x => css('margin-left', x)
            },
        ]
        cells.push(new Cells.NumberInputs(number_inputs))

        // Padding
        cells.push(new Cells.Label('Padding interior'))
        number_inputs = [
            {
                label: 'Superior*',
                value: $node.css('padding-top'),
                min: 0, max: 500, step: 1,
                callback: x => css('padding-top', x)
            },
            {
                label: 'Derecha',
                value: $node.css('padding-right'),
                min: 0, max: 500, step: 1,
                callback: x => css('padding-right', x)
            },
            {
                label: 'Inferior',
                value: $node.css('padding-bottom'),
                min: 0, max: 500, step: 1,
                callback: x => css('padding-bottom', x)
            },
            {
                label: 'Izquierda',
                value: $node.css('padding-left'),
                min: 0, max: 500, step: 1,
                callback: x => css('padding-left', x)
            },
        ]
        cells.push(new Cells.NumberInputs(number_inputs))
        cells.push(new Cells.TextHelper('* Invisible en modo edicion'))

        // @TODO:TEST Absolute positioning
        if ($node.hasClass('in-absolute')) {
            cells.push(new Cells.Label('Posicionamiento'))
            number_inputs = [
                {
                    label: 'Superior',
                    value: $node.css('top'),
                    min: 0, max: 500, step: 1,
                    callback: x => css('top', x)
                },
                {
                    label: 'Derecha',
                    value: $node.css('right'),
                    min: 0, max: 500, step: 1,
                    callback: x => css('right', x)
                },
                {
                    label: 'Inferior',
                    value: $node.css('bottom'),
                    min: 0, max: 500, step: 1,
                    callback: x => css('bottom', x)
                },
                {
                    label: 'Izquierda',
                    value: $node.css('left'),
                    min: 0, max: 500, step: 1,
                    callback: x => css('left', x)
                },
            ]
            cells.push(new Cells.NumberInputs(number_inputs))
        }

        // Resize (width and height)
        if ($node.hasClass('in-resizable')) {
            cells.push(new Cells.Label('Dimensiones'))
            number_inputs = [
                {
                    label: 'Width',
                    value: $node.css('width'),
                    min: 0, max: 2000, step: 20,
                    callback: x => css('width', x)
                },
                {
                    label: 'Height',
                    value: $node.css('height'),
                    min: 0, max: 2000, step: 20,
                    callback: x => css('height', x)
                },
            ]
            cells.push(new Cells.NumberInputs(number_inputs))
        }

        cells.forEach(x => panel.addCell(x))
    }

    estiloTab(panel, options = {}) {

        // Resources
        var $node = options['$node']
        var GUI = options['GUI']
        function css(label: string, value) {
            GUI.css($node, label, value)
        }


        var cells = []

        // Image
        if ($node.hasClass('in-container')) {
            cells.push(new Cells.Label('Imagen de fondo'))
            cells.push(new Cells.FileUpload('Inserta URL',
                function (x) {
                    css('background-image', 'url(' + x + ')')
                    css('background-repeat', 'no-repeat')
                    css('background-size', '100% auto')
                    css('background-position', 'center top')
                }))
            cells.push(new Cells.TextHelper('Provisionalmente, solo URLs'))
        } else if ($node.hasClass('in-image')) {
            cells.push(new Cells.Label('Imagen'))
            cells.push(new Cells.FileUpload('Inserta URL',
                function (x) { $node.attr('src', x) }))
            cells.push(new Cells.TextHelper('Provisionalmente, solo URLs'))
        }

        cells.push(new Cells.Label('Color de fondo'))
        cells.push(new Cells.ColorPicker(x => css('background-color', x)))
        cells.push(new Cells.TextHelper('Si consultas las paletas, abrirá otra pestaña'))

        cells.push(new Cells.Label('Bordes'))
        let number_inputs: Array<Cells.NumberInput> = [
            {
                label: 'Grosor',
                value: $node.css('border-width'),
                min: 0, max: 500, step: 1,
                callback: x => css('border-width', x)
            },
        ]
        cells.push(new Cells.NumberInputs(number_inputs))
        cells.push(new Cells.ColorPicker(x => css('border-color', x)))
        cells.push(new Cells.TextHelper('Color del borde. Si consultas las paletas, abrirá otra pestaña'))

        /*let sombra_label = new Cells.Label('Sombra')
        number_inputs = [
            {
                label: 'Anchura',
                value: $node.css('border-width'),
                min: 0, max: 500, step: 1,
                callback: x => console.log(x)
            },
            {
                label: 'Altura',
                value: $node.css('border-width'),
                min: 0, max: 500, step: 1,
                callback: x => console.log(x)
            },
            {
                label: 'Radio',
                value: $node.css('border-width'),
                min: 0, max: 500, step: 1,
                callback: x => console.log(x)
            },
            {
                label: 'Difusión',
                value: $node.css('border-width'),
                min: 0, max: 500, step: 1,
                callback: x => console.log(x)
            },
        ]
        let sombra_entry = new Cells.NumberInputs(number_inputs)
        let sombra_color = new Cells.ColorPicker(x => console.log(x))
        let sombra_helper = new Cells.TextHelper('Color sombra. Si consultas las paletas, abrirá otra pestaña')
	*/
        cells.forEach(x => panel.addCell(x))

    }

    textoTab(panel, options = {}) {
        var $node = options['$node']
        var GUI = options['GUI']

        function css(label: string, value) {
            GUI.css($node, label, value)
        }

        let tipografia_label = new Cells.Label('Tipografía')
        let tipografia_entry = new Cells.Select(x => css('font-family', x), ['Titillium Web', 'milio-font', 'Roboto'], $node.css('font-family'))

        let estilos_label = new Cells.Label('Estilos')
        //let estilos_entry = new Cells.
        let checkbox_inputs: Array<Cells.CheckboxInput> = [
            {
                label: 'Cursiva',
                callback_checked: () => css('font-style', 'italic'),
                callback_unchecked: () => css('font-style', 'normal')
            },
            {
                label: 'Subrayado',
                callback_checked: () => css('text-decoration', 'underline'),
                callback_unchecked: () => css('text-decoration', 'none')
            },
            {
                label: 'Tachado',
                callback_checked: () => css('text-decoration', 'line-through'),
                callback_unchecked: () => css('text-decoration', 'none')
            },
        ]
        let estilos_entry = new Cells.CheckboxInputs(checkbox_inputs)
        let estilos_helper = new Cells.TextHelper('Se aplicará a todo el texto')

        let tamano_label = new Cells.Label('Tamaño')
        let number_inputs = [
            {
                label: 'Dimension',
                value: $node.css('font-size'),
                min: 0, max: 120, step: 1,
                callback: x => css('font-size', x)
            },
            {
                label: 'Grosor',
                value: $node.css('font-weight'),
                min: 300, max: 800, step:
                100, callback: x => css('font-weight', x)
            },
        ]
        let tamano_entry = new Cells.NumberInputs(number_inputs)

        let color_label = new Cells.Label('Color de texto')
        let color_color = new Cells.ColorPicker(x => css('color', x))
        let color_helper = new Cells.TextHelper('Se aplicará a todo el texto')

        let bgcolor_label = new Cells.Label('Color de fondo del texto')
        let bgcolor_color = new Cells.ColorPicker(x => css('background-color', x))
        let bgcolor_helper = new Cells.TextHelper('Se aplicará a todo el texto')

        let espaciado_label = new Cells.Label('Espaciado')
        number_inputs = [
            {
                label: 'Vertical',
                value: $node.css('line-height'),
                min: 0, max: 120, step: 0.1,
                callback: x => css('line-height', x)
            },
            {
                label: 'Horizontal',
                value: $node.css('letter-spacing'),
                min: 0, max: 120, step: 0.5,
                callback: x => css('letter-spacing', x)
            },
        ]
        let espaciado_entry = new Cells.NumberInputs(number_inputs)

        panel.addCell(tipografia_label)
        panel.addCell(tipografia_entry)
        panel.addCell(estilos_label)
        panel.addCell(estilos_entry)
        panel.addCell(estilos_helper)
        panel.addCell(tamano_label)
        panel.addCell(tamano_entry)
        panel.addCell(color_label)
        panel.addCell(color_color)
        panel.addCell(color_helper)
        panel.addCell(bgcolor_label)
        panel.addCell(bgcolor_color)
        panel.addCell(bgcolor_helper)
        panel.addCell(espaciado_label)
        panel.addCell(espaciado_entry)
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

    configuracionTab(panel, options = {}) {
        var $node = options['$node']
        var GUI = options['GUI']
        var $config = GUI.getNodeConfigElement($node)

        var node_options = GUI.getNodeConfigurationData($node)
        node_options.forEach(function (entry) {
            let label = new Cells.Label(entry.label)
            let input = new Cells.TextInput((x) => changeParameter(entry, x), 'default: ' + entry.value)
            panel.addCell(label)
            panel.addCell(input)
        })

        function changeParameter(parameter, value) {
            $config.data(parameter.key, value)
        }
    }
}

export class NodeInterface extends RenderableElement {
    nodeOptions: {}
    nodeLayer: NodeLayer
    nodeTopbar: NodeTopbar
    editionCallback: ($node) => any
    GUI: GUInterface
    $container: any
    $node: any

    constructor($container, $node, GUI: GUInterface, editionCallback: (n) => any, options = undefined) {
        super()
        this.editionCallback = editionCallback
        this.GUI = GUI
        this.$container = $container
        this.$node = $node
        this.options = options || {
            title: '[indefinido]',
        }
    }

    addID(id: string) {
        this.render_id = id
        this.$node.data('render-id', this.render_id)
    }

    render() {
        if (this.$node.hasClass('in-container')) {
            this.nodeLayer = new NodeLayer(this.$container, this.$node, this.GUI, this)
            this.nodeLayer.render()
        }

        this.nodeTopbar = new NodeTopbar(this.$container, this.$node, this.GUI, this, this.editionCallback, this.options)
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
    options: {}
    width: number
    $node: any

    constructor($container, $node, GUI: GUInterface, node_interface: NodeInterface,
        editionCallback: ($node) => any, options = {}) {
        super($container, GUI)
        let node_offset = $node.offset()
        this.editionCallback = editionCallback
        this.node_interface = node_interface
        this.x = node_offset.left
        this.y = node_offset.top
        this.options = options
        this.$node = $node
    }

    render() {
        super.render()
        this.$elem.css({ width: this.width })
        //this.addListeners()
        this.renderContents()
    }

    renderContents() {
        let $title = $('<div class="in-node-topbar-title"><img class="in-node-topbar-icon" src="/static/canvas/img/icons-node/drag-icon.png" width="19" height="17"> ' + this.options['title'] + '</div>')
        let $actions_container = $('<div class="in-node-topbar-actions-container"></div>')
        let $append_button = $('<div class="in-node-topbar-append-button"></div>')
        let $duplicate_button = $('<div class="in-node-topbar-duplicate-button"></div>')
        let $delete_button = $('<div class="in-node-topbar-delete-button"></div>')
        this.$elem.append([$title, $actions_container])
        $actions_container.append([$append_button, $duplicate_button, $delete_button])

        $append_button.click($.proxy(function () {
            this.highlightTopbar()
            this.editionCallback(this.$node)
        }, this))
        $duplicate_button.click(() => this.GUI.addComponentAfter(this.$node.clone(true), this.$node))
        $delete_button.click($.proxy(function () {
            this.GUI.removeFragment(this.$node)
            this.node_interface.destroy()
            this.$node.remove()
        }, this))
    }

    highlightTopbar() {
        $('.in-node-topbar').removeClass('active')
        this.$elem.addClass('active')
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

