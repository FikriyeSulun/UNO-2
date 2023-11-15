let cards = [];
let player1 = [];
let player2 = [];
let player3 = [];
let player4 = [];
let deck = [];
let table;

// Kartları oluşturup karıştıralım
for (let i = 0; i <= 9; i++) {
    cards.push({ color: 'green', number: i.toString() });
    cards.push({ color: 'yellow', number: i.toString() });
    cards.push({ color: 'red', number: i.toString() });
    cards.push({ color: 'blue', number: i.toString() });
}

shuffleCards(cards);

function shuffleCards(array) {
    array.sort(function () {
        return Math.random() - 0.5;
    });
}

// Kartları oyunculara dağıtalım
for (let i = 0; i <= 6; i++) {
    player1.push(cards.shift());
    player2.push(cards.shift());
    player3.push(cards.shift());
    player4.push(cards.shift());
}

table = cards.shift();
deck = cards;

// HTML elementlerini seçelim
const player1Container = document.querySelector('.player1');
const player2Container = document.querySelector('.player2');
const player3Container = document.querySelector('.player3');
const player4Container = document.querySelector('.player4');
const tableContainer = document.querySelector('.table');
const deckContainer = document.querySelector('.deck');

// Kartları HTML'e ekleme
displayPlayerCards(player1, player1Container);
displayPlayerCards(player2, player2Container);
displayPlayerCards(player3, player3Container);
displayPlayerCards(player4, player4Container);

function displayPlayerCards(playerCards, container) {
    container.innerHTML = '';

    for (let card of playerCards) {
        container.innerHTML += createCardHtml(card.color, card.number);
    }
}

tableContainer.innerHTML += createCardHtml(table.color, table.number);

function createCardHtml(color, number, back = false) {
    return `<div class="card ${color} num-${number}" data-color="${color}" data-number="${number}"><span class="inner"><span class="mark">${number}</span></span></div>`;
}

// Kart click işlemleri
document.querySelectorAll('.card').forEach(cardElement => {
    cardElement.addEventListener('click', playCard);
});

function playCard() {
    // Kart masadaysa işlem yapma
    if (this.parentNode === tableContainer) {
        return;
    }

    // Kart çekme
    if (this.parentNode === deckContainer) {
        if (isDeckUsed === true) {
            return;
        }

        const currentPlayer = getCurrentPlayer();
        currentPlayer.push(deck.shift());

        isDeckUsed = true;

        // Eldekileri güncelle
        displayPlayerCards(currentPlayer, getPlayerContainer(currentPlayer));
        
        // Sırayı değiştir
        changeTurn();
        return;
    }

    // Oynanabilirlik kontrolü
    const color = this.dataset.color;
    const number = this.dataset.number;

    if (!isCardPlayable(color, number)) {
        return;
    }

    // Sırayı değiştir
    changeTurn();

    // Kartı masaya oyna
    tableContainer.appendChild(this);
    table.color = color;
    table.number = number;

    // Eldekileri güncelle
    const currentPlayer = getCurrentPlayer();
    currentPlayer.splice(getCardIndex(currentPlayer, color, number), 1);
    displayPlayerCards(currentPlayer, getPlayerContainer(currentPlayer));
}

function isCardPlayable(cardColor, cardNumber) {
    if (table.color === cardColor || table.number === cardNumber) {
        return true;
    }
    return false;
}

function getCurrentPlayer() {
    // Şu anki oyuncu kim?
    if (turn === 1) {
        return player1;
    } else if (turn === 2) {
        return player2;
    } else if (turn === 3) {
        return player3;
    } else {
        return player4;
    }
}

function getPlayerContainer(player) {
    // Şu anki oyuncunun kartlarını hangi konteynere eklemeliyiz?
    if (player === player1) {
        return player1Container;
    } else if (player === player2) {
        return player2Container;
    } else if (player === player3) {
        return player3Container;
    } else {
        return player4Container;
    }
}

function getCardIndex(player, color, number) {
    // Oyuncunun elindeki belirli bir kartın dizinini bul
    for (let i = 0; i < player.length; i++) {
        if (player[i].color === color && player[i].number === number) {
            return i;
        }
    }
    return -1; // Kart bulunamadı
}

function changeTurn() {
    turn = (turn % 4) + 1;  // Sırayı dönüştür: 1->2->3->4->1
    isDeckUsed = false;
}

let turn = 1; // İlk sıra oyuncu 1'de
let isDeckUsed = false;
