import { Panel, Window, Subpanel } from './panels'
import { MatrixSubpanel } from './panels'
import { RenderableElement } from './screen'
import * as Cells from './cells'

class SettingsPanel extends Panel {
    contentSubpanel: MatrixSubpanel

    render() {
        super.render()
        this.configureContents()
    }

    configureContents() {
        this.contentSubpanel = new MatrixSubpanel()
        this.addSubpanel(this.contentSubpanel)

        let label = new Cells.Label('Prueba')
        this.contentSubpanel.addCell(label)
    }
}

export { SettingsPanel }
