// Массив, который будет наполняться объектами при созданиии дела
let todoArray = [];

// Функция, создающая название
function createAppTitle(tittle) {
  const h1 = document.createElement("h1");
  h1.innerText = tittle;
  return h1;
}

//Функция, создающая форму для ввода и кнопку
function createTodoForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");

  // Чтобы кнопка работала только когда в input есть текст
  button.disabled = !input.value.length;
  input.addEventListener("input", () => {
    button.disabled = !input.value.length;
  });

  //Добавляю классы, которые будут использоваться из Bootstrap
  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  button.classList.add("btn", "btn-primary");

  input.placeholder = "Введите название дела";
  button.innerText = "Добавить задачу";

  form.append(input);
  form.append(button);

  return {
    form,
    input,
    button,
  };
}

// Функция, создающая ul список
function createTodoList() {
  const list = document.createElement("ul");
  list.classList.add("list-group");

  return list;
}

// Функция, создающая элемент списка
function createTodoItem(name) {
  const todoItemForm = document.createElement("form");
  todoItemForm.classList.add("d-flex");

  // Дело
  const todoItem = document.createElement("label");
  const formTodo = document.createElement("div");
  formTodo.classList.add("form-check", "flex-fill");

  // Кнопки, отмечающие готовность и удаление дела
  const doneCheck = document.createElement("input");
  const deleteBtn = document.createElement("button");

  //* Выбираю тип input
  doneCheck.type = "checkbox";
  deleteBtn.type = "submit";

  // Добавляю id у задачи в Local storage
  const randomId = Math.random() * 15.75;
  todoItem.id = randomId.toFixed(2);

  // Добавляю классы
  todoItem.classList.add(
    "form-check-label",
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  doneCheck.classList.add("form-check", "form-check-input", "check-check");
  deleteBtn.classList.add("btn", "btn-primary", "btn-danger");
  todoItem.textContent = name;
  deleteBtn.textContent = "X";

  formTodo.append(doneCheck);
  formTodo.append(todoItem);

  todoItemForm.append(formTodo);
  todoItemForm.append(deleteBtn);

  return {
    todoItem,
    doneCheck,
    deleteBtn,
    todoItemForm,
  };
}

// Функция переключающая done в Local storage на true/false
const changeItemDone = (arr, item) => {
  // map проходится по всем эл массива и вызывает для них проверку или действие
  arr.map((obj) => {
    if ((obj.id === item.id) & (obj.done === false)) {
      obj.done = true;
    } else if ((obj.id === item.id) & (obj.done === true)) {
      obj.done = false;
    }
  });
};

// Функция, которая переключает дело на "Готово"
function completeTodoItem(item, btn) {
  btn.addEventListener("click", () => {
    item.classList.toggle("list-group-item-success");

    //* Получаем из Local storage значение true\false
    todoArray = JSON.parse(localStorage.getItem(key));
    changeItemDone(todoArray, item);

    // Новый массив помещаю в Local storage
    localStorage.setItem(key, JSON.stringify(todoArray));
  });
}

// Функция, удаляющая дело
function deleteTodoItem(item, btn, form) {
  btn.addEventListener("click", () => {
    // Получаем существующий объект из Local storage
    todoArray = JSON.parse(localStorage.getItem(key));

    // Нажимая на кнопку удалить мы должны искать этот объект по id  и удалять его из Local storage
    const neaList = todoArray.filter((obj) => obj.id !== item.id);

    localStorage.setItem(key, JSON.stringify(neaList));

    item.remove();
    form.remove();
  });
}

function createTodoApp(container, tittle, key) {
  const appTitle = createAppTitle(tittle);
  const appForm = createTodoForm();
  const appList = createTodoList();

  container.append(appTitle, appForm.form, appList);

  // Чтобы дела не исчезали при обновлении. Сделать проверку, если в Local storage уже есть объекты, то нужно из отрисовывать.
  if (localStorage.getItem(key)) {
    todoArray = JSON.parse(localStorage.getItem(key));

    // Проходимся по массиву с объектами
    for (const obj of todoArray) {
      const todoItem = createTodoItem(appForm.input.value);
      // Имя объекта записыааем в Item
      todoItem.todoItem.textContent = obj.name;
      // Присваиваю id этого объекта
      todoItem.todoItem.id = obj.id;

      // Делаю проверку
      if (obj.done == true) {
        todoItem.todoItem.classList.add("list-group-item-success");
        todoItem.doneCheck.checked = true;
      } else {
        todoItem.todoItem.classList.remove("list-group-item-success");
        todoItem.doneCheck.checked = false;
      }

      // Обрабатываем кнопки
      completeTodoItem(todoItem.todoItem, todoItem.doneCheck);
      deleteTodoItem(
        todoItem.todoItem,
        todoItem.deleteBtn,
        todoItem.todoItemForm
      );

      appList.append(todoItem.todoItemForm);
    }
  }

  // Отправка формы при нажатии на кнопку
  appForm.form.addEventListener("submit", (e) => {
    // Чтобы страница не перезагружалась при отправке, нужно прописать:
    e.preventDefault();

    // При отправки будем вызывать функцию отправки
    const todoItem = createTodoItem(appForm.input.value);

    // Проверка на отсутствие значения в imput
    if (!appForm.input.value) {
      return;
    }

    // При добавлении дела, производим проверку. Если есть еще объекты, то записываем их в todoArray.
    // Получаю массив из Local storade в переменную
    let localStorageData = localStorage.getItem(key);
    if (localStorageData == null) {
      todoArray = [];
    } else {
      todoArray = JSON.parse(localStorageData);
    }

    // В Local storage принимается key по которому сохраняется объект value.
    // По этому ключу буду сохранять объекты и при перезагрузке они не будут удаляться, а будут сохраняться на странице.
    // В объекте должно выть поле для названия дела, статус готово или нет, для кажжого дела должен быть индивидуальный Id

    // Функция, которая создает объект
    const createItemObj = (arr) => {
      const itemObj = {};

      // Значение написанного в input
      itemObj.name = appForm.input.value;
      itemObj.id = todoItem.todoItem.id;
      itemObj.done = false;

      // Чтобы объект помещался в массив todoArra, при вызове функции будем принимать arr и помешщать в него itemObj
      arr.push(itemObj);
    };

    createItemObj(todoArray);
    // Сохряняю массив в localStorage
    localStorage.setItem(key, JSON.stringify(todoArray));

    // Нужно поместить item в лист
    appList.append(todoItem.todoItemForm);

    // Обрабатываем кнопки
    completeTodoItem(todoItem.todoItem, todoItem.doneCheck);
    deleteTodoItem(
      todoItem.todoItem,
      todoItem.deleteBtn,
      todoItem.todoItemForm
    );

    appForm.input.value = "";
    appForm.button.disabled = !appForm.button.disabled;
  });
}
