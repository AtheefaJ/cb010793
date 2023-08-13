document.addEventListener("DOMContentLoaded", function () 
{
  //Calling the function to update the summary table
  updateSummaryTable();

  //Getting references to the interactive elements
  const form = document.querySelector("form");
  const cardNumberInput = document.getElementById("card-number");
  const expiryDateInput = document.getElementById("expiry-date");
  const cvcInput = document.getElementById("cvc/cvv");
  const nameInput = document.getElementById("name");
  const payButton = document.getElementById("payButton");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateCardNumber() && validateExpiryDate() && validateCVC() && validateName()) 
    {
      window.location.href = "confirmation.html";  // Proceed to confirmation.html
    }
  });


  cardNumberInput.addEventListener("input", function () {
    validateCardNumber();
  });

  expiryDateInput.addEventListener("input", function () {
    validateExpiryDate();
  });

  cvcInput.addEventListener("input", function () {
    validateCVC();
  });

  nameInput.addEventListener("input", function () {
    validateName();
  });

  //Function to validate the card number
  function validateCardNumber() 
  {
    //Getting references to elements
    const cardNumber = cardNumberInput.value.replace(/\s/g, "");
    const isValid = /^\d{16}$/.test(cardNumber);

    //setting the validations
    setValidationStatus(cardNumberInput, isValid, "Incomplete field!");
    return isValid;
  }

  //Function to validate the expiry date
  function validateExpiryDate() 
  {
    //Getting references to elements
    const expiryDate = expiryDateInput.value;
    const [month, year] = expiryDate.split(" / ");
    const currentDate = new Date();
    const enteredDate = new Date(`20${year}`, month - 1);
  
    let isValid = /^\d{2} \/ \d{2}$/.test(expiryDate);
    if (isValid) 
    {
      isValid = enteredDate >= currentDate;  
    }
  
    setValidationStatus(
      expiryDateInput,
      isValid,
      isValid ? "" : (enteredDate < currentDate ? "Card too old" : "Incomplete field!")
    );

    $(document).ready(function () {
      $("#expiry-date").inputmask("99/99");
    });

    return isValid;
  }
  

  //Function to check the validity of the cvc/cvv number
  function validateCVC() 
  {
    //Getting references to elements
    const cvc = cvcInput.value;

    //Setting validations
    const isValid = /^\d{3}$/.test(cvc);
    setValidationStatus(cvcInput, isValid, "Incomplete field!");
    return isValid;
  }

  //Function to check the validity of the name on card field
  function validateName() 
  {
    //Getting references to elements
    const name = nameInput.value;

    //Setting validations
    const isValid = /^[a-zA-Z\s]+$/.test(name);
    setValidationStatus(
      nameInput,
      isValid,
      isValid ? "" : "Name contains invalid characters"
    );
    return isValid;
  }

  //Function to check validations and add error messages and highlight the border
  function setValidationStatus(input, isValid, errorMessage) 
  {
    if (isValid) 
    {
      input.classList.remove("error");
      input.classList.remove("error-border"); //Remove the error-border class
      input.nextElementSibling.textContent = "";
      payButton.disabled = false;
    } 
    else 
    {
      input.classList.add("error");
      input.classList.add("error-border"); //Add the error-border class
      input.nextElementSibling.textContent = errorMessage;
      payButton.disabled = true;
    }
  }

});


//Updating and displaying the summary table
function updateSummaryTable()
{
  // Retrieve the summary data from local storage
  const summaryData = JSON.parse(localStorage.getItem("summaryData"));

  // Recreate the summary table using the retrieved data
  const summaryTable = document.getElementById("summary-table");


  //Displaying the amount that the user has to pay on the pay amount button
  const payAmount = document.getElementById('amount');
  payAmount.textContent = `$${summaryData.totalAmount}`;


  //Create an empty string to store the HTML content of rows
  let summaryTableRows = "";

  //Loop through guest types and charges in summaryData.charges
  for (const guestType in summaryData.charges) {
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
