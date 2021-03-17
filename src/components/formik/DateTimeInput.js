import { useEffect } from "react";
import { Form, Formik, Field, useField } from "formik";
import { months } from "../../utils/constants";

// Custom time input element
export const TimeInput = ({ label, ...props }) => {
  const [field] = useField(props);

  return (
    <div className="form__group">
      <label className="form__label" htmlFor={props.id || props.name}>
        {label}
      </label>

      <input type="time" className="form__input border" {...props} {...field} />
    </div>
  );
};

// Custom date input element
export const DateInput = () => {
  /* 
    The `day` and `year` values are dynamically generated 
    depending on the currently selected month and year, 
    and the current year
  */

  useEffect(() => {
    // Define variables
    let yearSelect = document.querySelector("#year");
    let monthSelect = document.querySelector("#month");
    let daySelect = document.querySelector("#day");
    let previousDay;

    // populate the days and years dynamically
    // (the months are always the same, therefore hardcoded)
    populateDays(monthSelect.value);
    populateYears();

    function populateDays(month) {
      // delete the current set of <option> elements out of the
      // day <select>, ready for the next set to be injected
      while (daySelect.firstChild) {
        daySelect.removeChild(daySelect.firstChild);
      }

      // Create variable to hold new number of days to inject
      let dayNum;

      // 31 or 30 days?
      if (
        (month === months.jan) |
        (month === months.mar) |
        (month === months.may) |
        (month === months.jul) |
        (month === months.aug) |
        (month === months.oct) |
        (month === months.dec)
      ) {
        dayNum = 31;
      } else if (
        (month === months.apr) |
        (month === months.jun) |
        (month === months.sep) |
        (month === months.nov)
      ) {
        dayNum = 30;
      } else {
        // If month is February, calculate whether it is a leap year or not
        let year = yearSelect.value;
        let isLeap = new Date(year, 1, 29).getMonth() === 1;
        isLeap ? (dayNum = 29) : (dayNum = 28);
      }

      // inject the right number of new <option> elements into the day <select>
      for (let i = 1; i <= dayNum; i++) {
        let option = document.createElement("option");
        option.textContent = i;
        daySelect.appendChild(option);
      }

      // if previous day has already been set, set daySelect's value
      // to that day, to avoid the day jumping back to 1 when you
      // change the year
      if (previousDay) {
        daySelect.value = previousDay;

        // If the previous day was set to a high number, say 31, and then
        // you chose a month with less total days in it (e.g. February),
        // this part of the code ensures that the highest day available
        // is selected, rather than showing a blank daySelect
        if (daySelect.value === "") daySelect.value = previousDay - 1;

        if (daySelect.value === "") daySelect.value = previousDay - 2;

        if (daySelect.value === "") daySelect.value = previousDay - 3;
      }
    }

    function populateYears() {
      // Clear the innerHtml before clearing
      yearSelect.innerHTML = null;

      // get this year as a number
      const year = new Date().getFullYear();

      // Make this year, and the next 5 years available in the year <select>
      for (let i = 0; i < 5; i++) {
        let option = document.createElement("option");
        option.textContent = year + i;
        yearSelect.appendChild(option);
      }
    }

    // when the month or year <select> values are changed, rerun populateDays()
    // in case the change affected the number of available days
    yearSelect.onchange = () => populateDays(monthSelect.value);
    monthSelect.onchange = () => populateDays(monthSelect.value);

    // update what day has been set to previously
    // see end of populateDays() for usage
    daySelect.onchange = () => (previousDay = daySelect.value);
  });

  return (
    <>
      <Formik
        initialValues={{
          day: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        }}
      >
        <Form>
          {/* Day input */}
          <label className="form__label" htmlFor="day">
            Day{" "}
          </label>
          <Field
            name="day"
            id="day"
            as="select"
            className="form__input bg--white"
          />

          {/* Month input */}
          <label className="form__label" htmlFor="month">
            Month{" "}
          </label>
          <Field
            name="month"
            id="month"
            as="select"
            className="form__input bg--white"
          >
            {Object.values(months).map((month) => (
              <option key={month}>{month}</option>
            ))}
          </Field>

          {/* Year input */}
          <label className="form__label" htmlFor="year">
            Year{" "}
          </label>
          <Field
            name="year"
            id="year"
            as="select"
            className="form__input bg--white"
          ></Field>
        </Form>
      </Formik>
    </>
  );
};
