import { RenderableElement } from './interface'
import { InterfaceElement } from './interface'

class Panel extends InterfaceElement {

    cssClasses = this.cssClasses + 'panel '

    render() {
        super.render()
    }

}

export { Panel }
