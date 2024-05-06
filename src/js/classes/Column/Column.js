import Button from "../../ui/Button/Button";
import Card from "../Card/Card";

export default class Column {
  constructor (title) {
    this.title = title;
    this.root = document.getElementById('root');
    this.cards = [];
    this.latestId = 0;
    this.flagDeleted = false;
    this.flagAdded = false;
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
    cardList.dataset.title = this.title;
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
    }
    if (this.cards.length === 0) {
      cardList.classList.add('bordered');
      cardList.textContent = "Карточку можно перетащить сюда."
    } else {
      cardList.classList.remove('bordered');
    }

    return cardList;
  }

  createCard(id) {
    const card = Card(id, this.cards[id]);

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

    const buttonAdd = Button('green');
    buttonAdd.addEventListener('click', e => {
      const parent = e.target.closest('.column__footer');
      const area = parent.querySelector('.footerArea');
      if (area.value !== '') {
        this.addCard(area.value, e);
      }
    })
    buttonsBlock.append(buttonAdd);

    const buttonCancell = Button('red');
    buttonCancell.addEventListener('click', e => this.restoreFooter(e));
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

    cardList.classList.remove('bordered');
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
    if (this.cards.length === 0) {
      cardList.classList.add('bordered');
      cardList.textContent = "Карточку можно перетащить сюда."
    } else {
      cardList.classList.remove('bordered');
    }
  }

  removeCardFromArr(id) {
    this.cards.splice(id, 1);
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
/*
  cardDragger() {
    let dragged = undefined;
    let startedList, finishedList;
    const isUpperThenCenter = e => {
      const currentElementCoord = e.target.getBoundingClientRect();
      const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

      if (e.clientY < currentElementCenter) {
        return true;
      } 
      return false;
    };
    const delPhantom = () => {
      if (document.querySelector('.phantom')) {
        document.querySelector('.phantom').remove();
      }
    }

    const source = document.querySelector('#root');
    const dragStart = e => {
      dragged = e.target;
      startedList = e.target.closest('.cardList');
      this.flagDeleted = false;
      this.flagAdded = false;
    }
    source.addEventListener("dragstart", e => dragStart(e));

    const target = document.querySelector('#root');
    const dragOver = e => {
      e.preventDefault();

      const height = dragged.offsetHeight;
      const width = dragged.offsetWidth;
      const phantom = document.createElement('div');
      phantom.classList.add('phantom');
      phantom.style.height = height + 'px';
      phantom.style.width = width + 'px';
      
      //phantoms
      let current;
      if (!(e.target.classList.contains('card') || e.target.classList.contains('cardList' || e.target.classList.contains('phantom')))) {
        return;
      } 

      if (!document.querySelector('.phantom')) {                // если фантома нет 
        current = e.target;
        if (e.target.classList.contains('card')) {                // если мы над карточкой
          if (isUpperThenCenter(e)) {
            e.target.before(phantom);
          } else {
            e.target.after(phantom);
          }
        } else {                                                  // если мы над списком
          const list = e.target;
          const cards = list.querySelectorAll('.card');

          if (cards.length > 0) {                                 // если в списке есть карточки
            for (let i = 0; i < cards.length; i++) {
              if (cards[i+1]) {                                     // если есть следующая карточка
                if (cards[i].getBoundingClientRect().y < e.clientY && cards[i+1].getBoundingClientRect().y > e.clientY) {
                  cards[i].after(phantom);                            // ставим фантом между ними
                  break;
                } else {                                            // если следующей карточки нет (мы на последней)
                  if (cards[i].getBoundingClientRect().y < e.clientY) {     // если y текущей меньше, ставим после неё
                    cards[i].after(phantom);
                    break;
                  }
                  else {
                    cards[i].before(phantom);                       // если y текущей больше, ставим до неё
                    break;
                  }
                }
              }
            }
          } else {                                                // если карточек нет
            e.target.textContent = '';
            delPhantom();
            e.target.append(phantom);                               // вставляем фантом
            e.target.classList.remove('bordered');
          }
        }
      } else {
        if (current === e.target || current === dragged || current === phantom) {
          return;
        }
        delPhantom();
        if (e.target.classList.contains('card')) {                // если мы над карточкой
          if (isUpperThenCenter(e)) {
            e.target.before(phantom);
          } else {
            e.target.after(phantom);
          }
        } else {                                                  // если мы над списком
          const list = e.target;
          const cards = list.querySelectorAll('.card');

          if (cards.length > 0) {                                 // если в списке есть карточки
            for (let i = 0; i < cards.length; i++) {
              if (cards[i+1]) {                                     // если есть следующая карточка
                if (cards[i].getBoundingClientRect().y < e.clientY && cards[i+1].getBoundingClientRect().y > e.clientY) {

                  cards[i].after(phantom);                          // ставим фантом между ними
                  break;
                } 
              } else {                                            // если следующей карточки нет (мы на последней)
                if (cards[i].getBoundingClientRect().y < e.clientY) {     // если y текущей меньше, ставим после неё
                  cards[i].after(phantom);
                  break;
                }
                else {
                  cards[i].before(phantom);                       // если y текущей больше, ставим до неё
                  break;
                }
              }
            }
          } else {                                                // если карточек нет
            e.target.textContent = '';
            e.target.append(phantom);                               // вставляем фантом
            e.target.classList.remove('bordered');
          }
        }
      }
    }
    target.addEventListener("dragover", e => dragOver(e));

    const drop = e => {
      if (!(e.target.classList.contains('card') || e.target.classList.contains('cardList') || e.target.classList.contains('phantom'))) {
        return;
      }

      if (e.target.classList.contains('card')) {
        if (isUpperThenCenter(e)) {
          e.target.before(dragged);
        } else {
          e.target.after(dragged);
        }
      } else if (e.target.classList.contains('cardList')) {
        const list = e.target;
        const cards = list.querySelectorAll('.card');

        if (cards.length > 0) {                                 //если карточек больше 0
          for (let i = 0; i < cards.length; i++) {
            if (cards[i+1]) {                                   // если существует следующая карточка
              if (cards[i].getBoundingClientRect().y < e.clientY && cards[i+1].getBoundingClientRect().y > e.clientY) { // если y текущей меньше, а следующей больше, ставим между ними
                cards[i].after(dragged);
                break;
              }
            } else {                                            // если следующей карточки нет (мы на последней)
              if (cards[i].getBoundingClientRect().y < e.clientY) {     // если y текущей меньше, ставим после неё
                cards[i].after(dragged);
                break;
              }
              else {
                cards[i].before(dragged);                       // если y текущей больше, ставим до неё
                break;
              }
            }
          }
        } else {                                                // если карточек нет
          e.target.textContent = '';
          e.target.append(dragged);
          e.target.classList.remove('bordered');
        }
      } else {
        e.target.before(dragged);
        delPhantom();
      }
    }
    target.addEventListener("drop", e => drop(e));

    const dragEnd = () => {
      delPhantom();
      finishedList = dragged.closest('.cardList');
      console.log(startedList);
      //this.restoreAfterDragged(startedList, finishedList, dragged);
    }
    target.addEventListener("dragend", () => dragEnd());
  }*/

  restoreAfterDragged(startedList, finishedList, dragged) {
    //console.log(startedList, finishedList, dragged)
    if (!finishedList || !startedList) {
      return;
    }
    
    if (this.title === finishedList.dataset.title && !this.flagAdded) {
      const currentCard = finishedList.querySelectorAll('.card');
      if (currentCard.length > 0) {
        for (let i = 0; i < currentCard.length; i++) {
          if (currentCard[i].textContent !== this.cards[i]) {
            this.cards.splice(i, 0, dragged.textContent);
            
            finishedList.textContent = '';

            for (let i = 0; i < this.cards.length; i++) {
              const card = this.createCard(i);

              finishedList.append(card);
            }
            this.cardDragger();
            break;
          }
        }
      }
      //console.log(this.cards)

      this.flagAdded = true;
    }



    if (this.title === startedList.dataset.title && !this.flagDeleted) {
      this.cards.splice(dragged.dataset.id, 1);

      startedList.textContent = '';

      for (let i = 0; i < this.cards.length; i++) {
        const card = this.createCard(i);

        startedList.append(card);
      }
      this.cardDragger();

      this.flagDeleted = true;
      console.log(this.cards);
    }
  }
}




/*
работает на одной колонке
cardDragger(card) {
    let dragged = null;

    const isUpperThenCenter = (e) => {
      const currentElementCoord = e.target.getBoundingClientRect();
      const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

      if (e.clientY < currentElementCenter) {
        return true;
      } 
      return false;
    };

    const source = card.closest(".cardList");
    source.addEventListener("dragstart", e => {
      dragged = e.target;
    });

    const target = card.closest(".cardList");
    target.addEventListener("dragover", (e) => {
      e.preventDefault();
    })

    target.addEventListener("drop", (e) => {

      if (e.target.dataset.id) {
        if (isUpperThenCenter(e)) {
          e.target.before(dragged);
        } else {
          e.target.after(dragged);
        }
      } else {
        const list = e.target;
        const cards = list.querySelectorAll('[data-id]');
        if (cards) {
          for (let i = 0; i < cards.length; i++) {
            if (cards[i].getBoundingClientRect().y < e.clientY && cards[i+1].getBoundingClientRect().y > e.clientY) {
              cards[i].after(dragged);
              break;
            }
          }
        }
      }
    });
  }
*/