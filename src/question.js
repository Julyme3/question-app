export class Question {
  static create(question) {
    return fetch('https://regiser-app.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      question.id = response.name;
      return question
    })
    .then(addToLocalStorage(question))
    .then(Question.renderList)
  }

  static fetch(token) {
    if (!token) { // если не получилось авторизоваться возвращаем сообщение с ошибкой
      return Promise.resolve('<p class="error">У вас нет токена</p>')
    }
    return fetch(`https://regiser-app.firebaseio.com/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return '<p class="error">У вас нет токена</p>';
        }
        return response ? Object.keys(response).map((key, i, arr) => ({
          "text": response[key].text,
          "date": response[key].date,
          id: key
        })) : [];
      })
  }

  static renderList() {
    const questions = getFromLocalStorage(); // массив вопросов
    const html = questions.length ?
    questions.map(toCard).join('') :
    '<div class="mui--text-headline">Вы не задавали вопросы</div>';

    const list = document.querySelector('#list');
    list.innerHTML = html;
  }

  static listToHTML(questions) {
    return questions.length ?
      `<ol>${questions.map((item)=>`<li>${item.text}</li>`).join('')}</ol>` :
      `<p>Вопросов пока нет!</p>`;
  }
}

function addToLocalStorage(question) {
  const all = getFromLocalStorage();

  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
  return `
  <div class="mui--text-black-54">${new Date(question.date).toLocaleDateString()}
  ${new Date(question.date).toLocaleTimeString()}</div>
  <div>${question.text}</div><br/>
  `;
}
