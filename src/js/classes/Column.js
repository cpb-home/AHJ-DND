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
    const footerCont = this.createFooterCont(footer);
    
    footer.append(footerCont);
    return footer;
  }

  createFooterCont(footer) {
    const footerCont = document.createElement('div');
    footerCont.classList.add('footerCont');
    footerCont.textContent = '+ Add another card';
    footerCont.addEventListener('click', () => this.openAddingCart(footer));
    return footerCont;
  }

  openAddingCart(footer) {
    footer.textContent = '';
    const footerCont = document.createElement('div');
    footerCont.classList.add('footerAdd');
    footer.style.padding = '10px 0 0';
    
    const area = document.createElement('textarea');
    area.classList.add('footerArea');
    footerCont.append(area);

    const buttonsBlock = document.createElement('div');
    buttonsBlock.classList.add('buttonsBlock');

    const buttonAdd = this.addButtonAdd();
    buttonsBlock.append(buttonAdd);

    const buttonCancell = this.addButtonCancell();
    buttonsBlock.append(buttonCancell); 

    footer.append(footerCont);
    footer.append(buttonsBlock);
  }

  addCard(text, e) { // put to array, rerender
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

  addButtonAdd() {
    const buttonAdd = document.createElement('button');
    buttonAdd.className = 'buttonAdd button';
    buttonAdd.type = 'button';
    buttonAdd.textContent = 'Add card';
    buttonAdd.addEventListener('click', e => {
      const parent = e.target.closest('.footerAdd');
      const area = parent.querySelector('.footerArea');
      this.addCard(area.value, e);
    })
    return buttonAdd;
  }

  addButtonCancell() {
    const buttonCancell = document.createElement('button');
    buttonCancell.className = 'buttonCancell button';
    buttonCancell.type = 'button';
    buttonCancell.textContent = 'Cancell';
    buttonCancell.addEventListener('click', e => this.restoreFooter(e))
    return buttonCancell;
  }

  restoreFooter(e) {
    const footer = e.target.closest('.column__footer');
    footer.textContent = '';
    footer.style.padding = '10px 10px 0';
    const footerCont = this.createFooterCont(footer);
    footer.append(footerCont);
  }
}