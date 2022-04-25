
export default class Tile{
	#tileElement
	#value

	constructor(tileContainer, value = Math.random() > .5 ? 2 : 4){
		this.#tileElement = document.createElement("div")
		this.#tileElement.classList.add("tile")
		tileContainer.append(this.#tileElement)
		this.value = value // go setter automatically to init set up of dom design
	}
	get value(){
		return this.#value
	}

	// change number as well as text/background color
	set value(v){
		this.#value = v
		this.#tileElement.textContent = v
		const power = Math.log2(v)
		const backgroundLightness = 100 - power * 7
		this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
		this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness < 55 ? 90 : 10}%`)
	}

	// change the tile position
	set x(value){
		this.#tileElement.style.setProperty("--x", value)
	}
	// change the tile position
	set y(value){
		this.#tileElement.style.setProperty("--y", value)
	}
	// #tile is dom element so by below, delete dom from html
	remove(){
		this.#tileElement.remove()
	}

	// don't proceed a game till moving animation is end
	// with the situation game over
	waitForTransition(animation = false){
		return new Promise(resolve => {
			this.#tileElement.addEventListener( animation ? "animationend":"transitionend", resolve, {once: true})
		})
	}
}
