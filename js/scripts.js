/* ==================================
Selecting HTML elements for use in JS
===================================== */
const search = document.getElementsByClassName('search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const users = [];
/* =================================
Fetch data function and Fetch request
==================================== */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results)
        .then(generateCard)
        
}

fetchData('https://randomuser.me/api/?results=12')
console.log(users)
/* =================================
HTML generating functions for gallery and modal
==================================== */
function generateCard(data) {
    data.map(item => users.push(item))
    const card = data.map(item => `
        <div class="card">
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

    return gallery.insertAdjacentHTML('beforeend', card);
}

// the generateModal function needs to take a specific Object that is selected
// when the user's card is clicked. 
function generateModal(data) {

    const modal = data.map(item => `
        <div class="modal-container">
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
    console.log(typeof modal)
    return body.insertAdjacentHTML('beforeend', modal);
}

function displayModal(target) {
    const nameModal = document.getElementsByClassName('modal-name cap');
    const nameCard = document.getElementsByClassName('card-name cap');
    
    const modalArray = Object.values(nameModal)
                .map(text => text.innerText);
    const cardArray = Object.values(nameCard)
                .map(text => text.innerText)
                
    console.log(modalArray, cardArray)



}

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
Event Listeners for creating/closing the modal
==================================== */
const cards = document.getElementsByClassName('card-info-container');
console.log(Array.from(cards))

gallery.addEventListener('click', e => {
    if (e.target.className.includes('card')) {
        console.log(e.target.parentNode.innerText)
    }   
})

    






 