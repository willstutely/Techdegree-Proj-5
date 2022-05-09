/** ==========================================================================================
 * Selecting HTML elements for use in JS
 ============================================================================================= */
const search = document.querySelector('.search-container');
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');

/** ==========================================================================================
 * FETCH REQUEST and Card and Modal generating functions
 ============================================================================================= */

/**
 * Function to generate a fetch() API request to obtain employee data
 * @param {string} url 
 * @returns - Promise object parsed into usable JSON data which is then used
 * to call the generateCard function thereby populating the page
 */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data.results)
        .then(generateCard)
        .catch(error => console.log("There has been a problem", error));
}

fetchData('https://randomuser.me/api/?results=12&nat=us');
createSearch();

/**
 * Function to check the status of the fetch request
 * @param {object} response 
 * @returns - a resolved Promise object or a rejected Promise object 
 * with an Error object describing the reason for the rejection
 */
function checkStatus(response){
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Function to generate the employee cards using the fetched API data
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
    const cards = document.getElementsByClassName('card');
// Call the performSearch() function to enable the eventListeners and conduct searches
    performSearch(cards);
    for (let i=0; i<cards.length; i++) {
        cards[i].addEventListener('click', e => {
            const index = cards[i].getAttribute('data-index');
            displayModal(index);          
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

/** ==========================================================================================
 * Search Feature
 * Includes several functions to aid with
 * creating and enabling a search feature
============================================================================================== */

/**
 * Function to generate the HTML for the Search bar
 * Is called just after the fetchData() function
 * 
 * @returns - insertAdjacentHTML of the variable searchFunction
 */
function createSearch() {
    const searchFunction = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form> 
    `;
    return search.insertAdjacentHTML('beforeend', searchFunction);
}

/**
 * Function to create eventListeners (submit and keyup) on the Search Form
 * Gets called inside the generateCard() function
 * 
 * @param {object} - The HTMLCollection selected inside the generateCard() function
 */
function performSearch(info) {
    const submit = document.querySelector('form');
    const searchInput = document.getElementById('search-input');
    submit.addEventListener('submit', e => {
        searchFunction(info, searchInput);
    })
    submit.addEventListener('keyup', e => {
        searchFunction(info, searchInput);
    })
};

/**
 * Function that iterates through each Card, selects and iterates 
 * through the innerText of the descendent element with the 
 * className "card-name cap" and compares it to the search field input.  
 * If there is a match then the relevant cards are displayed.
 * 
 * Gets called inside the eventListeners in performSearch()
 * 
 * @param {object} - The HTMLCollection selected inside the generateCard() function
 * that is passed into the performSearch() function 
 * @param {string} - The search field input data 
 */
function searchFunction(info, input) {
    for (let i=0; i<info.length; i++) {
        const name = info[i].getElementsByClassName('card-name cap');
        for (let j=0; j<name.length; j++) {
            if (name[j].textContent.toLowerCase().includes(input.value.toLowerCase()) === false) {
                info[i].style.display = "none";
            } else {
                info[i].style.display = "flex";
            }
        }
    }
};

/** ==========================================================================================
 * Modal display and manipulation functions
 ============================================================================================= */

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
        const index = modal[i].getAttribute('data-index');
        const activeModal = modal[index];
        if (index === input) {
            const actualModal = modal[i].getElementsByClassName('modal');
            const buttonCont = modal[i].getElementsByClassName('modal-btn-container')
            for (let j=0; j<actualModal.length; j++) {
                modal[index].style.display = 'block';
                
                const randomColoring = randomColor();
                actualModal[j].style.background = randomColoring;
                buttonCont[j].style.background = randomColoring;
                
                modalButtons(activeModal);
            }
        }
    }
}

/**
 * Function to generate a random color for style alteration
 * Color values were just picked at random from a color palette
 * Called inside the displayModal() function
 * 
 * @returns - a random color in the form of a hexadecimal string
 */
function randomColor() {
    const colors = ["#F6E3CE", "#E0E0F8", "#E0F8E0", "#F5F6CE", "#A9D0F5", "#CEF6F5"];
    const randomNumber = Math.floor(Math.random() * (colors.length - 1));
    const randomColor = colors[randomNumber];
    return randomColor;
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
            prevModal(input);
        } else if (e.target.innerText === "NEXT") {
            input.style.display = 'none';
            nextModal(input);
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
    const prevModal = input.previousElementSibling.getAttribute('data-index');
    if (input.dataset.index !== "0") {
        displayModal(prevModal);
    } else {
        const newIndex = modal.length -1
        displayModal(newIndex.toString()) ; 
    } 
}

function nextModal(input) {
    if (input.dataset.index !== "11") {
        const nextModal = input.nextElementSibling.getAttribute('data-index');
        displayModal(nextModal);
    } else {
        displayModal("0");
    }
}




 