import { RenderableElement } from './interface'

class Panel extends RenderableElement {

    render() {
        console.log('child')
        super.render()
        console.log('child2')
    }


}

export { Panel }
