const Button = (color) => {
  let text, className;
  switch (color.toLowerCase()) {
    case 'green':
      text = 'Add card';
      className = 'button buttonAdd';
      break;
    
    case 'red':
      text = 'Cancell';
      className = 'button buttonCancell';
      break;

    default:
      text = 'No text';
      className = 'button';   
  }

  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = text;

  return button;
}

export default Button;