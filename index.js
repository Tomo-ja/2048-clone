import Grid from "./Grid.js"
import Tile from "./Tile.js"

let bestScore = localStorage.getItem("bestScore") || 0

const $bestScore = document.getElementById("best-score")
const $newGameBtn = document.getElementById("new-game_btn")
$newGameBtn.addEventListener("click", ()=>{initGame()})
const $currentScore = document.getElementById("current-score")
const $gameBoard = document.getElementById("game-board")
let grid = null

initGame(true)
// game always start with 2 tiles
setupInput()

function initGame(firstTime = false){
	if (!firstTime){
		$gameBoard.innerHTML = ""
	}
	$currentScore.innerText = 0
	$bestScore.innerText = bestScore
	grid = new Grid($gameBoard)
	grid.randomEmptyCell().tile = new Tile($gameBoard)
	grid.randomEmptyCell().tile = new Tile($gameBoard)

}
function setupInput(){
	window.addEventListener("keydown", handleInput, {once: true})
}

async function handleInput(e){
	switch (e.key){
		case "ArrowUp":
			// if there is no block moving to the direction user press, 
			// skip everything and wait next key press
			if(!canMoveUp()){
				setupInput()
				return
			}
			// return resolve when all block's animation is done
			await moveUp()
			break
		case "ArrowDown":
			if(!canMoveDown()){
				setupInput()
				return
			}
			await moveDown()
			break
		case "ArrowRight":
			if(!canMoveRight()){
				setupInput()
				return
			}
			await moveRight()
			break
		case "ArrowLeft":
			if(!canMoveLeft()){
				setupInput()
				return
			}
			await moveLeft()
			break
		default:
			setupInput()
			return
	}

	grid.cells.forEach(cell => {
		let score = cell.margeTiles() + parseInt($currentScore.innerText)
		$currentScore.innerText = score
	})
	// each move makes new tile
	const newTile = new Tile($gameBoard)
	grid.randomEmptyCell().tile = newTile
	// if user can't make any move then, lost
	if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
		newTile.waitForTransition(true).then(()=>{
			displayGameOver()
			bestScore = Math.max(parseInt($currentScore.innerText, bestScore))
			localStorage.bestScore = bestScore
			})
		return
	}
	setupInput()
}

// to move by different order, pass different order of cells
function moveUp(){
	return slideTiles(grid.cellsByColum)
}
function moveDown(){
	return slideTiles(grid.cellsByColum.map(colum => [...colum].reverse()))
}
function moveLeft(){
	return slideTiles(grid.cellsByRow)
}
function moveRight(){
	return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles (cells) {
	return Promise.all(
		// group represent an array having cells in same either row or column
		cells.flatMap(group=>{
			const promises = []
			// don't do any thing on a cell already on edge
			for(let i=1; i< group.length; i ++){
				const cell = group[i]
				let lastValidCell = null
				// determine a cell can move until where
				for(let j = i -1; j >= 0; j--){
					const moveToCell = group[j]
					// cell doesn't have tile then evaluate next cell
					if(cell.tile == null) break
					// when hit other tile and can't be marge then evaluate next cell
					if(!moveToCell.canAccept(cell.tile)) break
					lastValidCell = moveToCell
				}
				// when cell has capacity of movement, lastValidCell is not null
				if(lastValidCell != null){
					promises.push(cell.tile.waitForTransition())
					// if the cell tile will go has tile already, do marge
					if(lastValidCell.tile != null){
						lastValidCell.margeTile = cell.tile
					}else{ //move tile dom onto new cell
						lastValidCell.tile = cell.tile
					}
					// delete tile from previous cell
					cell.tile = null
				}
			}
			return promises
		})
	)
}
// check at least one movement blok can make
function canMoveUp(){
	return canMove(grid.cellsByColum)
}
function canMoveDown(){
	return canMove(grid.cellsByColum.map(colum => [...colum].reverse()))
}
function canMoveLeft(){
	return canMove(grid.cellsByRow)
}
function canMoveRight(){
	return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells){
	return cells.some(group =>{
		return group.some((cell, index)=>{
			// when cell is on edge
			if(index === 0) return false
			if(cell.tile == null) return false
			const moveToCell = group[index - 1]
			return moveToCell.canAccept(cell.tile)
		})
	})
}

function displayGameOver(){
	const $gameOverContainer = document.createElement("div")
	$gameOverContainer.classList.add("game-board_game-over")
	const $gameOverText = document.createElement("h1")
	$gameOverText.classList.add("game-board_game-over_text")
	$gameOverText.innerText = "Game Over"
	const $gameOverBtn = document.createElement("div")
	$gameOverBtn.classList.add("game-board_game-over_btn")
	$gameOverBtn.innerText = "Try again"
	$gameOverContainer.appendChild($gameOverText)
	$gameOverContainer.appendChild($gameOverBtn)
	$gameBoard.appendChild($gameOverContainer)
	$gameOverBtn.addEventListener("click", ()=>{initGame()})
}