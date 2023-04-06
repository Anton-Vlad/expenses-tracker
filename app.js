
const auth = firebase.auth();
const expensesTableRef = db.collection("expenses");
let userId = null;

// Filters
let startDate = new Date('2023-01-01');
let endDate = new Date('2023-03-31');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatMonth(index, type='number') {
    if (type == 'name') {
        return monthNames[index];
    }

    let out = index + 1;
    if (out < 10) {
        return '0' + out;
    }

    return out + '';
}

// Main Sections
const loginSection = document.getElementById('login-section');
const welcomeSection = document.getElementById('welcome-section');

// HTML places
const userNameHtml = document.getElementById('user-name');
const expensesFormHtml = document.getElementById('expenses-form');
const expensesTableRowsHtml = document.getElementById('expenses-table-rows');
const periodSpanLabelHtml = document.getElementById('period-span');

// Content Tabs
const expensesFormTab = document.getElementById('expenses-form-tab');
const expensesTableTab = document.getElementById('expenses-table-tab');

// Input elements
const expenseValueInput = document.getElementById('expens-value');
const expenseLocationInput = document.getElementById('expens-location');
const expenseDateInput = document.getElementById('expens-date');
const expenseTagInput = document.getElementById('expens-tag');
const expenseDetailsInput = document.getElementById('expxens-details');

// All buttons
const signInWithGoogleButton = document.getElementById('signInWithGoogle');
const logoutButton = document.getElementById('logout');
const addAnExpensButton = document.getElementById('addAnExpens');
const tableExpensesButton = document.getElementById('showTableExpenses');

const signInWithGoogle = (e) => {
    e.preventDefault();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(googleProvider).then((result) => {}).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...

        console.log(errorCode, errorMessage)
    });
}

const userSignOut = (e) => {
    auth.signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...

        console.log(errorCode, errorMessage)
    });
}

function showFormExpenses() {
    expensesFormTab.style.display = 'block';

    hideTableExpenses();
}
function hideFormExpenses() {
    expensesFormTab.style.display = 'none';
}

function showTableExpenses() {
    expensesTableTab.style.display = 'block';

    hideFormExpenses();

    displayDateRangeLabel();
    queryExpenses();
}
function hideTableExpenses() {
    expensesTableTab.style.display = 'none';
}

function displayDateRangeLabel() {
    periodSpanLabelHtml.innerHTML = '';

    let startDay = startDate.getDate();
    let startMonth = startDate.getMonth();
    let startYear = startDate.getFullYear();

    let endDay = endDate.getDate();
    let endMonth = endDate.getMonth();
    let endYear = endDate.getFullYear();

    periodSpanLabelHtml.innerHTML = startDay + '-' + formatMonth(startMonth) + '-' + startYear + ' -> ' + endDay + '-' + formatMonth(endMonth) + '-' + endYear;
}

function onFormSubmit(e) {
    e.preventDefault();

    const formPayload = {
        userId: userId,
        value: parseFloat(expenseValueInput.value),
        location: expenseLocationInput.value,
        date: new Date(expenseDateInput.value),
        tag: expenseTagInput.value,
        details: expenseDetailsInput.value,
    }

    expensesTableRef.add(formPayload);
}


function renderTableRow(data) {
    let newRow = document.createElement("tr");

    let dateColumn = document.createElement("td");
    dateColumn.attributes.scope = 'row';

    let objectDate = new Date(data.date.seconds * 1000)
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();
    dateColumn.innerHTML = day + '-' + formatMonth(month) + '-' + year;
    newRow.appendChild(dateColumn);

    let locationColumn = document.createElement("td");
    locationColumn.innerHTML = data.location;
    newRow.appendChild(locationColumn);

    let tagColumn = document.createElement("td");
    tagColumn.innerHTML = data.tag;
    newRow.appendChild(tagColumn);

    let valueColumn = document.createElement("td");
    valueColumn.innerHTML = data.value;
    newRow.appendChild(valueColumn);

    expensesTableRowsHtml.appendChild(newRow);
}

function queryExpenses() {

    expensesTableRef
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        // .where('value', '>', 200)
        // .where('value', '<', 700)
    .get()
    .then((querySnapshot) => {
        expensesTableRowsHtml.innerHTML = "";

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            renderTableRow(doc.data())
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}


(function () {

    console.log('iNIT THE APP')

    signInWithGoogleButton.addEventListener("click", signInWithGoogle)
    logoutButton.addEventListener("click", userSignOut)
    addAnExpensButton.addEventListener("click", showFormExpenses)
    tableExpensesButton.addEventListener("click", showTableExpenses)
    expensesFormHtml.addEventListener("submit", onFormSubmit)

    auth.onAuthStateChanged((user) => {
        
        if (user == null) {
            userId = null;
            welcomeSection.style.display = 'none';
            loginSection.style.display = 'block';
            hideFormExpenses();
        } else {
            userId = user.uid;
            welcomeSection.style.display = 'block';
            loginSection.style.display = 'none';
            showFormExpenses();

            userNameHtml.innerText = user.displayName;
        }
    });

})();