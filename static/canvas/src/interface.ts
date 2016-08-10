import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel, TabbedMatrixSubpanel } from './panels'
import { RenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

class EditionPanel extends Window {
    tabSubpanel: TabbedMatrixSubpanel

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.tabSubpanel = new TabbedMatrixSubpanel()
        this.addSubpanel(this.tabSubpanel)
        this.tabSubpanel.addTab({ icon_path: 'tab_path', tabGenerator: this.posicionamientoTab })
        this.tabSubpanel.addTab({ icon_path: 'tab_path', tabGenerator: this.testTab })
        this.tabSubpanel.loadTab(this.posicionamientoTab)
    }

    posicionamientoTab(panel) {

        let align_label = new Cells.Label('Alineación')
        let buttons: Array<Cells.IconButton> = [
            { label: 'Izquierda', icon_path: '/static/canvas/img/icons-panel/icon-align-left.png', callback: () => console.log('Izquierda') },
            { label: 'Centrado', icon_path: '/static/canvas/img/icons-panel/icon-align-center.png', callback: () => console.log('Centrado') },
            { label: 'Derecha', icon_path: '/static/canvas/img/icons-panel/icon-align-right.png', callback: () => console.log('Derecha') }]
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

    testTab(panel) {

        let label1 = new Cells.Label('Alineación')
        let label2 = new Cells.Label('Alineación')
        panel.addCell(label1)
        panel.addCell(label2)
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
