import { Panel, Window, Subpanel, Cell } from './panels'
import { MatrixSubpanel } from './panels'
import { RenderableElement, InterfaceElement } from './screen'

class SettingsPanel extends Panel {
    contentSubpanel: MatrixSubpanel

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.contentSubpanel = new MatrixSubpanel()
        this.addSubpanel(this.contentSubpanel)

        var cell = new Cell()
        this.contentSubpanel.addCell(cell)
    }

}

export { SettingsPanel }
