let API_URL = "https://database-system-project.onrender.com/";

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
  const select = dropdown.querySelector('.select');
  const caret = dropdown.querySelector('.caret');
  const menu = dropdown.querySelector('.menu');
  const options = dropdown.querySelectorAll('.menu li');
  const selected = dropdown.querySelector('.selected');

  select.addEventListener('click', () => {
    select.classList.toggle('select-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      selected.innerText = option.innerText;

      select.classList.remove('select-clicked');
      caret.classList.remove('caret-rotate');
      menu.classList.remove('menu-open');

      options.forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');

      // If we're on the admin page, load data when a new room is selected
      if (document.getElementById('table-body')) {
        populateTable();
      }
    });
  });
});

// Code for the maintenance page
document.addEventListener('DOMContentLoaded', function () {
  // Check if the submit button exists on the current page
  const submitButton = document.querySelector('.subbtn');
  if (submitButton) {
    submitButton.addEventListener('click', function () {
      // Retrieve selected room
      const selectedRoom = document.querySelector('.selected').textContent;

      // Retrieve checkbox and comments data for each equipment
      const fanChecked = document.getElementById('fan-checkbox').checked;
      const fanComments = document.getElementById('fan-comments').value;

      const acChecked = document.getElementById('ac-checkbox').checked;
      const acComments = document.getElementById('ac-comments').value;

      const projectorChecked = document.getElementById('projector-checkbox').checked;
      const projectorComments = document.getElementById('projector-comment').value;

      const lightChecked = document.getElementById('light-checkbox').checked;
      const lightComments = document.getElementById('light-comments').value;

      // Constructing the data object to send to the server
      // Note: MongoDB expects boolean values, not "Yes"/"No" strings
      const data = {
        id: selectedRoom,
        fan: fanChecked,
        fan_comments: fanComments,
        ac: acChecked,
        ac_comments: acComments,
        projector: projectorChecked,
        projector_comments: projectorComments,
        light: lightChecked,
        light_comments: lightComments
      };

      // Send data to the server
      sendDataToServer(data);
    });
  }

  // Initialize table if we're on the admin page
  if (document.getElementById('table-body')) {
    populateTable();
  }
});

let sendDataToServer = async (data) => {
  try {
    const response = await fetch(API_URL + 'submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      // Show success message
      alert('Maintenance request submitted successfully!');
      window.location.reload();
    } else {
      // Handle errors
      const errorData = await response.json();
      alert('Error submitting request: ' + (errorData.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error occurred. Please try again.');
  }
};

let populateTable = async () => {
  try {
    // Get the selected classroom ID
    const selectedRoom = document.querySelector('.selected').textContent;

    // Fetch data from the admindata endpoint
    const response = await fetch(API_URL + 'admindata/' + selectedRoom);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous data

    if (data.length === 0) {
      // Display a message if no data is available
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="13" class="text-center">No data available for this classroom</td>';
      tableBody.appendChild(row);
      return;
    }

    // Loop through the data and create table rows
    data.forEach(item => {
      const row = document.createElement('tr');

      // Convert boolean values to 'Yes'/'No' for display
      const fanStatus = item.fan ? 'Yes' : 'No';
      const acStatus = item.ac ? 'Yes' : 'No';
      const projectorStatus = item.projector ? 'Yes' : 'No';
      const lightStatus = item.light ? 'Yes' : 'No';

      row.innerHTML = `
                <td>${item.id}</td>
                <td>${fanStatus}</td>
                <td>${item.fan_comments || ''}</td>
                <td>${acStatus}</td>
                <td>${item.ac_comments || ''}</td>
                <td>${projectorStatus}</td>
                <td>${item.projector_comments || ''}</td>
                <td>${lightStatus}</td>
                <td>${item.light_comments || ''}</td>
                <td>${item.day}</td>
                <td>${item.start_time}</td>
                <td>${item.end_time}</td>
                <td>${item.course}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error fetching data:', err);

    // Display error message in the table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous data
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="13" class="text-center">Error loading data. Please try again.</td>';
    tableBody.appendChild(row);
  }
};

// Function to load classroom options from the database
// This helps ensure we're only showing rooms that exist in the database
let loadClassroomOptions = async () => {
  try {
    // Fetch all unique classroom IDs from the schedule collection
    const response = await fetch(API_URL + 'classrooms');

    if (!response.ok) {
      throw new Error('Failed to fetch classroom data');
    }

    const classrooms = await response.json();

    // Get the dropdown menu element
    const menu = document.querySelector('.menu');
    if (!menu) return;

    // Clear existing options
    menu.innerHTML = '';

    // Add each classroom as an option
    classrooms.forEach((classroom, index) => {
      const option = document.createElement('li');
      option.textContent = classroom;

      // Make the first option active by default
      if (index === 0) {
        option.classList.add('active');
        document.querySelector('.selected').textContent = classroom;
      }

      menu.appendChild(option);
    });

    // Reattach event listeners to new options
    const options = menu.querySelectorAll('li');
    options.forEach(option => {
      option.addEventListener('click', () => {
        document.querySelector('.selected').innerText = option.innerText;

        options.forEach(opt => {
          opt.classList.remove('active');
        });
        option.classList.add('active');

        // If we're on the admin page, refresh the table
        if (document.getElementById('table-body')) {
          populateTable();
        }
      });
    });
  } catch (err) {
    console.error('Error loading classrooms:', err);
  }
};

// Call this function when the page loads if the dropdown exists
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.dropdown')) {
    loadClassroomOptions();
  }
});