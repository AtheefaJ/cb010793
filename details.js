let iti;

document.addEventListener("DOMContentLoaded", function () {
  //Country codes
  var input = document.querySelector("#telNo");
  iti = window.intlTelInput(input, {
      preferredCountries: ["lk" ,"us"], // Add preferred country codes
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js", // Load utilities script
  });

  updateSummaryTable();

  //Getting references to the input fields
  const fullNameInput = document.getElementById("fName");
  const mobileInput = document.getElementById("telNo");
  const emailInput = document.getElementById("email");
  const confirmEmailInput = document.getElementById("confirm-email");

  //Adding event listeners to the input fields for validation
  fullNameInput.addEventListener("input", validateFullName);
  mobileInput.addEventListener("input", validateMobile);
  emailInput.addEventListener("input", validateEmail);
  confirmEmailInput.addEventListener("input", validateConfirmEmail);


  //Adding an event listener to the form for overall validation
  const detailsForm = document.getElementById("detailsForm");
  detailsForm.addEventListener("input", checkFormValidity);


  //Adding an event listener to the "Continue with purchase" button
  continueButton.addEventListener("click", function (event) {
    event.preventDefault(); //Prevent the default form submission behavior from occuring 

    //Performing the validations when the button is clicked
    validateFullName();
    validateMobile();
    validateEmail();
    validateConfirmEmail();
    checkFormValidity();

    //Checking if any validation errors exist
    if (!isFormValid()) 
    {
        return; //Don't proceed if there are errors
    } 
    else 
    {
      //Saving the form data as an array in local storage
      const formData = {
        fullName: fullNameInput.value.trim(),
        mobileNumber: iti.getNumber(),
        email: emailInput.value.trim(),
        confirmEmail: confirmEmailInput.value.trim()
      };
  
      localStorage.setItem("formData", JSON.stringify(formData));
      
      //Redirect the user to the Payment page
      window.location.href = "payment.html";
    }
  });


  //Getting the gender select element
  const genderSelect = document.getElementById("gender");

  //Adding an event listener to the gender select element
  genderSelect.addEventListener("change", function () {
    // Get the selected gender value
    const selectedGender = genderSelect.value;

    // Store the selected gender value in local storage
    localStorage.setItem("selectedGender", selectedGender);
  });
    
  //Clear local storage when the page refreshes
  localStorage.removeItem("selectedGender");
});


//Function to retrive the data stored in the local storage and display the summary table
function updateSummaryTable()
{
  //Retrieve the summary table data from the local storage
  const summaryData = JSON.parse(localStorage.getItem("summaryData"));

  //Recreate the summary table using the retrieved data
  const summaryTable = document.getElementById("summary-table");

  //Creating an empty string to store the HTML content of rows
  let summaryTableRows = "";

  // Loop through guest types and charges in summaryData.charges
  for (const guestType in summaryData.charges) 
  {
    const chargeAmount = guestType === "Infant"
      ? "Free"
      : `$ ${summaryData.charges[guestType].toFixed(2)}`;

    summaryTableRows += `
      <tr>
        <td>${summaryData.guestCounts[guestType]} ${guestType}</td>
        <td class="right">${chargeAmount}</td>
      </tr>
    `;
  }

  //Insert the rows into the summary table body
  summaryTable.innerHTML = `
    <tr>
      <th>Date</th>
      <td>${summaryData.selectedDate}</td>
    </tr>
    <tr>
      <th>Time</th>
      <td>${summaryData.selectedDurations.join(", ")}</td>
    </tr>
    <tr>
      <th>Duration</th>
      <td>${summaryData.selectedDurations.length} hrs</td>
    </tr>
    <tr class="highlight">
      <th>Tickets</th>
      <th>Charges</th>
    </tr>
    ${summaryTableRows} 
    <tr class="highlight">
      <th>Total Payable</th>
      <td class="right" colspan="2">$ ${summaryData.totalAmount}</td>
    </tr>
  `;
}



