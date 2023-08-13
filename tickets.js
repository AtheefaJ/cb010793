document.addEventListener("DOMContentLoaded", function () 
{
    //Calling the selection functions when the page loads
    setupDateSelection();
    setupGuestSelection();
    setupDurationSelection();

    //Initial update of the summmary table 
    updateSummaryTable(); 

    //Calling the updateSummaryTable function whenever there's a change in the user inputs
    document.getElementById("calendar-grid").addEventListener("click", updateSummaryTable);
    document.querySelectorAll(".guest-selection .input-box").forEach(box => {
        const input = box.querySelector("input");
        box.querySelector("input").addEventListener("input", updateSummaryTable);
        box.querySelector(".add").addEventListener("click", updateSummaryTable);
        box.querySelector(".deduct").addEventListener("click", updateSummaryTable);
    });
    document.getElementById("duration").addEventListener("change", updateSummaryTable);
});



//Date selection section
function setupDateSelection()
{
    //Getting references to the elements
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYearElement = document.getElementById("month-year");
    const selectedDateElement = document.getElementById("selected-date");
    const messageElement = document.getElementById("date-message");
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    //Clearing the local storage when the page is refreshed
    localStorage.removeItem("selectedDate");

    //Function to update the calendar
    function updateCalendar() 
    {
        calendarGrid.innerHTML = "";
        
        //Calculating the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        //Calculating the last day of the month
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        //Updating the month and year display
        monthYearElement.textContent = new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric"
        });
        
        //Creating the calendar grid
        for (let i = 0; i < firstDay; i++) 
        {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("empty-day");
            calendarGrid.appendChild(emptyDay);
        }
        
        for (let day = 1; day <= lastDay; day++) 
        {
            const dateCell = document.createElement("div");
            dateCell.classList.add("date-cell");
            dateCell.textContent = day;
            const cellDate = new Date(currentYear, currentMonth, day);

            //Disabling the dates before the current date
            if (cellDate < currentDate)
            {
                dateCell.classList.add("disabled");
                dateCell.addEventListener("click", () => {
                    //Displaying an error message to the user if they click on a date before the current date
                    messageElement.textContent = "You cannot select a date earlier than the current date. Please select a different date.";
                });
            }
            else 
            {
                dateCell.addEventListener("click", () => {
                    //Clear previous selected date when the user selects a new date
                    const prevSelected = document.querySelector(".selected");
                    if (prevSelected) 
                    {
                        prevSelected.classList.remove("selected");
                    }

                    //Clearing the error message
                    messageElement.textContent = "";
                    
                    //Highlighting the selected date in the calendar
                    dateCell.classList.add("selected");
                    
                    //Updating the selected date display
                    const selectedDate = new Date(currentYear, currentMonth, day);
                    selectedDateElement.textContent = selectedDate.toLocaleDateString();

                    //Formatting the selected date as "M/D/YYYY" format
                    const formattedSelectedDate = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;

                    //Storing the selected date in the local storage
                    localStorage.setItem("selectedDate", formattedSelectedDate);
                });
            }
            calendarGrid.appendChild(dateCell);
        }
    }
    
    //Functions for the navigation buttons of the calendar
    function navigateMonth(direction) 
    {
        if (direction === "prev") 
        {
            currentMonth--;
            if (currentMonth < 0) 
            {
                currentMonth = 11;
                currentYear--;
            }
        } 
        else if (direction === "next") 
        {
            currentMonth++;
            if (currentMonth > 11) 
            {
                currentMonth = 0;
                currentYear++;
            }
        }
        updateCalendar();
    }
    
    //Restoring the selected date from the local storage
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) 
    {
        const selected = new Date(storedDate);
        currentMonth = selected.getMonth();
        currentYear = selected.getFullYear();

        //Updating the selected date display
        selectedDateElement.textContent = selected.toLocaleDateString();
    }
    else
    {
        //Setting the default selected date to the current date
        const defaultDate = new Date();
        selectedDateElement.textContent = defaultDate.toLocaleDateString();

        //Formatting the default date as "M/D/YYYY" format
        const formattedDefaultDate = `${defaultDate.getMonth() + 1}/${defaultDate.getDate()}/${defaultDate.getFullYear()}`;

        //Storing the default date in the local storage
        localStorage.setItem("selectedDate", formattedDefaultDate);
    }

    //Initial update of the calendar
    updateCalendar();

    //Adding event listeners for navigation buttons of the calendar
    document.getElementById("prev-month").addEventListener("click", () => navigateMonth("prev"));
    document.getElementById("next-month").addEventListener("click", () => navigateMonth("next"));
}



