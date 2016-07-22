import { RenderableElement } from './modules'

var a: Array<number> = [1, 2, 3]
var a2 = a.map(x => x + 1)

var thing = new RenderableElement('a', 1, 1)
thing.debug()
