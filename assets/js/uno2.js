let cards = [];   //tüm kartlar
let player1 = []; //oyuncu1
let player2 = []; //oyuncu2 
let player3 = []; //oyuncu3 
let player4 = []; //oyuncu4 
let deck = [];    //kalan kartlar çekilecek deste
let table;        //masaya açılan kart

for (let i = 0; i <= 9; i++) {  //kartları oluşturup atadık
    cards.push({ color: 'green', number: i.toString() }); //i.toString() her renk için sayıları string olarak ekledik
    cards.push({ color: 'yellow', number: i.toString() });
    cards.push({ color: 'red', number: i.toString() });
    cards.push({ color: 'blue', number: i.toString() });
}

console.table(cards);  //console gösterimi oluşturulan kartlar

cards.sort(function () {  //karıştırma işlemi yaptık
    return Math.random() - 0.5
});

console.table(cards);  //console gösterimi karışık kartlar

for (let i = 0; i <= 6; i++) {  //kartları oyunculara atadık, shift() ile kartları destenin ilk elemanından alıp dağıtmaya başladık. 
    player1.push(cards.shift());
    player2.push(cards.shift());
    player3.push(cards.shift());
    player4.push(cards.shift());
}

table = cards.shift(); //masaya açılan ilk kart

deck = cards;

console.table(player1); //console gösterimi 1.oyuncu eli
console.table(player2); //console gösterimi 2.oyuncu eli
console.table(player3); //console gösterimi 3.oyuncu eli
console.table(player4); //console gösterimi 4.oyuncu eli
console.table(table);   //console gösterimi masadaki açık kart
console.table(deck);    //console gösterimi kalan deste

function createCardHtml(color, number, back = false) {  //kartlar için html oluşturma fonksiyonu
    return `<div class="card ${color} num-${number}"data-color="${color}" data-number="${number}"><span class="inner"><span class="mark">${number}</span></span></div>`;
}


//HTML ekleme işlemi başlangıcı
const player1Container = document.querySelector('.player1');
const player2Container = document.querySelector('.player2');
const tableContainer = document.querySelector('.table');
const player3Container = document.querySelector('.player3');
const player4Container = document.querySelector('.player4');
const deckContainer = document.querySelector('.deck');

//oyuncu kartları, masaya açılan kart ve kalan deste için html kart gösterimi
for (let card of player1) {
    player1Container.innerHTML += createCardHtml(card.color, card.number);
}
for (let card of player2) {
    player2Container.innerHTML += createCardHtml(card.color, card.number);
}
for (let card of player3) {
    player3Container.innerHTML += createCardHtml(card.color, card.number);
}
for (let card of player4) {
    player4Container.innerHTML += createCardHtml(card.color, card.number);
}
for (let card of deck) {
    deckContainer.innerHTML += createCardHtml(card.color, card.number);
}
tableContainer.innerHTML += createCardHtml(table.color, table.number);


let cardElements = document.querySelectorAll('.card'); //createCardHtml içinde oluşturduğumuz card sınıfını aldık

for (let cardElement of cardElements) { //her card elemanına playCard fonksiyonu için click ekledik
    cardElement.addEventListener('click', playCard);
}

function isCardPlayable(cardColor, cardNumber) {  //oynanabilir card durumu, color veya number eşleşme durumu 
    if (table.color === cardColor || table.number === cardNumber) {
        return true;
    }
    return false; //eşleşen yok
}

// function changeTurn() {   
//     if (turn === 1) {
//         turn = 2;
//     } 
//     if (turn === 2) {
//         turn = 3;
//     } 
//     if (turn === 3) {
//         turn = 4;
//     } 
//     else {
//         turn = 1;
//     }
//     isDeckUsed = false; 
// }

function changeTurn() {  //sırayla oyuncu değiştirme 
    if (turn === 4) {
        turn = 1;
    } else {
        turn++;
    }
    isDeckUsed = false;  //Deste kullanılmadı, mevcut oyuncu oynayabilir deste onun için kullanımda. 
}


