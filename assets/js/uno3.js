// Kart renkleri ve numaraları
const colors = ['green', 'yellow', 'red', 'blue'];
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

// Tüm kartları oluşturun
const cards = colors.flatMap(color => numbers.map(number => ({ color, number })));

// Kartları karıştırın
cards.sort(() => Math.random() - 0.5);

// Oyuncu eli için kartları dağıtın
const players = [player1, player2, player3, player4];
for (let i = 0; i < 8; i++) {
    players.forEach(player => player.push(cards.pop()));
}

// Masaya ilk kartı açın
const table = cards.pop();

// Desteyi oluşturun
const deck = cards;

// Kartları HTML'e dökün
const containers = [player1Container, player2Container, player3Container, player4Container, deckContainer, tableContainer];
containers.forEach(container => {
    container.innerHTML = players.flat().concat(deck, [table]).map(card => createCardHtml(card.color, card.number)).join('');
});

// Oyuncu sırasını ve desteyi kullanıp kullanmadığınızı izleyin
let turn = 1;
let isDeckUsed = false;

// Kartı oynanabilir mi kontrol edin
function isCardPlayable(cardColor, cardNumber) {
    return table.color === cardColor || table.number === cardNumber;
}

// Sırayı değiştirin
function changeTurn() {
    turn = turn % 4 + 1;
    isDeckUsed = false;
}

// Mevcut oyuncu oynayabilir mi kontrol edin
function canCurrentUserPlay() {
    const currentPlayerCards = document.querySelectorAll(`.player${turn} .card`);
    return Array.from(currentPlayerCards).some(card => isCardPlayable(card.dataset.color, card.dataset.number));
}

// Kart oynama işlemini daha basit bir şekilde ele alın
function playCard() {
    if (this.parentNode.classList.contains('table')) {
        return;
    }

    if (this.parentNode.classList.contains('deck')) {
        if (isDeckUsed === true) {
            return;
        }
        const currentPlayerContainer = document.querySelector(`.player${turn}`);
        currentPlayerContainer.appendChild(this);
        isDeckUsed = true;
        if (!canCurrentUserPlay()) {
            changeTurn();
        }
        return;
    }

    if (!isCardPlayable(this.dataset.color, this.dataset.number)) {
        return;
    }

    if (Array.from(this.classList).some(className => className.includes(`player${turn}`))) {
        changeTurn();
    }

    tableContainer.appendChild(this);
    table.color = this.dataset.color;
    table.number = this.dataset.number;
}