//Function to validate the full name
function validateFullName() 
{
  //Getting references to the elements
  const fullNameInput = document.getElementById("fName");
  const fullNameError = document.getElementById("fullNameError");
  const fullNameValue = fullNameInput.value.trim();

  //Regular expression to allow only letters and spaces
  const fullNamePattern = /^[A-Za-z\s]+$/; 

  if (fullNameValue === "") 
  {
    fullNameError.textContent = "Please add the full name"; //Displaying error message
    fullNameInput.classList.add("error-border");
  } 
  else if (!fullNamePattern.test(fullNameValue)) 
  {
    fullNameError.textContent = "Full name can only contain letters and spaces"; //Displaying error message
    fullNameInput.classList.add("error-border");
  } 
  else 
  {
    fullNameError.textContent = "";  //Remove error message
    fullNameInput.classList.remove("error-border");
  }
    
  checkFormValidity();
}


//Function to validate the mobile number input
function validateMobile() 
{
  //Getting references to elements
  const mobileInput = document.getElementById("telNo");
  const mobileError = document.getElementById("mobileError");
  const mobileValue = mobileInput.value.trim();

  if (!iti.isValidNumber()) 
  {
    mobileError.textContent = "Add a valid mobile number";  //Displaying error message
    mobileInput.classList.add("error-border");
  } 
  else 
  {
    mobileError.textContent = "";  //Remove error message
    mobileInput.classList.remove("error-border");
  }

  checkFormValidity();
}


//Function to check the validity of the email
function validateEmail() 
{
  //Getting references to elements
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const emailValue = emailInput.value.trim();

  //Regular expression pattern to validate the email addresse
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailValue)) 
  {
    emailError.textContent = "Add a valid email ID"; //Displaying error message
    emailInput.classList.add("error-border");
  } 
  else 
  {
    emailError.textContent = "";  //Remove error message
    emailInput.classList.remove("error-border");
  }

  checkFormValidity();
}



function validateConfirmEmail() 
{
  const emailInput = document.getElementById("email");
  const confirmEmailInput = document.getElementById("confirm-email");
  const confirmEmailError = document.getElementById("confirmEmailError");
  const confirmEmailValue = confirmEmailInput.value.trim();


  //Checking if the confirm email matches the value of the email that the user entered before
  if (confirmEmailValue !== emailInput.value.trim()) 
  {
    confirmEmailError.textContent = "Emails do not match";  //Displaying error message
    confirmEmailInput.classList.add("error-border");
  } 
  else 
  {
    confirmEmailError.textContent = "";  //Removing error message
    confirmEmailInput.classList.remove("error-border");
  }

  checkFormValidity();
}


//Implementing a function to the "Continue with purchase" button
const continueButton = document.getElementById("continue");

function checkFormValidity() 
{
  const fullNameInput = document.getElementById("fName");
  const mobileInput = document.getElementById("telNo");
  const emailInput = document.getElementById("email");
  const confirmEmailInput = document.getElementById("confirm-email");
  const continueButton = document.getElementById("continue");

  // Check if all fields are valid
  const fullNameValid = fullNameInput.value.trim() !== "";
  const mobileValid = iti.isValidNumber();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  const confirmEmailValid = confirmEmailInput.value.trim() === emailInput.value.trim();

  // Enable/disable the "Continue with purchase" button
  if (fullNameValid && mobileValid && emailValid && confirmEmailValid) 
  {
    continueButton.removeAttribute("disabled");
  } 
  else 
  {
    continueButton.setAttribute("disabled", "disabled");
  }
}


//Function to check form validity
function isFormValid() {
  const fullNameInput = document.getElementById("fName");
  const mobileInput = document.getElementById("telNo");
  const emailInput = document.getElementById("email");
  const confirmEmailInput = document.getElementById("confirm-email");

  const fullNameValid = fullNameInput.value.trim() !== "";
  const mobileValid = iti.isValidNumber();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  const confirmEmailValid = confirmEmailInput.value.trim() === emailInput.value.trim();

  // Update error messages based on validation
  if (!fullNameValid) 
  {
    validateFullName();
  }
  if (!mobileValid) 
  {
    validateMobile();
  }
  if (!emailValid) 
  {
    validateEmail();
  }
  if (!confirmEmailValid) 
  {
    validateConfirmEmail();
  }

  // Return the overall validity of the form
  return fullNameValid && mobileValid && emailValid && confirmEmailValid;
}
