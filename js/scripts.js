/* ==================================
Selecting HTML elements for use in JS
===================================== */
const search = document.getElementsByClassName('search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

/* =================================
Fetch data function and Fetch request
==================================== */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results)
        .then(generateCard)
        .catch(error => console.log("There has been a problem", error))
        
}

fetchData('https://randomuser.me/api/?results=12')

/* =================================
checkStatus function to check status of fetch request
==================================== */
function checkStatus(response){
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/* =================================
HTML generating functions for gallery and modal
==================================== */
function generateCard(data) {
    const card = data.map(item => `
        <div class="card" data-index="${data.indexOf(item)}">
            <div class="card-img-container">
                <img class="card-img" src="${item.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                <p class="card-text">${item.email}</p>
                <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
            </div>
        </div>
    `).join('');
    generateModal(data)

    gallery.insertAdjacentHTML('beforeend', card);

    // Create Click Event Listener for each card that displays the Modal for the clicked card
    const cards = document.getElementsByClassName('card')
    for (let i=0; i<cards.length; i++) {
        cards[i].addEventListener('click', e => {
            const index = cards[i].getAttribute('data-index');
            displayModal(index)            
        })
    }
}

// the generateModal function needs to take a specific Object that is selected
// when the user's card is clicked. 
function generateModal(data) {
    const modal = data.map(item => `
        <div class="modal-container" data-index=${data.indexOf(item)}>
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${item.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${item.name.first} ${item.name.last}</h3>
                    <p class="modal-text">${item.email}</p>
                    <p class="modal-text cap">${item.location.city}</p>
                    <hr>
                    <p class="modal-text">(555) 555-5555</p>
                    <p class="modal-text">${item.location.street.number} ${item.location.street.name}, ${item.location.city}, ${item.location.state} ${item.location.postalcode}</p>
                    <p class="modal-text">Birthday: 10/21/2015</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `).join('');
    
    body.insertAdjacentHTML('beforeend', modal);

    // Select the generated Modals and set style.display to none
    const modals = document.getElementsByClassName('modal-container');
    for (let i=0; i<modals.length; i++) {
        modals[i].style.display = 'none';
    }
}

function displayModal(input) {
    const modal = document.getElementsByClassName('modal-container');
    for (let i=0; i<modal.length; i++) {
        const index = modal[i].getAttribute('data-index')
        const activeModal = modal[index];
        if (index === input) {
            modal[index].style.display = 'block'
            modalButtons(activeModal)
        }
    }
}

function modalButtons(input) {
    input.addEventListener('click', e => {
        if (e.target.innerText === "X") {
           input.style.display = "none";
        } else if (e.target.innerText === "PREV") {
            input.style.display = 'none';
            prevModal(input)
        } else if (e.target.innerText === "NEXT") {
            input.style.display = 'none';
            nextModal(input)
        }
    })
}

function prevModal(input) {
    const modal = document.getElementsByClassName('modal-container');
    const prevModal = input.previousElementSibling.getAttribute('data-index')
    if (input.dataset.index !== "0") {
        displayModal(prevModal)
    } else {
        const newIndex = modal.length -1
        displayModal(newIndex.toString())  
    } 
}

function nextModal(input) {
    if (input.dataset.index !== "11") {
        const nextModal = input.nextElementSibling.getAttribute('data-index')
        displayModal(nextModal)
    } else {
        displayModal("0")
    }
}




 