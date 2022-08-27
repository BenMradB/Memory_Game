class AudioController {
    constructor () {
        this.bgMusic = new Audio('../audio/Super Mario Bros. Theme Song.mp3');
        this.victorySound = new Audio('../audio/Assets_Audio_victory.wav');
        this.lossSound = new Audio('../audio/Assets_Audio_gameOver.wav');
        this.flippedSound = new Audio('../audio/Assets_Audio_flip.wav');
        this.matchedCardSound = new Audio('../audio/success.mp4');
        this.unMatchedCardSound = new Audio('../audio/fail.mp4');
        this.tictacSound = new Audio('../audio/clock-ticking-2.mp3');
        this.bgMusic.volume = 0.1;
        this.bgMusic.loop = true;
    }

    startGameMusic() {
        this.bgMusic.play();
    }

    stopGameMusic () {
        this.bgMusic.pause();
    }

    startVictoryMusic () {
        this.stopGameMusic();
        this.victorySound.play();
    }

    startLossMusic () {
        this.stopGameMusic();
        this.lossSound.play();
    }

    flippedMusic () {
        this.flippedSound.play();
    }

    matchedMusic () {
        this.matchedCardSound.play();
    }

    unMatchedMusic () {
        this.unMatchedCardSound.play();
    }

    startTictacMusic () {
        this.tictacSound.play();
    }

    stopTictacMusic () {
        this.tictacSound.pause();
    }

}

let victoryBox = document.querySelector('.victory');
let lossBox = document.querySelector('.loss');
let playerName = document.querySelectorAll('.player-name');
let playerScore = document.querySelector('.score');
let levelsContainer = document.querySelector('.levels-container');
let playerNameInput = document.querySelector(`[name="player-name"]`);
let levels = document.querySelectorAll(`[name="r1"]`);
let playButton = document.querySelector(`[type="button"]`);
let sweetAlert = document.querySelector('.sweet-alert');
let alertErrorMessage = document.querySelector('.error-message');
let alertButton = sweetAlert.lastElementChild.lastElementChild;
let timer = document.querySelector('.timer');
let wrongTries = document.querySelector('.wrong-tries');
let playerBestScore = document.querySelector('.your-best-score');
let gameContainer = document.querySelector('.game-container');
let allCards = Array.from(document.querySelectorAll('.box'));
let audioController = new AudioController();
let allMatchedCards = [];
let orderRange = [...Array(allCards.length).keys()];
let volumeOn = document.querySelector('.volume-on');
let volumeOff = document.querySelector('.volume-of');

console.log(volumeOff, volumeOn)

startTheGame();

volumeOn.addEventListener('click', () => {
    mute();
})

volumeOff.addEventListener('click', () => {
    unMute();
});

function confirmAlert() {
    alertButton.addEventListener('click', () => {
        audioController.flippedMusic();
        sweetAlert.classList.remove('visible');
        sweetAlert.classList.add('hidden');
        levelsContainer.classList.remove('hidden');
        levelsContainer.classList.add('visible');
    });
}

function stopClicking() {
    gameContainer.classList.add('no-events');
}

function backToClicking() {
    gameContainer.classList.remove('no-events');
}

function countDown() {
    let interval = setInterval(() => {
        if (timer.innerText > 0) {
            timer.innerText--; 

            if (timer.innerText <= 10) {
                mute();

                volumeOn.classList.add('no-events');
                volumeOff.classList.add('no-events');

                audioController.startTictacMusic();
            }

            if (allMatchedCards.length === allCards.length) {
                clearInterval(interval);

                playerScore.innerText = timer.innerText;
                
                if (+playerScore.innerText > +window.localStorage.getItem('best-score')) {
                    window.localStorage.setItem('best-score', playerScore.innerText);
                }
                
                audioController.stopGameMusic();

                audioController.stopTictacMusic();

                unMatchedAllCards();

                audioController.startVictoryMusic();

                victoryBox.classList.remove('hidden');
                victoryBox.classList.add('visible');

                setTimeout(() => {
                    victoryBox.classList.remove('visible');
                    victoryBox.classList.add('hidden');

                    levelsContainer.classList.remove('hidden');
                    levelsContainer.classList.add('visible');

                    reset();
                    allMatchedCards = [];
                }, 5000);
            }
        } else {
            
            if (allMatchedCards.length !== allCards.length) {

                clearInterval(interval);
                
                audioController.stopGameMusic();

                audioController.stopTictacMusic();

                unMatchedAllCards();

                audioController.startLossMusic();

                lossBox.classList.remove('hidden');
                lossBox.classList.add('visible');
                
                setTimeout(() => {
                    lossBox.classList.remove('visible');
                    lossBox.classList.add('hidden');

                    levelsContainer.classList.remove('hidden');
                    levelsContainer.classList.add('visible');

                    reset();
                    allMatchedCards = [];
                }, 5000);
            }
        }
    }, 1000);
}

