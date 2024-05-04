export default class Column {
  constructor (title) {
    this.title = title;
    this.root = document.getElementById('root');
    this.cards = [];
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
    if (localStorage.cards) {
      const fromLS = this.readFromLS();
      if (fromLS) {
        this.cards = [];
        fromLS.forEach(e => {
          this.cards.push(e);
        })
      }
    }

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.createCard(i);

      cardList.append(card);
      this.cardDragger(card);
    }
    return cardList;
  }

  createCard(id) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = id;
    card.draggable = true;

    const cardCont = document.createElement('div');
    cardCont.classList.add('cardCont');
    cardCont.textContent = this.cards[id];

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('card-closeBtn');
    closeBtn.addEventListener('click', e => {
      if (confirm('Are you sure to delete this note?')) {
        this.deleteCard(e);
      }
    })
    card.append(cardCont);
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

  addCard(text, e) {
    this.cards.push(text);
    this.saveToLS();
    const col = e.target.closest('.column');
    const cardList = col.querySelector('.cardList');
    cardList.textContent = '';

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.createCard(i);

      cardList.append(card);
    }

    this.restoreFooter(e);
  }

  deleteCard(e) {
    const card = e.target.closest('.card');
    const id = card.dataset.id;
    this.removeCardFromArr(id);
    this.saveToLS();

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
      const parent = e.target.closest('.column__footer');
      const area = parent.querySelector('.footerArea');
      if (area.value !== '') {
        this.addCard(area.value, e);
      }
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

  saveToLS() {
    if (localStorage.cards) {
      const fromLS = JSON.parse(localStorage.getItem('cards'));
      const found = fromLS.find(e => e.title === this.title);
      if (found) {
        found.content = this.cards;
      } else {
        fromLS.push({title: this.title, content: this.cards});
      }
      localStorage.setItem('cards', JSON.stringify(fromLS));
    } else {
      localStorage.setItem('cards', JSON.stringify([{title: this.title, content: this.cards}]));
    }
  }

  readFromLS() {
    if (localStorage.cards) {
      const fromLS = JSON.parse(localStorage.getItem('cards'));
      const fromLSFound = fromLS.find(e => e.title === this.title);
      return fromLSFound ? fromLSFound.content : null;
    } 
  }


  cardDragger(card) {
    let dragged = null;
    const source = card.closest(".cardList");
    source.addEventListener("dragstart", e => {
      dragged = e.target; 
    });

    const targets = document.querySelectorAll(".cardList");
    const target = card.closest(".cardList");
    target.addEventListener("dragover", (e) => e.preventDefault());
    target.addEventListener("drop", (e) => {
        //dragged.parentNode.removeChild(dragged);
        console.log(e.currentTarget)
        //target.append(dragged);
        /*let cardOn = null;
        if (e.target.classList.includes('cardCont')) {
          cardOn = e.target.closest('.card');
        } else if (e.target.classList.includes('card')) {
          cardOn = e.target;
        }
        target.insertBefore(dragged, cardOn)*/
        
    });
    // targets.forEach(target => {console.log(dragged)
    //   target.addEventListener("dragover", (e) => e.preventDefault());
    //   target.addEventListener("drop", (e) => {
    //     //dragged.parentNode.removeChild(dragged);
    //     target.insertBefore(e.target, dragged);
    //     //e.target.appendChild(dragged);
    //   });
    // })
  }
}

/*
надо сделать перетаскивание элементов
*/

/*cardDragger(card) {
    let dragged = null;
    const sources = document.querySelectorAll(".cardList");
    sources.forEach(source => {
      source.addEventListener("dragstart", (e) => dragged = e.target);
    })
    const targets = document.querySelectorAll(".cardList");
    targets.forEach(target => {
      target.addEventListener("dragover", (e) => e.preventDefault());
      target.addEventListener("drop", (e) => {
        dragged.parentNode.removeChild(dragged);
        if (e.target.classList.contains('card')) {
          target.insertBefore(dragged, e.target);
        } else {

        }
        //e.target.appendChild(dragged);
      });
    })
*/