import { RenderableElement } from './interface'
import { InterfaceElement } from './interface'

class Panel extends InterfaceElement {

    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'panel '

}

class MovablePanel extends Panel {
    cssClasses = this.cssClasses + 'movable '
}

export { Panel }
