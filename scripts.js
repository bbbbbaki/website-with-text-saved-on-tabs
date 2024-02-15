var selectedTags = [];
var tagColors = {
  welcome: '#66cdaa',
  'step-by-step': '#ffcc66',
  understanding: '#cc99ff',
  objections: '#ff9999',
  deposits: '#99ccff',
  registration: '#ff99cc',
  game: '#99ff99',
  additional: '#cccccc',
  bot: '#999999',
  introduction: '#b3b3b3',
  ignore: '#808080'
};

function copyText() {
  const title = document.getElementById("input-title").value;
  const inputText = document.getElementById("input-text").value;
  const selectedTag = document.getElementById("tag-select").value;

  if (title === '' || inputText === '' || selectedTag === '') {
    alert("Пожалуйста, заполните все поля и выберите категорию!");
    return;
  }

  let textElement = document.createElement("div");
  textElement.className = "text-box";

  let titleElement = document.createElement("h2");
  titleElement.textContent = title;
  textElement.appendChild(titleElement);

  let contentElement = document.createElement("p");
  contentElement.textContent = inputText;
  textElement.appendChild(contentElement);

  let tagElement = document.createElement("span");
  tagElement.className = "tag " + selectedTag;
  tagElement.textContent = getTagLabel(selectedTag);
  tagElement.style.backgroundColor = tagColors[selectedTag];
  textElement.appendChild(tagElement);

  textElement.onclick = function() {
    copyToClipboard(inputText);
  };

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Редактировать";
  editButton.onclick = function() {
    editTextElement(textElement);
  };
  textElement.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Удалить";
  deleteButton.onclick = function() {
    deleteTextElement(textElement);
  };
  textElement.appendChild(deleteButton);

  document.getElementById("text-container").appendChild(textElement);
  selectedTags.push(selectedTag);
  saveToLocalStorage(title, inputText, selectedTag);
}

function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  showCopiedMessage();
}

function showCopiedMessage() {
  const messageElement = document.createElement("div");
  messageElement.textContent = "Успешно скопировано";
  messageElement.className = "copied-message";
  document.body.appendChild(messageElement);

  setTimeout(function() {
    messageElement.style.opacity = "0";
    setTimeout(function() {
      document.body.removeChild(messageElement);
    }, 300);
  }, 2000);
}

function saveToLocalStorage(title, inputText, selectedTag) {
  const savedTexts = localStorage.getItem("savedTexts");

  if (savedTexts) {
    savedTexts = JSON.parse(savedTexts);
  } else {
    savedTexts = [];
  }

  var textData = {
    title: title,
    text: inputText,
    tag: selectedTag
  };

  savedTexts.push(textData);
  localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
}

function loadFromLocalStorage() {
  const savedTexts = localStorage.getItem("savedTexts");

  if (savedTexts) {
    savedTexts = JSON.parse(savedTexts);

    for (var i = 0; i < savedTexts.length; i++) {
      const textData = savedTexts[i];
      const textElement = createTextElement(textData.title, textData.text, textData.tag);
      document.getElementById("text-container").appendChild(textElement);
      selectedTags.push(textData.tag);
    }
  }
}

function createTextElement(title, inputText, selectedTag) {
  const textElement = document.createElement("div");
  textElement.className = "text-box";

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;
  textElement.appendChild(titleElement);

  const contentElement = document.createElement("p");
  contentElement.textContent = inputText;
  textElement.appendChild(contentElement);

  const tagElement = document.createElement("span");
  tagElement.className = "tag " + selectedTag;
  tagElement.textContent = getTagLabel(selectedTag);
  tagElement.style.backgroundColor = tagColors[selectedTag];
  textElement.appendChild(tagElement);

  textElement.onclick = function() {
    copyToClipboard(inputText);
  };

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Редактировать";
  editButton.onclick = function() {
    editTextElement(textElement);
  };
  textElement.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Удалить";
  deleteButton.onclick = function() {
    deleteTextElement(textElement);
  };
  textElement.appendChild(deleteButton);

  return textElement;
}

function editTextElement(element) {
  const titleElement = element.querySelector("h2");
  const contentElement = element.querySelector("p");
  const selectedTag = element.querySelector(".tag").classList[1];

  const editForm = document.createElement("div");
  editForm.className = "edit-form";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = titleElement.textContent;
  editForm.appendChild(titleInput);

  const contentTextarea = document.createElement("textarea");
  contentTextarea.rows = "4";
  contentTextarea.value = contentElement.textContent;
  editForm.appendChild(contentTextarea);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Сохранить";
  saveButton.onclick = function() {
    saveEditedText(element, titleInput.value, contentTextarea.value, selectedTag);
  };
  editForm.appendChild(saveButton);

  element.appendChild(editForm);
  element.classList.add("editing");
}

function saveEditedText(element, newTitle, newContent, selectedTag) {
  const titleElement = element.querySelector("h2");
  const contentElement = element.querySelector("p");

  titleElement.textContent = newTitle;
  contentElement.textContent = newContent;

  const tagElement = element.querySelector(".tag");
  tagElement.className = "tag " + selectedTag;
  tagElement.textContent = getTagLabel(selectedTag);
  tagElement.style.backgroundColor = tagColors[selectedTag];

  element.removeChild(element.querySelector(".edit-form"));
  element.classList.remove("editing");

  updateLocalStorage();
}

function updateLocalStorage() {
  const textElements = document.querySelectorAll(".text-box");
  const savedTexts = [];

  textElements.forEach(function(element) {
    const titleElement = element.querySelector("h2");
    const contentElement = element.querySelector("p");
    const selectedTag = element.querySelector(".tag").classList[1];

    const textData = {
      title: titleElement.textContent,
      text: contentElement.textContent,
      tag: selectedTag
    };

    savedTexts.push(textData);
  });

  localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
}

function deleteTextElement(element) {
  const textContainer = document.getElementById("text-container");
  textContainer.removeChild(element);

  const savedTexts = JSON.parse(localStorage.getItem("savedTexts"));
  const title = element.querySelector("h2").textContent;
  const inputText = element.querySelector("p").textContent;
  const selectedTag = element.querySelector(".tag").classList[1];

  for (var i = 0; i < savedTexts.length; i++) {
    if (
      savedTexts[i].title === title &&
      savedTexts[i].text === inputText &&
      savedTexts[i].tag === selectedTag
    ) {
      savedTexts.splice(i, 1);
      break;
    }
  }

  localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
}

function getTagLabel(tag) {
  switch (tag) {
    case "all":
      return "ВСЕ";
    case "welcome":
      return "ПРИВЕТСТВЕННЫЙ";
    case "step-by-step":
      return "РАБОТА ПОЭТАПНО";
    case "understanding":
      return "ВОПРОС ВСЕ ЛИ ПОНЯТНО";
    case "objections":
      return "ОТРАБОТКА ВОЗРАЖЕНИЙ";
    case "deposits":
      return "ДЕПОЗИТЫ";
    case "registration":
      return "РЕГИСТРАЦИЯ";
    case "game":
      return "ИГРА";
    case "additional":
      return "ДОП";
    case "bot":
      return "БОТ";
    case "introduction":
      return "ЗНАКОМСТВО";
    case "ignore":
      return "ИГНОР";
    default:
      return "";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  loadFromLocalStorage();
});
