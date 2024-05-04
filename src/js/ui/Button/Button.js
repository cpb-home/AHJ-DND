export default class Button {
  constructor() {
    this.body = document.createElement('button');
    this.className = 'button';
    this.type = 'button';
  }

  render() {
    const button = document.createElement('button');
    button.className = 'buttonAdd button';
    button.type = 'button';
    button.textContent = 'Add card';
    button.addEventListener('click', e => {
      const parent = e.target.closest('.column__footer');
      const area = parent.querySelector('.footerArea');
      if (area.value !== '') {
        this.addCard(area.value, e);
      }
    })
    return button;
  }
}