//Guest selection section
function setupGuestSelection()
{
    //Getting references to the elements
    const guestBoxes = document.querySelectorAll(".guest-selection .input-box");
    const defaultGuestCounts = {
        "SL Adult": 0,
        "SL Child": 0,
        "Foreigner Adult": 1, //Default value is set to 1
        "Foreigner Child": 0,
        "Infant": 0
    };

    const guestCounts = defaultGuestCounts;

    //Clearing the local storage when the page is refreshed
    localStorage.removeItem("guestCounts");

    guestBoxes.forEach(box => {
        const guestType = box.querySelector("label").textContent.trim();
        const input = box.querySelector("input");

        //Initialize guest count
        guestCounts[guestType] = parseInt(input.value) || guestCounts[guestType];
        input.value = guestCounts[guestType];;

        //Event listeners for the + and - buttons in front of the guest types
        box.querySelector(".add").addEventListener("click", () => {
            guestCounts[guestType]++;
            input.value = guestCounts[guestType];
            saveGuestCountsToLocalStorage();
        });

        box.querySelector(".deduct").addEventListener("click", () => {
            if (guestCounts[guestType] > 0) {
                guestCounts[guestType]--;
                input.value = guestCounts[guestType];
                saveGuestCountsToLocalStorage();
            }
        });
    });

    //Function to save the guest counts to local storage
    function saveGuestCountsToLocalStorage() 
    {
        localStorage.setItem("guestCounts", JSON.stringify(guestCounts));
    }

    //Function to load the guest counts from local storage
    function loadGuestCountsFromLocalStorage() 
    {
        const storedGuestCounts = localStorage.getItem("guestCounts");
        if (storedGuestCounts) 
        {
            Object.assign(guestCounts, JSON.parse(storedGuestCounts));
            for (const guestType in guestCounts) 
            {
                const input = document.querySelector(`.guest-selection input#${guestType.replace(/ /g, "")}`);
                if (input) 
                {
                    input.value = guestCounts[guestType];
                }
            }
        } 
        else
        {
            //Setting the default guest counts if not stored in local storage
            for (const guestType in guestCounts) 
            {
                guestCounts[guestType] = defaultGuestCounts[guestType];
                const input = document.querySelector(`.guest-selection input[name="${guestType}"]`);
                if (input) 
                {
                    input.value = guestCounts[guestType];
                }
            } 
            saveGuestCountsToLocalStorage();
        }
    }

    //Load guest counts from local storage when the page loads
    loadGuestCountsFromLocalStorage();
}



//Duration Selection Section
function setupDurationSelection()
{
    //Getting references to elements
    const durationSelect = document.getElementById('duration');
    const messageElement = document.getElementById("duration-message");

    //Clearing the local storage when the page refreshes
    localStorage.removeItem("selectedDurations");

    //Loading selected durations from local storage
    const defaultDuration = ["07:00-08:00"];  //Default duration
    let selectedDurations = JSON.parse(localStorage.getItem('selectedDurations'));

    if (!selectedDurations || selectedDurations.length === 0) 
    {
        selectedDurations = defaultDuration;
        localStorage.setItem('selectedDurations', JSON.stringify(selectedDurations));
    }

    //Setting the selected options in the dropdown
    selectedDurations.forEach(duration => {
        const option = durationSelect.querySelector(`option[value="${duration}"]`);
        if (option) 
        {
            option.selected = true;
        }
    });

    //Event listener for selecting the durations
    durationSelect.addEventListener('change', () => {
        const selectedOptions = Array.from(durationSelect.options)
            .filter(option => option.selected)
            .map(option => option.value);

        localStorage.setItem('selectedDurations', JSON.stringify(selectedOptions));


    //Function to validate the selection of consecutive time slots
    function isValidSelection(selectedOptions) 
    {
        if (selectedOptions.length === 1) 
        {
            return true; //Single time slot is valid
        }

        //Check if selected time slots are consecutive or not
        const timeSlots = selectedOptions.map(option => option.split('-')[0]);
        for (let i = 1; i < timeSlots.length; i++) 
        {
            const prevTime = timeSlots[i - 1];
            const currentTime = timeSlots[i];
            if (parseInt(currentTime) - parseInt(prevTime) !== 1) 
            {
                return false; //Non-consecutive time slots are not valid
            }
        }

        return true; //Consecutive time slots are valid
    }

        //Validating the selected options to ensure that the user selects consecutive time slots
        if (isValidSelection(selectedOptions)) 
        {
            //Clearing the error message
            messageElement.textContent = "";

            localStorage.setItem('selectedDurations', JSON.stringify(selectedOptions));
        }
        else
        {
            //Displaying an error message to the user and revert the selction
            messageElement.textContent = "Please select either one time slot or multiple consecutive time slots.";

            //Reverting the previously selected options
            selectedDurations.forEach(duration => {
                const option = durationSelect.querySelector(`option[value="${duration}"]`);
                if (option)
                {
                    option.selected = true;
                }
            });
        }

    }); 
}




