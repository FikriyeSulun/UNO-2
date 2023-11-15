let cards = [];   //tüm kartlar
let player1 = []; //oyuncu1
let player2 = []; //oyuncu2 
let player3 = []; //oyuncu3 
let player4 = []; //oyuncu4 
let deck = [];    //kalan kartlar çekilecek deste
let table;        //masaya açılan kart

for (let i = 0; i <= 9; i++) {  //kartları oluşturup atadık
    //i.toString() her renk için sayıları string olarak ekledik
    cards.push({ color: 'green', number: i.toString() }); 
    cards.push({ color: 'yellow', number: i.toString() });
    cards.push({ color: 'red', number: i.toString() });
    cards.push({ color: 'blue', number: i.toString() });
}

shuffleCards(cards);

function shuffleCards(array) {
    array.sort(function () {  //karıştırma işlemi yaptık
        return Math.random() - 0.5;
    });
}

// Kartları oyunculara dağıtalım
for (let i = 0; i <= 6; i++) {  
    //kartları oyunculara atadık, shift() ile kartları destenin ilk elemanından alıp dağıtmaya başladık. 
    player1.push(cards.shift());
    player2.push(cards.shift());
    player3.push(cards.shift());
    player4.push(cards.shift());
}

table = cards.shift(); //masaya açılan ilk kart
deck = cards;

//kartlar için html oluşturma fonksiyonu
function createCardHtml(color, number, back = false) {  
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
for (let card of deck) {
    deckContainer.innerHTML += createCardHtml(card.color, card.number);
}

tableContainer.innerHTML += createCardHtml(table.color, table.number);


// Kart click işlemleri
//createCardHtml içinde oluşturduğumuz card sınıfını aldık
//her card elemanına playCard fonksiyonu için click ekledik
document.querySelectorAll('.card').forEach(cardElement => {
    cardElement.addEventListener('click', playCard);
});


function isCardPlayable(cardColor, cardNumber) {  //oynanabilir card durumu, color veya number eşleşme durumu 
    if (table.color === cardColor || table.number === cardNumber) {
        return true;
    }
    return false; //eşleşen yok
}

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

        players[turn - 1].push(deck.shift());// Kart çeken oyuncunun eline ekledik
        const currentPlayerContainer = document.querySelector(`.player${turn}`);
        currentPlayerContainer.appendChild(this); //tek seferlik kart çekimi yapıldı.
        console.log(currentPlayerContainer);

        isDeckUsed = true;  //Deste kullanıldı, kart çekimi yapmış olan oyuncu bu tur için tekrar kart çekemez. Mevcut oyuncu için deste kullanım dışı.

        if (!canCurrentUserPLay()) {  //mevcut sıradaki oyuncu oynayamaz durumda ise
            changeTurn();  //sıra değişikliği
        }
        return;
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

    // Mevcut oyuncunun elindeki kartı kaldırın
    const currentPlayerCards = players[turn - 1];
    for (let i = 0; i < currentPlayerCards.length; i++) {
        if (currentPlayerCards[i].color === this.dataset.color && currentPlayerCards[i].number === this.dataset.number) {
            currentPlayerCards.splice(i, 1);
            break;
        }
    }

    //tek oyuncu elindeki kart bitince oyun bitmiyor oyun bitimi için şu anki oynayabilen oyuncunun elini kontrol et elinde kart varsa sıra değişikliği yaparak devam et

    changeTurn(); //sıra değişikliği
    tableContainer.appendChild(this);  //yeni atılan kart masadaki açık kart üstünde gözükür. table değişkeni güncellenir
    table.color = this.dataset.color;    //yeni table değişkeni color 
    table.number = this.dataset.number;  //yeni table değişkeni number 
}


//tek oyuncu elindeki kart bitince oyun bitmiyor
