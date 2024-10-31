// script.js
let currentPage = 'signin';
let animalData = { male: [], female: [] };
let currentAnimalIndex = null;
let currentGender = '';

document.getElementById(currentPage).classList.add('active');

function showSignIn() {
    showPage('signin');
}

function showSignUp() {
    showPage('signup');
}

function showGenderSelection() {
    showPage('genderSelection');
}

function showAnimalList() {
    showPage('animalList');
    renderAnimalList();
}

function showAddAnimal() {
    document.getElementById('animalName').value = '';
    document.getElementById('birthWeight').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('age').innerText = '0 days';
    document.getElementById('startDate').value = '';
    document.getElementById('dose').value = '0';
    document.getElementById('endDate').value = '';
    showPage('addAnimal');
}

function showAnimalDetails() {
    showPage('animalDetails');
}

function showEditAnimal() {
    const animal = animalData[currentGender][currentAnimalIndex];
    document.getElementById('editAnimalName').value = animal.name;
    document.getElementById('editBirthWeight').value = animal.weight.replace(' kg', '');
    document.getElementById('editBirthDate').value = animal.birthDate;
    document.getElementById('editStartDate').value = animal.startDate;
    document.getElementById('editDose').value = animal.dose;
    document.getElementById('editMedicineSelect').value = animal.medicine;
    updateEditEndDate(); // Update end date based on current start date and dose
    showPage('editAnimal');
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    currentPage = page;
}

function signIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Simple validation (implement actual authentication as needed)
    if (username && password) {
        showGenderSelection();
    } else {
        alert('Please fill in all fields!');
    }
}

function register() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    // Implement actual registration logic as needed
    if (email && username && password) {
        alert('Registered successfully!');
        showSignIn();
    } else {
        alert('Please fill in all fields!');
    }
}

function setGender(gender) {
    currentGender = gender;
    showAnimalList();
}

function logout() {
    showSignIn();
}

function saveAnimal() {
    const name = document.getElementById('animalName').value;
    const weight = document.getElementById('birthWeight').value + ' kg';
    const birthDate = document.getElementById('birthDate').value;
    const startDate = document.getElementById('startDate').value;
    const dose = parseInt(document.getElementById('dose').value) || 0;
    const medicine = document.getElementById('medicineSelect').value;

    if (!name) {
        alert('Name is required!');
        return;
    }

    const newAnimal = { name, weight, birthDate, age: calculateAge(birthDate), startDate, dose, medicine };

    if (animalData[currentGender].length < 1000) {
        animalData[currentGender].push(newAnimal);
        alert('Animal added successfully!');
        showAnimalList();
    } else {
        alert('Maximum animal capacity reached.');
    }
}

function renderAnimalList() {
    const animalNames = document.getElementById('animalNames');
    animalNames.innerHTML = '';
    animalData[currentGender].forEach((animal, index) => {
        const li = document.createElement('li');
        li.textContent = animal.name;
        li.onclick = () => {
            currentAnimalIndex = index;
            displayAnimalDetails(animal);
            showAnimalDetails();
        };
        animalNames.appendChild(li);
    });
}

function filterAnimals() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const animalNames = document.getElementById('animalNames');
    const searchResult = document.getElementById('searchResult');
    const filteredAnimals = animalData[currentGender].filter(animal => animal.name.toLowerCase().includes(searchValue));

    animalNames.innerHTML = '';
    filteredAnimals.forEach((animal, index) => {
        const li = document.createElement('li');
        li.textContent = animal.name;
        li.onclick = () => {
            currentAnimalIndex = index;
            displayAnimalDetails(animal);
            showAnimalDetails();
        };
        animalNames.appendChild(li);
    });

    searchResult.classList.toggle('hidden', filteredAnimals.length > 0);
}

function displayAnimalDetails(animal) {
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
        <p>Name: ${animal.name}</p>
        <p>Weight: ${animal.weight}</p>
        <p>Birth Date: ${animal.birthDate}</p>
        <p>Age: ${animal.age}</p>
        <p>Start Date: ${animal.startDate}</p>
        <p>Dose: ${animal.dose}</p>
        <p>Medicine: ${animal.medicine}</p>
    `;
}

function deleteAnimal() {
    if (currentAnimalIndex !== null) {
        animalData[currentGender].splice(currentAnimalIndex, 1);
        currentAnimalIndex = null;
        showAnimalList();
    }
}

function updateAnimal() {
    const name = document.getElementById('editAnimalName').value;
    const weight = document.getElementById('editBirthWeight').value + ' kg';
    const birthDate = document.getElementById('editBirthDate').value;
    const startDate = document.getElementById('editStartDate').value;
    const dose = parseInt(document.getElementById('editDose').value) || 0;
    const medicine = document.getElementById('editMedicineSelect').value;

    if (currentAnimalIndex !== null) {
        animalData[currentGender][currentAnimalIndex] = {
            name,
            weight,
            birthDate,
            startDate,
            dose,
            medicine,
            age: calculateAge(birthDate)
        };
        alert('Animal updated successfully!');
        showAnimalDetails();
        displayAnimalDetails(animalData[currentGender][currentAnimalIndex]); // Update the displayed details
    }
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.floor((today - birth) / (1000 * 60 * 60 * 24)) + ' days';
}

function updateAge() {
    const birthDate = document.getElementById('birthDate').value;
    if (birthDate) {
        document.getElementById('age').innerText = calculateAge(birthDate);
    }
}

function incrementDose() {
    const doseField = document.getElementById('dose');
    let dose = parseInt(doseField.value) || 0;
    doseField.value = dose + 1;
    updateEndDate();
}

function decrementDose() {
    const doseField = document.getElementById('dose');
    let dose = parseInt(doseField.value) || 0;
    doseField.value = Math.max(dose - 1, 0);
    updateEndDate();
}

function updateEndDate() {
    const startDate = document.getElementById('startDate').value;
    const dose = parseInt(document.getElementById('dose').value) || 0;
    const endDateField = document.getElementById('endDate');

    if (startDate && dose > 0) {
        const startDateObj = new Date(startDate);
        const endDate = new Date(startDateObj);
        endDate.setDate(startDateObj.getDate() + dose - 1);
        endDateField.value = endDate.toISOString().split('T')[0];
    } else {
        endDateField.value = '';
    }
}

// For Edit Animal Page Functions
function updateEditEndDate() {
    const startDate = document.getElementById('editStartDate').value;
    const dose = parseInt(document.getElementById('editDose').value) || 0;
    const endDateField = document.getElementById('editEndDate');

    if (startDate && dose > 0) {
        const startDateObj = new Date(startDate);
        const endDate = new Date(startDateObj);
        endDate.setDate(startDateObj.getDate() + dose - 1);
        endDateField.value = endDate.toISOString().split('T')[0];
    } else {
        endDateField.value = '';
    }
}

function incrementEditDose() {
    const doseField = document.getElementById('editDose');
    let dose = parseInt(doseField.value) || 0;
    doseField.value = dose + 1;
    updateEditEndDate();
}

function decrementEditDose() {
    const doseField = document.getElementById('editDose');
    let dose = parseInt(doseField.value) || 0;
    doseField.value = Math.max(dose - 1, 0);
    updateEditEndDate();
}
