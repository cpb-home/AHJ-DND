import Column from "./classes/Column/Column";

const todo = new Column('todo');
const progress = new Column('in progress');
const done = new Column('done');

todo.render();
progress.render();
done.render();

function cardDragger() {
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
    resortAfterDragged(startedList, finishedList, dragged);
  }
  target.addEventListener("dragend", () => dragEnd());
}

function resortAfterDragged(startedList, finishedList, dragged) {
  if (!finishedList || !startedList) {
    return;
  }

  if (startedList !== finishedList) {
    updateFinishedList(finishedList, dragged);
    updateStartedList(startedList, dragged);
  } else {
    updatedItselfList(startedList, dragged);
  }
}

function getCardsList(changedList) {
  if (changedList.dataset.title === 'todo') {
    return todo;
  } else if (changedList.dataset.title === 'in progress') {
    return progress;
  } else if (changedList.dataset.title === 'done') {
    return done;
  }
  return null;
}

function updateFinishedList(finishedList, dragged) {
  const finishCards = finishedList.querySelectorAll('.card');
  const finishSrcObj = getCardsList(finishedList);
  
  for (let i = 0; i < finishCards.length; i++) {
    if (finishCards[i].textContent !== finishSrcObj.cards[i]) {
      finishSrcObj.cards.splice(i, 0, dragged.textContent);
      
      finishedList.textContent = '';

      for (let i = 0; i < finishSrcObj.cards.length; i++) {
        const card = finishSrcObj.createCard(i);

        finishedList.append(card);
      }
      break;
    }
  }

  finishSrcObj.saveToLS();
}

function updateStartedList (startedList, dragged) {
  const startSrcObj = getCardsList(startedList);

  startSrcObj.cards.splice(dragged.dataset.id, 1);
  startedList.textContent = '';

  for (let i = 0; i < startSrcObj.cards.length; i++) {
    const card = startSrcObj.createCard(i);
    startedList.append(card);
  }

  if (startSrcObj.cards.length === 0) {
    startedList.classList.add('bordered');
    startedList.textContent = "Карточку можно перетащить сюда."
  } else {
    startedList.classList.remove('bordered');
  }

  startSrcObj.saveToLS();
}

function updatedItselfList(list, dragged) {
  const obj = getCardsList(list);

  const listCards = list.querySelectorAll('.card');
  let position = '';
  
  listCards.forEach((card, ind) => {
    if (card.dataset.id === dragged.dataset.id) {
      position = ind;
    }
  })

  obj.cards.splice(dragged.dataset.id, 1);
  obj.cards.splice(position, 0, dragged.textContent);

  list.textContent = '';
  for (let i = 0; i < obj.cards.length; i++) {
    const card = obj.createCard(i);
    list.append(card);
  }

  obj.saveToLS();
}

cardDragger();