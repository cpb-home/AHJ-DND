import styles from './button.module.css'

const Button = (color) => {
  let text, className;
  switch (color.toLowerCase()) {
    case 'green':
      text = 'Add card';
      className = `${styles['button']} ${styles['buttonAdd']}`;
      break;
    
    case 'red':
      text = 'Cancell';
      className = `${styles['button']} ${styles['buttonCancell']}`;
      break;

    default:
      text = 'No text';
      className = `${styles['button']}`;   
  }

  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = text;

  return button;
}

export default Button;