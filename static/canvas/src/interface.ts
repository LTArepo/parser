import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel, TabbedMatrixSubpanel } from './panels'
import { RenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

class EditionPanel extends Window {
    tabSubpanel: TabbedMatrixSubpanel
    $node: any

    constructor($container, $node) {
        super($container)
        this.$node = $node
    }

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.tabSubpanel = new TabbedMatrixSubpanel()
        this.addSubpanel(this.tabSubpanel)
        this.tabSubpanel.addTab({ icon_path: 'tab_path', tabGenerator: this.posicionamientoTab })
        this.tabSubpanel.addTab({ icon_path: 'tab_path', tabGenerator: this.estiloTab })
        this.tabSubpanel.loadTab(this.posicionamientoTab)
    }

    posicionamientoTab(panel) {

        let align_label = new Cells.Label('Alineación')
        let buttons: Array<Cells.IconButton> = [
            { label: 'Izquierda', icon_path: '/static/canvas/img/icons-panel/icon-align-left-inactive.png', callback: () => console.log('Izquierda') },
            { label: 'Centrado', icon_path: '/static/canvas/img/icons-panel/icon-align-center-inactive.png', callback: () => console.log('Centrado') },
            { label: 'Derecha', icon_path: '/static/canvas/img/icons-panel/icon-align-right-inactive.png', callback: () => console.log('Derecha') }]
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

    }

}

class SettingsPanel extends Panel {
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

export { SettingsPanel, EditionPanel }
