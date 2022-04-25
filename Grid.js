

const GRID_SIZE = 4
const CELL_SIZE = 105
const CELL_GAP = 15


export default class Grid{
	// #cells will have array of dom element having a instance made of cell class
	#cells 
	constructor (gridElement){
		// create game-board
		gridElement.style.setProperty("--grid-size", GRID_SIZE)
		gridElement.style.setProperty("--cell-size", `${CELL_SIZE}px`)
		gridElement.style.setProperty("--cell-gap", `${CELL_GAP}px`)
		// display 16 cells on game-board and each that cell has cell instance with the exact location
		this.#cells = createCellElements(gridElement).map((_, index) =>{
			return new cell(index % GRID_SIZE, Math.floor(index / GRID_SIZE))
		})
	}
	get cells (){
		return this.#cells
	}
	get cellsByColum(){
		// return an array has 4 arrays that represents each row. inside each row, cell will be in order position top to bottom
		return this.#cells.reduce((cellGrid, cell)=>{
			cellGrid[cell.x] = cellGrid[cell.x] || []
			cellGrid[cell.x][cell.y] = cell
			return cellGrid
		}, [])
	}

	get cellsByRow(){
		// return an array has 4 arrays that represents each column. inside each column, cell will be in order position left to right
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
	#x
	#y
	#tile
	#margeTile

	constructor(x, y){
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

	// value should be tile dom element
	set tile(value){
		this.#tile = value
		if (value == null) return
		// trigger of setter in tile class to change tile's position
		this.#tile.x = this.#x
		this.#tile.y = this.#y
	}

	get margeTile (){
		return this.#margeTile
	}
		// value should be tile dom element
	set margeTile(value){
		this.#margeTile = value
		if( value == null) return
		// trigger of setter in tile class to change tile's position
		this.#margeTile.x = this.#x
		this.#margeTile.y = this.#y
	}
	// cell can accept when 
		// 1, doesn't have tile 
		// 2, hasn't marge any tile on this cell and both staying and coming tile's value are same
	canAccept(tile){
		return (
			this.tile == null || 
			(this.margeTile == null && this.tile.value === tile.value)
		)
	}

	margeTiles(){
		// don't do this when cell doesn't have tile nor another tile to marge
		if(this.tile == null || this.margeTile == null) return
		this.tile.value = this.tile.value + this.margeTile.value
		// delete one of tile on same cell from html
		this.margeTile.remove()
		this.margeTile = null
	}
}

// argument is game-board dom element and crete 16 cells and display them
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
