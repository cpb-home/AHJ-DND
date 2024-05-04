const Card = (id, text) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = id;
  card.draggable = true;
  card.textContent = text;

  return card;
}

export default Card;