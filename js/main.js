let api = "http://localhost:8000/docs";

let btnToCreate = document.querySelector(".btn-to-create");
let btnCreate = document.querySelector(".btn-create");

let modal = document.querySelector(".my-modal.create");
let closeModal = document.querySelector(".create .close-modal");
let modalBody = document.querySelector(".create .my-modal-body");

let modal2 = document.querySelector(".my-modal.update");
let closeModal2 = document.querySelector(".update .close-modal");
let modalBody2 = document.querySelector(".update .my-modal-body");

let inp1 = document.querySelector(".create .inp-1");
let inp2 = document.querySelector(".create .inp-2");

let editInp1 = document.querySelector(".update .inp-1");
let editInp2 = document.querySelector(".update .inp-2");
let btnUpdate = document.querySelector(".btn-update");

let searchWord = "";

let counterPerPage = 5;
let currentPage = 1;
let pagesCount = 1;

//! READ
const render = () => {
  fetch(`${api}?q=${searchWord}`)
    .then((response) => response.json())
    .then((docs) => {
      let list = document.querySelector(".list");
      list.innerHTML = "";

      //! pagination
      pagesCount = Math.ceil(docs.length / counterPerPage);
      let newDocs = docs.splice(
        (currentPage - 1) * counterPerPage,
        counterPerPage
      );

      newDocs.forEach((el) => {
        let row = document.createElement("div");
        row.classList.add("row");
        let rowTitle = document.createElement("h2");
        rowTitle.classList.add("row__title");
        rowTitle.innerText = el.title;
        let rowContent = document.createElement("div");
        rowContent.classList.add("row__content");
        rowContent.innerText = el.content;
        let rowDate = document.createElement("div");
        rowDate.classList.add("row__date");
        rowDate.innerHTML = `<span>${el.date}</span>`;
        btnToUpdate = document.createElement("img");
        btnDelete = document.createElement("img");
        btnToUpdate.setAttribute("src", "./images/edit.png");
        btnDelete.setAttribute("src", "./images/delete.png");
        rowDate.append(btnToUpdate, btnDelete);
        row.append(rowTitle, rowContent, rowDate);
        list.append(row);

        btnDelete.addEventListener("click", (e) => {
          fetch(`${api}/${el.id}`, {
            method: "DELETE",
          }).then(() => {
            render();
            showAlert("Successfully deleted", "green", "white");
          });
        });

        //! UPDATE p1
        btnToUpdate.addEventListener("click", (e) => {
          modal2.style.display = "flex";
          editInp1.value = el.title;
          editInp2.value = el.content;
          btnUpdate.setAttribute("id", el.id);
        });
        pagination();
      });
    });
};
render();

//! LIVE SEARCH
let liveSearchInp = document.querySelector(".live-search-inp");
liveSearchInp.addEventListener("input", (e) => {
  searchWord = e.target.value;
  currentPage = 1;
  render();
});

//! UPDATE p2
btnUpdate.addEventListener("click", (e) => {
  const updatedDoc = {
    title: editInp1.value,
    content: editInp2.value,
  };
  fetch(`${api}/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedDoc),
  }).then(() => {
    modal2.style.display = "none";
    render();
  });
});

// show create modal
btnToCreate.addEventListener("click", (e) => {
  modal.style.display = "flex";
});

// hide create modal
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
  if (e.target == modal) modal.style.display = "none";
});
closeModal2.addEventListener("click", (e) => {
  modal2.style.display = "none";
});
modal2.addEventListener("click", (e) => {
  if (e.target == modal2) modal2.style.display = "none";
});

btnCreate.addEventListener("click", (e) => {
  const newDoc = {
    date: new Date().toString(),
    title: inp1.value,
    content: inp2.value,
  };
  if (checkInputs(newDoc)) {
    showAlert("Please fill all fields", "red", "white");
    return;
  }

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDoc),
  }).then(() => {
    inp1.value = "";
    inp2.value = "";
    showAlert("Document added", "green", "white");
    render();
  });
  modal.style.display = "none";
});

// ! Pagination
let ulPagination = document.querySelector(".pagination");

const pagination = () => {
  ulPagination.innerHTML = "";

  for (let i = 1; i <= pagesCount; i++) {
    let li = document.createElement("li");
    li.classList.add("page-link");
    li.innerText = i;
    ulPagination.append(li);
    li.addEventListener("click", (e) => {
      currentPage = i;
      render();
    });
  }
};

//? Lib
// Validate function
function checkInputs(obj) {
  for (let i in obj) {
    if (!obj[i].trim()) {
      return true;
    }
  }
  return false;
}
function showAlert(text, bgColor = "black", color = "white") {
  Toastify({
    text: text,
    duration: 4000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgColor,
      color: color,
    },
  }).showToast();
}
