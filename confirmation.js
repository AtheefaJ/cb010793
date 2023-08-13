document.addEventListener("DOMContentLoaded", function () 
{
  //Calling the function to update the summary table
  updateSummaryTable();
});


//Function to retrieve data from the local storage and update and display the summary table
function updateSummaryTable()
{
  //Retrieve the summary data from local storage
  const summaryData = JSON.parse(localStorage.getItem("summaryData"));
  const details = JSON.parse(localStorage.getItem("formData"))
  const gender = localStorage.getItem("selectedGender");

  //Recreate the summary table using the retrieved data
  const summaryTable = document.getElementById("summary-table");  

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
      <th>Name</th>
      <td>${details.fullName}</td>
    </tr>
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
    <tr>
      <th>Mobile</th>
      <td>${details.mobileNumber}</td>
    </tr>
    <tr>
      <th>Email</th>
      <td>${details.email}</td>
    </tr>
    <tr>
      <th>Gender </th>
      <td>${gender}</td>
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
  