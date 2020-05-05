import {Question} from './question'
import {isValid} from './utils'
import {createModal} from './utils'
import {getAuthForm} from './auth'
import {authWithEmailAndPassword} from './auth'
import './styles.css'

const form = document.querySelector("#form");
const input = form.querySelector("#question-input");
const btnSubmit = form.querySelector("#btn-submit");
const btnModal = document.querySelector("#btn-modal");

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', ()=> {
  btnSubmit.disabled = !isValid(input.value);
});
btnModal.addEventListener('click', openModal);

function submitFormHandler(e) {
  e.preventDefault();

  if (isValid(input.value)) {
    const question  = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }
    btnSubmit.disabled = true;
    // request to servet to save question
    Question.create(question).then(()=> {
      input.value = '';
      input.className = '';
      btnSubmit.disabled = false;
    });
  }
}

function authFormHandler(e) {
  e.preventDefault();

  const email = e.target.querySelector("#email-input").value;
  const password = e.target.querySelector("#password-input").value;
  const btn = e.target.querySelector("button");

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
  .then(token => {
    return Question.fetch(token)
  })
  .then(renderModalAfterAuth)
  .then(()=> btn.disabled = false)
}

function renderModalAfterAuth(content) {
  if (typeof content == "string") {
    return createModal("Ошибка!", content)
  } else {
    createModal("Список вопросов", Question.listToHTML(content));
  }
}

function openModal() {
  createModal('Авторизация', getAuthForm());
  document.querySelector("#auth-form").addEventListener('submit', authFormHandler, {once: true});

}
