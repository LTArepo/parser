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
        this.contentSubpanel = new MatrixSubpanel(this.$elem)
        this.contentSubpanel.render()

        var cell = new Cell(this.contentSubpanel.$elem)
        cell.render()
    }

}

export { SettingsPanel }
