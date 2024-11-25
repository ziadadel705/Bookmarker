// Necsessary Declaration
var bookmarkName = document.querySelector("#bookmarkName");
var bookmarkURL = document.querySelector("#bookmarkURL");
var submitButton = document.querySelector("#submitBtn");
var tableBody = document.querySelector("#tableContent");
var closeModalButton = document.querySelector("#closeBtn");
var modalBox = document.querySelector(".box-info");
let deleteButtons, visitButtons;
let bookmarkList = [];

// Load from localStorage
if (localStorage.getItem("bookmarksData")) {
  bookmarkList = JSON.parse(localStorage.getItem("bookmarksData"));
  bookmarkList.forEach((_, index) => renderBookmark(index));
}

function renderBookmark(index) {
  var bookmark = bookmarkList[index];
  var urlPrefixPattern = /^https?:\/\//;

  let fullURL = urlPrefixPattern.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`;
  let cleanURL = bookmark.url.replace(urlPrefixPattern, "");

  var rowMarkup = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmark.name}</td>
      <td>
        <button class="btn btn-visit" data-index="${index}">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn btn-delete pe-2" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>Delete
        </button>
      </td>
    </tr>
  `;

  tableBody.innerHTML += rowMarkup;

  updateButtonListeners();
}

function updateButtonListeners() {
  deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", (event) => removeBookmark(event))
  );

  visitButtons = document.querySelectorAll(".btn-visit");
  visitButtons.forEach((btn) =>
    btn.addEventListener("click", (event) => openBookmark(event))
  );
}

// Clear Input Fields
function resetInputs() {
  bookmarkName.value = "";
  bookmarkURL.value = "";
}

// Capitalize
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Submit button
submitButton.addEventListener("click", () => {
  if (
    bookmarkName.classList.contains("is-valid") &&
    bookmarkURL.classList.contains("is-valid")
  ) {
    var newBookmark = {
      name: capitalizeFirstLetter(bookmarkName.value.trim()),
      url: bookmarkURL.value.trim(),
    };

    bookmarkList.push(newBookmark);
    localStorage.setItem("bookmarksData", JSON.stringify(bookmarkList));
    renderBookmark(bookmarkList.length - 1);
    resetInputs();

    bookmarkName.classList.remove("is-valid");
    bookmarkURL.classList.remove("is-valid");
  } else {
    modalBox.classList.remove("d-none");
  }
});

// Remove 
function removeBookmark(event) {
  var indexToRemove = event.target.dataset.index;
  bookmarkList.splice(indexToRemove, 1);

  tableBody.innerHTML = "";
  bookmarkList.forEach((_, index) => renderBookmark(index));
  localStorage.setItem("bookmarksData", JSON.stringify(bookmarkList));
}

// Open 
function openBookmark(event) {
  var indexToOpen = event.target.dataset.index;
  var bookmark = bookmarkList[indexToOpen];
  var formattedURL = /^https?:\/\//.test(bookmark.url)
    ? bookmark.url
    : `https://${bookmark.url}`;
  window.open(formattedURL, "_blank");
}

// Validation
var nameValidationPattern = /^\w{3,}(\s+\w+)*$/;
var urlValidationPattern = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

bookmarkName.addEventListener("input", () =>
  validateInput(bookmarkName, nameValidationPattern)
);
bookmarkURL.addEventListener("input", () =>
  validateInput(bookmarkURL, urlValidationPattern)
);

function validateInput(inputElement, pattern) {
  if (pattern.test(inputElement.value.trim())) {
    inputElement.classList.add("is-valid");
    inputElement.classList.remove("is-invalid");
  } else {
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
  }
}