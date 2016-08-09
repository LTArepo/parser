import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel } from './panels'
import { RenderableElement } from './screen'
import * as Cells from './cells'

class EditionPanel extends Window {
    contentSubpanel: MatrixSubpanel

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.contentSubpanel = new MatrixSubpanel()
        this.addSubpanel(this.contentSubpanel)

        let align_label = new Cells.Label('Alineación')
        let buttons: Array<Cells.IconButton> = [
            { label: 'Izquierda', icon_path: 'icon_path', callback: () => console.log('Izquierda') },
            { label: 'Centrado', icon_path: 'icon_path', callback: () => console.log('Centrado') },
            { label: 'Derecha', icon_path: 'icon_path', callback: () => console.log('Derecha') }]
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

        this.contentSubpanel.addCell(align_label)
        this.contentSubpanel.addCell(align_entry)
        this.contentSubpanel.addCell(margin_label)
        this.contentSubpanel.addCell(margin_entry)
        this.contentSubpanel.addCell(padding_label)
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
