// random-colors.js

// Función para generar un color hexadecimal aleatorio
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Función para aplicar un color aleatorio a las tarjetas
function applyRandomColors() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.background = getRandomColor();
  });
}

// Llama a applyRandomColors cuando se cargue el contenido
document.addEventListener('DOMContentLoaded', applyRandomColors);