//Calculating the charges for each guest type based on the selected duration and counts
function calculateCharges(selectedDurations, guestCounts) 
{
    const charges = {
        "Foreigner Adult": 0,
        "Foreigner Child": 0,
        "SL Adult": 0,
        "SL Child": 0
    };

    //Charge rate per normal hour
    const normalHourRate = {
        "Foreigner Adult": 10,
        "Foreigner Child": 5,
        "SL Adult": 4,
        "SL Child": 2
    };

    //Charge rate per peak hour
    const peakHourRate = {
        "Foreigner Adult": 13,
        "Foreigner Child": 8,
        "SL Adult": 6,
        "SL Child": 3
    };

    //Range of peak hours
    const peakHourRanges = [
        { start: 10, end: 13 }, 
        { start: 15, end: 18 }  
    ];


    selectedDurations.forEach(duration => {
        const [startTime, endTime] = duration.split("-");
        const hour = parseInt(startTime.split(":")[0]); // Extract the hour part

        const isPeakHour = peakHourRanges.some(range => {
            return hour >= range.start && hour < range.end;
        });


        //Calculating the charges
        for (const guestType in guestCounts) 
        {
            if (guestCounts[guestType] > 0) 
            {
                charges[guestType] +=
                    guestCounts[guestType] * (isPeakHour ? peakHourRate[guestType] : normalHourRate[guestType]);
            }
        }
    });

    return charges;
}


//Function to update the summary table
function updateSummaryTable() 
{
    //Getting references to elements
    const summaryTable = document.getElementById("summary-table");
    const selectedDurations = JSON.parse(localStorage.getItem("selectedDurations"));
    const guestCounts = JSON.parse(localStorage.getItem("guestCounts"));

    if (!selectedDurations || !guestCounts) 
    {
        return; //No data to update the summary table
    }

    const charges = calculateCharges(selectedDurations, guestCounts);
    const totalAmount = Object.keys(charges).reduce((total, guestType) => {
        if (guestType !== "Infant") 
        {
            return total + charges[guestType];
        }
        return total;
    }, 0);

    //Setting an array to store the data of the summary table
    const summaryData = {
        selectedDate: localStorage.getItem("selectedDate"),
        selectedDurations: selectedDurations,
        guestCounts: guestCounts,
        charges: charges,
        totalAmount: totalAmount.toFixed(2)
    };

    //Storing the summary table data
    localStorage.setItem("summaryData", JSON.stringify(summaryData));


    //Determing the text that should be displayed according the selection of time slots
    const durationText = selectedDurations.length === 1 ? "Duration" : "Durations";
    const durationList = selectedDurations.map(duration => {
        const [startTime, endTime] = duration.split("-");
        return `${startTime} to ${endTime}`;
    }).join(", ");

    
    //Adding rows to display the gust type and the corresponding charges 
    const guestTypeRows = Object.keys(guestCounts).map(guestType => {
        const chargeAmount = guestType === "Infant" ? "Free" : `$ ${charges[guestType].toFixed(2)}`;
        return `
            <tr>
                <td>${guestCounts[guestType]} ${guestType}</td>
                <td class="right">${chargeAmount}</td>
            </tr>
        `;
    }).join("");


    //Structure of the summary table
    summaryTable.innerHTML = `
        <tr>
            <th>Date</th>
            <td>${localStorage.getItem("selectedDate")}</td>
        </tr>
        <tr>
            <th>Time</th>
            <td>${durationList}</td>
        </tr>
        <tr>
            <th>${durationText}</th>
            <td>${selectedDurations.length} hrs</td>
        </tr>
        <tr class="highlight">
            <th>Tickets</th>
            <th>Charges</th>
        </tr>
        ${guestTypeRows}
        <tr class="highlight">
            <th>Total Payable</th>
            <td class="right" colspan="2">$ ${totalAmount.toFixed(2)}</td>
        </tr>
    `;
}

// Add an event listener for the "Continue with purchase" button
document.getElementById("continue-button").addEventListener("click", () => {
    const selectedDurations = JSON.parse(localStorage.getItem("selectedDurations"));
    const guestCounts = JSON.parse(localStorage.getItem("guestCounts"));
    const selectedDate = localStorage.getItem("selectedDate");

    if (!selectedDurations || !guestCounts || !selectedDate) {
        // Display an error message if any required data is missing
        alert("Please fill in all the required fields before proceeding.");
    } else {
        // Redirect to the details.html page
        window.location.href = "details.html";
    }
});