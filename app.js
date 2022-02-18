const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let buttl

const getButtl = () => {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            buttl = json.toUpperCase()
        })
        .catch(err => console.log(err))
}
getButtl()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'BACKSPACE',
]
const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]
let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})

document.addEventListener('keydown', (event) => {
    const typedKey = event.key.toUpperCase();
    if(keys.indexOf(typedKey) > -1){
        if(event.key == 'Enter') {
            checkRow()
            return
        } 
        if(event.key == 'Backspace'){
            deleteLetter()
            return
        } else {
            handleClick(typedKey)
        }
    }
})
keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
    if(buttonElement.innerHTML === 'BACKSPACE'){
        buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path fill="#fff" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
      </svg>`
    }
})

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === 'BACKSPACE') {
            deleteLetter()
            return
        }
        if (letter === 'ENTER') {
            checkRow()
            return
        }
        addLetter(letter)
    }
}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')
    if (currentTile > 4) {
        fetch(`http://localhost:8000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Entry word not found') {
                    showMessage('That is not a word')
                    document.querySelector('.tile-container').classList.add('shake-board')
                    setTimeout( () => {
                        document.querySelector('.tile-container').classList.remove('shake-board')
                    },1000)
                    return
                } else {
                    flipTile()
                    if (buttl == guess) {
                        showMessage('Magnificent!')
                        isGameOver = true
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            showMessage(`Game Over - Word was: ${buttl}`)
                            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            }).catch(err => console.log(err))
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkButtl = buttl
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == buttl[index]) {
            guess.color = 'green-overlay'
            checkButtl = checkButtl.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkButtl.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkButtl = checkButtl.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}