function reset() {
    volumeOff.classList.remove('visible');
    volumeOn.classList.add('visible');

    volumeOff.classList.add('hidden');
    volumeOn.classList.remove('hidden');

    volumeOn.classList.remove('no-events');
    volumeOff.classList.remove('no-events');

    wrongTries.innerText = 0;
    timer.innerText = 0;
}

function flippingAllCards() {
    allCards.forEach(card => {
        card.classList.add('flipped');
    });
}

function unFlippingAllCards() {
    allCards.forEach(card => {
        card.classList.remove('flipped');
    });
}

function unMatchedAllCards() {
    allCards.forEach(card => {
        card.classList.remove('matched');
    });
}

function levelSettings() {
    if (levels[0].checked) {
        timer.innerText = 100;

        flippingAllCards();
        stopClicking();

        countDown();

        setTimeout(() => {
            unFlippingAllCards();
            backToClicking();
        }, 9000);
    }

    if (levels[1].checked) {
        timer.innerText = 80;

        flippingAllCards();
        stopClicking();

        countDown();

        setTimeout(() => {
            unFlippingAllCards();
            backToClicking();
        }, 7000);
    }

    if (levels[2].checked) {
        timer.innerText = 50;

        flippingAllCards();
        stopClicking();

        countDown();

        setTimeout(() => {
            unFlippingAllCards();
            backToClicking();
        }, 5000);
    }
}

function matchedCards(cardOne, cardTwo) {

    if (cardOne.getAttribute('data-tech') === cardTwo.getAttribute('data-tech')) {
        audioController.matchedMusic();

        cardOne.classList.remove('flipped');
        cardTwo.classList.remove('flipped');
        
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');
        
        allMatchedCards.push(cardOne, cardTwo);

        backToClicking();
    }
    else {
        wrongTries.innerText++;
        
        audioController.unMatchedMusic();
        
        setTimeout(() => {
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            backToClicking();
        }, 500);
    }

}

function filtering(card) {

    allCards.forEach(card => {
        if(card.classList.contains('flipped') && card.classList.contains('matched')) {
            card.classList.remove('flipped');
        }
    });

    audioController.flippedMusic();
    
    card.classList.add('flipped');

    let flippedCards = allCards.filter( flippedCard => { 
        return flippedCard.classList.contains('flipped')
    });

    if (flippedCards.length === 2) {
        stopClicking();
    
        matchedCards(flippedCards[0], flippedCards[1]);
    }
}

function shuffleCards(array) {
    let currentIndex = array.length, randomNumber, currentValue;

    while ( currentIndex > 0) {

        randomNumber = Math.floor(Math.random() * currentIndex);

        currentIndex--;

        currentValue = array[currentIndex];

        array[currentIndex] = array[randomNumber];

        array[randomNumber] = currentValue;
    }

    return array;

}

playerBestScore.innerText = window.localStorage.getItem('best-score')

function startTheGame() {
    stopClicking();

    
    playButton.addEventListener('click', () => {
        shuffleCards(orderRange);
        audioController.flippedMusic();
        if ((playerNameInput.value === '') || (!levels[0].checked & !levels[1].checked & !levels[2].checked)) {
            levelsContainer.classList.remove('visible');
            levelsContainer.classList.add('hidden');
            sweetAlert.classList.remove('hidden');
            sweetAlert.classList.add('visible');
            alertErrorMessage.innerHTML = `Player Name And Level Are Both Required`;
            confirmAlert();
            return false;
        }

        levelsContainer.classList.remove('visible');
        levelsContainer.classList.add('hidden');
        audioController.startGameMusic();

        playerName.forEach(name => {
            name.innerHTML = playerNameInput.value;
        });

        levelSettings();

        allCards.forEach((card, index) => {
            card.style.order = orderRange[index];

            card.addEventListener('click', () => {
                filtering(card);
            });
        });
    });
}

function mute() {
    volumeOn.classList.remove('visible');
    volumeOff.classList.add('visible');

    volumeOn.classList.add('hidden');
    volumeOff.classList.remove('hidden');

    audioController.stopGameMusic();
}

function unMute() {
    volumeOff.classList.remove('visible');
    volumeOn.classList.add('visible');

    volumeOff.classList.add('hidden');
    volumeOn.classList.remove('hidden');

    audioController.startGameMusic();
}