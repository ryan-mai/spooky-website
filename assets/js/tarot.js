class TarotManager {
    constructor() {
        this.card = document.getElementById('tarot-mystery');

        this.init();

    }

    init() {
        this.card.addEventListener('click', () => {
            this.randomCard();
        })
    }

    async randomCard() {
        const base = '../../assets/img/tarot/';
        const cards = ['ace_of_pumpkins', 'fool', 'four_of_bats', 'magician', 'three_of_imps', 'two_of_ghost', 'draw_card']

        const idx = Math.floor(Math.random() * cards.length);
        console.log(idx, cards[idx])
        const src = `${base}${cards[idx]}.webp`;        
        
        const chosen = document.getElementById('tarot-mystery-card');
        chosen.src = src;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TarotManager();
});