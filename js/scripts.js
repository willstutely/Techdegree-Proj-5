/** ====================================
 * Selecting HTML elements for use in JS
 ==================================== */
const search = document.getElementsByClassName('search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

/** ====================================================
 * FETCH REQUEST and Card and Modal generating functions
 ==================================================== */

/**
 * Function to generate a fetch() API request to obtain employee data
 * @param {string} url 
 * @returns - 
 */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results)
        .then(generateCard)
        .catch(error => console.log("There has been a problem", error))
        
}

fetchData('https://randomuser.me/api/?results=12&nat=us')

/**
 * Function to check the status of the fetch request
 * @param {object} response 
 * @returns - a resolved Promise object or a rejected Promise object 
 * with an Error object describing the reason for the rejection
 */
function checkStatus(response){
    console.log(typeof response)
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Function the generate the employee cards using the fetched API data
 * Uses interpolation to generate a template literal that is appended to the DOM
 * via insertAdjacentHTML
 * Creates eventListners for each card to be used to display Modals from each card
 * 
 * Thanks to Rachel Johnson on Slack for the suggestion of using data-index attributes
 * on the cards and modals for specifying which card was selected and thus which modal
 * needs to be displayed
 * 
 * @param {ojbect} data - the parsed JSON data obtained via fetch requst in the 
 * fetchData() function
 */
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

/**
 * Function to generate the employee Modals using the fetched API data
 * Uses interpolation to generate a template literal that is appended to the DOM
 * via insertAdjacentHTML
 * The modals are created and initially set to a style.display value of "none" until
 * the relevant card is clicked and the style.dipslay value is set to "block"
 * 
 * Thanks to Rachel Johnson on Slack for the suggestion of using data-index attributes
 * on the cards and modals for specifying which card was selected and thus which modal
 * needs to be displayed
 * 
 * @param {object} data 
 */ 
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
                    <p class="modal-text">${item.cell}</p>
                    <p class="modal-text">${item.location.street.number} ${item.location.street.name}, ${item.location.city}, ${item.location.state} ${item.location.postcode}</p>
                    <p class="modal-text">Birthday: ${item.dob.date.slice(5,7)}/${item.dob.date.slice(8,10)}/${item.dob.date.slice(0,4)}</p>
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

/** =======================================
 * Modal display and manipulation functions
 ======================================= */

/**
 * Function to display Modal
 * Called on 'click' eventListener or called when cycling through Modals
 * Calls modalButtons() to generate eventListners on each button on the Modal
 * 
 * @param {string} input - Either the index of an event.target or an 
 * index generated by prevModal() or nextModal()
 */

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

/**
 * Function to addEventListener to the Modal buttons
 * Gets called by displayModal()
 * Uses conditionals to check which button is clicked by identifying the innerText
 * 
 * @param {string} input - The index of the active Modal which is passed into it by
 * the displayModal() function.
 */
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

/**
 * Functions to close active Modal and display the Previous or Next Modal
 * Called inside of the modalButtons() function
 * 
 * @param {string} input - Index of the activeModal in the displayModal() function
 * This is used to allow for a continous loop of cycling through Modals. 
 * The input parameter is handed down by the modalButtons() function
 */
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




 