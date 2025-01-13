// Gameboard IIFE:
const gameBoard = (function()
{
    let board =
    [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    function getBoard() {return board}

    function setBoard(row, col, symbol) {board[row][col] = symbol}

    function resetBoard()
    {
        board =
        [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ] 
    }

    return {getBoard, setBoard, resetBoard}
})();


function createPlayer(playerName, playerSymbol)
{
    let name = playerName

    let row = null
    let col = null
    let symbol = playerSymbol

    function getName() {return name}
    function getSymbol() {return symbol}
    function getMove() {return [row, col, symbol]}
    function setMove(playerRow, playerCol)
    {
        row = playerRow
        col = playerCol
    }

    return {getMove, setMove, getName, getSymbol}
}

const playerOne = createPlayer('One', 'X')
const playerTwo = createPlayer('Two', 'O')

const Game = (function()
{
    let currentPlayer = playerOne
    let alternativePlayer = playerTwo

    function checkWin()
    {
        let board = gameBoard.getBoard()
        let symbol = alternativePlayer.getSymbol()

        symbol = symbol.repeat(3)

        // check rows
        for (let i=0; i<2; i++)
        {
            if (board[i][0] + board[i][1] + board[i][2] === symbol)
            {
                let one = document.querySelector(`.square[data-row_index="${i}"][data-col_index="0"]`)
                let two = document.querySelector(`.square[data-row_index="${i}"][data-col_index="1"]`)
                let three = document.querySelector(`.square[data-row_index="${i}"][data-col_index="2"]`)
                one.style.color = 'red'
                two.style.color = 'red'
                three.style.color = 'red'

                return true
            }
        }

        // check columns
        for (let i=0; i<2; i++)
        {
            if (board[0][i] + board[1][i] + board[2][i] === symbol)
            {
                let one = document.querySelector(`.square[data-row_index="0"][data-col_index="${i}"]`)
                let two = document.querySelector(`.square[data-row_index="1"][data-col_index="${i}"]`)
                let three = document.querySelector(`.square[data-row_index="2"][data-col_index="${i}"]`)
                one.style.color = 'red'
                two.style.color = 'red'
                three.style.color = 'red'
                
                return true
            }
        }

        // check diagonal

        if (board[0][0] + board[1][1] + board[2][2] === symbol)
        {
            let one = document.querySelector(`.square[data-row_index="0"][data-col_index="0"]`)
            let two = document.querySelector(`.square[data-row_index="1"][data-col_index="1"]`)
            let three = document.querySelector(`.square[data-row_index="2"][data-col_index="2"]`)
            one.style.color = 'red'
            two.style.color = 'red'
            three.style.color = 'red'
            
            return true
        }

        if (board[0][2] + board[1][1] + board[2][0] === symbol)
        {
            let one = document.querySelector(`.square[data-row_index="0"][data-col_index="2"]`)
            let two = document.querySelector(`.square[data-row_index="1"][data-col_index="1"]`)
            let three = document.querySelector(`.square[data-row_index="2"][data-col_index="0"]`)
            one.style.color = 'red'
            two.style.color = 'red'
            three.style.color = 'red'
            
            return true
        }

        return false 
    }

    function updateBoard()
    {
        let move  = currentPlayer.getMove()
        let row = move[0]
        let col = move[1]
        let symbol = move[2]
        board = gameBoard.getBoard()

        if (board[row][col] === null)
        {
            gameBoard.setBoard(move[0], move[1], move[2])
            if (currentPlayer === playerOne)
            {
                currentPlayer = playerTwo
                alternativePlayer = playerOne
            }
            else
            {
                currentPlayer = playerOne
                alternativePlayer = playerTwo
            }
            return true
        }
        return false

    }

    function displayBoard()
    {
        let board = gameBoard.getBoard()
        let gameboard = document.querySelector('.gameboard')
        gameboard.innerHTML = ""

        board.forEach((row, rowIndex) => {
            row.forEach((ele, colIndex) =>
            {
                let square = document.createElement('div')
                square.classList.add('square')
                square.textContent = ele
                square.dataset.row_index = rowIndex
                square.dataset.col_index = colIndex
                gameboard.appendChild(square)
            }
            )
        });
    }

    function playGame()
    {
        let player = document.querySelector('.player')
        playerName = currentPlayer.getName()

        player.textContent = "Player " + playerName + "'s Turn!"

        Game.displayBoard()

        const gameboard = document.querySelector('.gameboard')

        gameboard.addEventListener('mouseover', function(e){
            if (e.target.classList.contains('square') && e.target.textContent === ""){
                e.target.style.opacity = "0.5"
                e.target.textContent = currentPlayer.getSymbol()
            }
        })

        gameboard.addEventListener('mouseout', function(e){
            if (e.target.classList.contains('square') && e.target.style.opacity === "0.5"){
                e.target.textContent = ""
                e.target.style.opacity = ""
            }
        })

        gameboard.addEventListener('click', function(e)
    {
        if (e.target.classList.contains('square'))
        {
            let row = e.target.dataset.row_index
            let col = e.target.dataset.col_index
            currentPlayer.setMove(row, col)

            if (Game.updateBoard())
            {
                Game.displayBoard()
            }
            else
            {
                alert('Please select a valid square!')
            }
            
            if (checkWin())
            {
                player.textContent = "Player " + alternativePlayer.getName() + " WON!"

                setTimeout(function()
            {
                if (confirm("Play Again?"))
                    {
                        gameBoard.resetBoard()
                        Game.displayBoard()
                        currentPlayer = playerOne
                        alternativePlayer = playerTwo
                        player.textContent = "Player " + currentPlayer.getName() + "'s Turn!"
                    }
            }, 100)
            }
            else
            {
                player.textContent = "Player " + currentPlayer.getName() + "'s Turn!"
            }
            
        }
    })
    }

    return {checkWin, updateBoard, displayBoard, playGame}
})();


Game.playGame()


