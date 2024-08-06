// Este archivo contiene la lógica de la aplicación en el frontend.

// Establecer la conexión WebSocket
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', (event) => {
  console.log('Conexión WebSocket abierta.');
  // Enviar un mensaje de prueba al servidor
  socket.send(JSON.stringify({ type: 'test', message: 'Hola servidor' }));
});

socket.addEventListener('message', (event) => {
  console.log('Mensaje recibido del servidor:', event.data);
});

socket.addEventListener('close', (event) => {
  console.log('Conexión WebSocket cerrada.');
});

const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const closeBtn = document.getElementById("close-btn");
let editBool = false;

// Función para enviar un mensaje al servidor
function notifyServerOfNewFlashcard(question, answer) {
  const message = JSON.stringify({
    type: 'flashcard',
    question: question,
    answer: answer
  });
  
  socket.send(message);
  console.log('Mensaje enviado al servidor:', message);
}

// Cerrar el formulario
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
    submitQuestion();
  }
});

// Guardar tarjeta
cardButton.addEventListener("click", () => {
  editBool = false;
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();
  
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    viewlist();
    question.value = "";
    answer.value = "";
    
    notifyServerOfNewFlashcard(tempQuestion, tempAnswer);
    
    addQuestionCard.classList.add("hide");
  }
});

// Mostrar el formulario de agregar tarjeta
const addQuestion = document.getElementById("add-flashcard");
addQuestion.addEventListener("click", () => {
  console.log("Creando nueva tarjeta de estudio...");
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

// Función para mostrar la nueva tarjeta en la lista
function viewlist() {
  // Nueva tarjeta
  const listCard = document.getElementsByClassName("card-list-container");
  const div = document.createElement("div");
  div.classList.add("card");

  // Agregar pregunta
  div.innerHTML += `<p class="question-div">${question.value}</p>`;
  
  // Respuesta
  const displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div", "hide");
  displayAnswer.innerText = answer.value;

  // Show/Hide answer
  const link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    displayAnswer.classList.toggle("hide");
  });

  div.appendChild(link);
  div.appendChild(displayAnswer);

  // Edit button
  const buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");
  const editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editBool = true;
    modifyElement(editButton, true);
    addQuestionCard.classList.remove("hide");
  });
  buttonsCon.appendChild(editButton);
  disableButtons(false);

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  listCard[0].appendChild(div);

  applyRandomColors();
}

// Función para modificar elementos (editar o eliminar)
const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    const parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  parentDiv.remove();
};

// Función para deshabilitar botones
const disableButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};