function canCurrentUserPLay() { //mevcut sıradaki oynayabilir oyuncu
    let currentPlayerCards;  //mevcut sıradaki oyuncunın eli

    if (turn === 1) {        //sıradaki oyuncu player1
        currentPlayerCards = document.querySelectorAll('.player1 .card');
    }
    if (turn === 2) {        //sıradaki oyuncu player2
        currentPlayerCards = document.querySelectorAll('.player2 .card');
    }
    if (turn === 3) {        //sıradaki oyuncu player3
        currentPlayerCards = document.querySelectorAll('.player3 .card');
    } else {                 //sıradaki oyuncu player4
        currentPlayerCards = document.querySelectorAll('.player4 .card');
    }

    for (let card of currentPlayerCards) {  //oyuncunun elindeki her card incelenir

        if (isCardPlayable(card.dataset.color, card.dataset.number)) {
            return true;  //oynanabilir card varsa (oyuncu oynamaya devam eder şimdilik burda geçme yok -süre eklenerek veya geç/pas butonu eklenerek geçiş işlemi sağlanabilir)
        }
        return false;  //oynanabilir card yoksa
    }

}
function drawCard() {
    // Kart çekimi işlemleri burada gerçekleştirilir.

    // if (turn === 1) {
    //     player1Container.appendChild(deck[deck.length - 1]); //tek seferlik kart çekimi yapıldı.
    // }
    // if (turn === 2) {
    //     player2Container.appendChild(deck[deck.length - 1]);
    // }
    // if (turn === 3) {
    //     player3Container.appendChild(deck[deck.length - 1]);
    // } else {
    //     player4Container.appendChild(deck[deck.length - 1]);
    // }

    const currentPlayerContainer = document.querySelector(`.player${turn}`);
    currentPlayerContainer.appendChild(deck[deck.length - 1]); // En üst kartı çek, tek seferlik kart çekimi yapıldı.

    // Eldeki kartları güncelle
    const drawnCard = deck.pop();
    let playerCards = currentPlayerCards;
    playerCards.push(drawnCard);


    // Kart çekildiğinde destenin kullanıldığını işaretle
    isDeckUsed = true; //kart çekimi yapmış olan oyuncu bu tur için tekrar kart çekemez. Mevcut oyuncu için deste kullanım dışı.

    // Kart çekimi sonrası sırayı değiştir
    changeTurn();

    // Oynanabilir kart varsa oyuncuya oynatma şansı ver
    if (canCurrentUserPlay()) {
        return;
        // Oyuncuya kart oynatma işlemleri burada yapılabilir.
    }

}

let turn = 1; //ilk sıra birinci oyuncuda
let isDeckUsed = false; //Deste kullanılmadı, deste kullanımda ile başlar
// let currentPlayerCards = document.querySelectorAll('.player1 .card');

function playCard() {
    //tıklanan card nerede?
    //parentNode tıklanan kartın parentı classList classı contains var mı?
    if (this.parentNode.classList.contains('table')) {
        return;
    }   //masadaki açık card için click işlemi geçersizleştirildi.

    if (this.parentNode.classList.contains('deck')) {
        if (isDeckUsed === true) { //çekilecek deste yok ise oyun sonlandı
            return;
        }                          //çekilecek deste var ise oyuncu mevcut sırasına göre tek seferlik kart çekimi yapabilir.
        
        drawCard();

        // Kart atma işlemi
        if (this.parentNode.classList.contains(`player${turn}`)) {
            // Oyuncunun elindeki kartları güncelle
            const cardIndex = Array.from(currentPlayerCards).indexOf(this);
            if (cardIndex !== -1) {
                const playedCard = playerCards.splice(cardIndex, 1)[0];

                // Masadaki açık kartı güncelle
                tableContainer.innerHTML = createCardHtml(playedCard.color, playedCard.number);

                // Kart çekimi sonrası sırayı değiştir
                changeTurn();
            }
        }


    }
    if (!isCardPlayable(this.dataset.color, this.dataset.number)) { //oynanabilir card durumu yok ise click işlemi geçersizleştirildi. Varsa zaten oynamadan geçemez durumda şu an.
        return;
    }

    //sıra kimdeyse diğer oyuncu kartlarının click işlemi geçersizleştirildi.
    for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
        if (turn !== playerNumber && this.parentNode.classList.contains(`player${playerNumber}`)) {
            return;
        }
    }
    // if (turn === 1 && (this.parentNode.classList.contains('player2') || this.parentNode.classList.contains('player3') || this.parentNode.classList.contains('player4'))) {
    //     return;
    // }
    // if (turn === 2 && (this.parentNode.classList.contains('player1') || this.parentNode.classList.contains('player3') || this.parentNode.classList.contains('player4'))) {
    //     return;
    // }
    // if (turn === 3 && (this.parentNode.classList.contains('player1') || this.parentNode.classList.contains('player2') || this.parentNode.classList.contains('player4'))) {
    //     return;
    // }
    // if (turn === 4 && (this.parentNode.classList.contains('player1') || this.parentNode.classList.contains('player2') || this.parentNode.classList.contains('player3'))) {
    //     return;
    // }


    //tek oyuncu elindeki kart bitince oyun bitmiyor oyun bitimi için şu anki oynayabilen oyuncunun elini kontrol et elinde kart varsa sıra değişikliği yaparak devam et

    changeTurn(); //sıra değişikliği
    tableContainer.appendChild(this);  //yeni atılan kart masadaki açık kart üstünde gözükür. table değişkeni güncellenir
    table.color = this.dataset.color;    //yeni table değişkeni color 
    table.number = this.dataset.number;  //yeni table değişkeni number 
}


//tek oyuncu elindeki kart bitince oyun bitmiyor