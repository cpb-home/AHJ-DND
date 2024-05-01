export default class Column {
  constructor (title) {
    this.title = title;
    this.root = document.getElementById('root');
    this.cards = ['dssc','scd'];
    this.latestId = 0;
  }

  render() {
    const col = this.createCol();
    const header = this.createHeader();
    const cardList = this.createCardList();
    const footer = this.createFooter();

    col.append(header);
    col.append(cardList);
    col.append(footer);

    this.root.append(col);
  }

  createCol() {
    const col = document.createElement('div');
    col.classList.add('column');
    return col;
  }

  createHeader() {
    const header = document.createElement('header');
    header.classList.add('column__header');
    header.textContent = this.title;
    return header;
  }

  createCardList() {
    const cardList = document.createElement('div');
    cardList.classList.add('cardList');
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.createCard(i);

      cardList.append(card);
    }
    return cardList;
  }

  createCard(id) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = this.cards[id];
    card.dataset.id = id;

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('card-closeBtn');
    closeBtn.addEventListener('click', e => {
      if (confirm('Are you sure to delete this note?')) {
        this.deleteCard(e);
      }
    })
    card.append(closeBtn);
    return card;
  }

  createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('column__footer');
    footer.textContent = '+ Add another card';
    footer.addEventListener('click', e => {
      this.openAddingCart(e);
    })
    return footer;
  }

  openAddingCart(e) {
    
  }

  addCard(text) {
    this.cards.push(text);
// get the click
    const cardList = e.target.closest('.cardList');
    cardList.textContent = '';

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.createCard(i);

      cardList.append(card);
    }
  }

  deleteCard(e) {
    const card = e.target.closest('.card');
    const id = card.dataset.id;
    this.removeCardFromArr(id);

    const cardList = e.target.closest('.cardList');
    cardList.textContent = '';

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.createCard(i);

      cardList.append(card);
    }

  }

  removeCardFromArr(id) {
    this.cards.splice(id, 1);
  }
}