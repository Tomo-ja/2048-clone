

const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2


export default class Grid{
	#cells
	constructor (gridElement){
		gridElement.style.setProperty("--grid-size", GRID_SIZE)
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
		gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
		this.#cells = createCellElements(gridElement).map((cellElement, index) =>{
			return new cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
		})
	}
	get cells (){
		return this.#cells
	}
	get cellsByColum(){
		return this.#cells.reduce((cellGrid, cell)=>{
			cellGrid[cell.x] = cellGrid[cell.x] || []
			cellGrid[cell.x][cell.y] = cell
			return cellGrid
		}, [])
	}

	get cellsByRow(){
		return this.#cells.reduce((cellGrid, cell)=>{
			cellGrid[cell.y] = cellGrid[cell.y] || []
			cellGrid[cell.y][cell.x] = cell
			return cellGrid
		}, [])
	}

	get #emptyCell(){
		return this.#cells.filter(cell => cell.tile == null)
	}


	randomEmptyCell(){
		const randomIndex = Math.floor(Math.random() * this.#emptyCell.length)
		return this.#emptyCell[randomIndex]
	}
}



class cell {
	#cellElement
	#x
	#y
	#tile
	#margeTile

	constructor(cellElement, x, y){
		this.#cellElement = cellElement
		this.#x = x
		this.#y = y
	}
	get x(){
		return this.#x
	}
	get y(){
		return this.#y
	}
	get tile(){
		return this.#tile
	}

	set tile(value){
		this.#tile = value
		if (value == null) return
		this.#tile.x = this.#x
		this.#tile.y = this.#y
	}

	get margeTile (){
		return this.#margeTile
	}
	set margeTile(value){
		this.#margeTile = value
		if( value == null) return
		this.#margeTile.x = this.#x
		this.#margeTile.y = this.#y
	}
	canAccept(tile){
		return (
			this.tile == null || 
			(this.margeTile == null && this.tile.value === tile.value)
		)
	}

	margeTiles(){
		if(this.tile == null || this.margeTile == null) return
		this.tile.value = this.tile.value + this.margeTile.value
		this.margeTile.remove()
		this.margeTile = null
	}
}

function createCellElements(gridElement){
	const cells = []
	for (let i = 0; i < GRID_SIZE * GRID_SIZE; i ++){
		const cell = document.createElement('div')
		cell.classList.add("cell")
		cells.push(cell)
		gridElement.append(cell)
	}
	return cells
}
