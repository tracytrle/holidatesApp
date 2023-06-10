const API_KEY = "79fffbf2-88b3-4767-a13a-aac3beec4640";
const countryURL = `https://holidayapi.com/v1/countries?pretty=true&key=${API_KEY}`;
const languageURL = `https://holidayapi.com/v1/languages?pretty&key=${API_KEY}`;
const holidayURL = `https://holidayapi.com/v1/holidays?pretty&key=${API_KEY}`;
let allCountriesList;
let allLanguagesList;
let allHolidaysList;
let onlyHolidayInput = false;

let showCountriesListButton = document.getElementById("countries-list-btn");
let showLanguagesListButton = document.getElementById("languages-list-btn");
let showHolidaysListButton = document.getElementById("holidays-btn");

// part1: Render Countries List
const getCountries = async () => {
  try {
    const res = await fetch(countryURL);
    const data = await res.json();
    console.log("all countries", data.countries);
    return data.countries;
  } catch (err) {
    console.log("Error: ", err);
  }
};

function createLiHtml(targetList, ulList) {
  targetList.forEach((target, index) => {
    //  create new `li for each element;
    const x = document.createElement("li");
    x.innerHTML = `
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${target.name}</div>
          <div class="li-text">Code: ${target.code}</div>
        </div>`;

    ulList.appendChild(x);
  });
}

function renderCountries() {
  // 1. find the element with id `countries-list`
  const countriesList = document.getElementById("countries-list");

  // 2. take out the ul element
  const ulCountriesList = countriesList.children[2];

  // 3. delete the sample inside `ul ` element
  ulCountriesList.innerHTML = "";

  // 4. loop throught the list of countries
  createLiHtml(allCountriesList, ulCountriesList);
}

// show countries list
showCountriesListButton.addEventListener("click", async function () {
  allCountriesList = await getCountries();
  renderCountries();
});

// Part2: Render Language List
// Function getLanguage
const getLanguages = async () => {
  try {
    const res = await fetch(languageURL);
    const languages = await res.json();

    return languages.languages;
  } catch (err) {
    console.log("Error: ", err);
  }
};

// Function renderLanguages
function renderLanguages() {
  const languagesList = document.getElementById("languages-list");
  const ulLanguagesList = languagesList.children[2];
  ulLanguagesList.innerHTML = "";
  createLiHtml(allLanguagesList, ulLanguagesList);
}

// show LanguageList
showLanguagesListButton.addEventListener("click", async function () {
  allLanguagesList = await getLanguages();
  renderLanguages();
});

// Part3:  Holidays of a country

function createHolidaysLiHtml(holidays, ulList) {
  onlyHolidayInput = checkOnlyHolidayInput();

  holidays.forEach((holiday, index) => {
    //  create new `li for each element;
    let code = holiday.country;
    let countryName = getCountryName(code);
    const x = document.createElement("li");
    if (onlyHolidayInput) {
      x.innerHTML = `
      <div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${holiday.name}</div>
        <div> ${countryName} - ${holiday.date}</div>
      </div>`;
    } else {
      x.innerHTML = `
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${holiday.name}</div>
          <div> ${holiday.weekday.date.name} - ${holiday.date}</div>
        </div>`;
    }
    ulList.appendChild(x);
  });
}

const searchHolidayByName = document.querySelector("#search-query");
const searchYear = document.querySelector("#year-query");
const searchMonth = document.querySelector("#month-query");
const searchDay = document.querySelector("#day-query");
const searchCountry = document.querySelector("#country-query");
const searchLanguageCode = document.querySelector("#language-query");

// get Holiday url
function getHolidayUrl() {
  let newUrl = "";
  if (searchHolidayByName.value && searchCountry.value) {
    newUrl += `${holidayURL}&search=${searchHolidayByName.value}&country=${searchCountry.value}&year=2022`;

    console.log("holidayurl= ", newUrl);
  } else if (searchHolidayByName.value && !searchCountry.value) {
    newUrl += `${holidayURL}&search=${searchHolidayByName.value}&year=2022`;
  } else {
    if (!searchCountry.value) {
      newUrl += `${holidayURL}&country=VN&year=2022`;
    } else {
      newUrl += `${holidayURL}&country=${searchCountry.value}&year=2022`;
    }
    if (searchYear.value) {
      newUrl = "";
      newUrl += `${holidayURL}&country=${searchCountry.value}&year=${searchYear.value}`;
    }
    if (searchMonth.value) {
      newUrl += `&month=${searchMonth.value}`;
    }
    if (searchDay.value) {
      newUrl += `&day=${searchDay.value}`;
    }
    if (searchLanguageCode.value) {
      newUrl += `&language=${searchLanguageCode.value}`;
    }
  }
  return newUrl;
}

const getHolidays = async () => {
  // console.log("=====check renderHoliday");
  try {
    const url = getHolidayUrl();
    // console.log(`url: ${url}`);

    const res = await fetch(url);
    const holidaysList = await res.json();
    // console.log(`holiday: ${holidaysList}`);
    return holidaysList.holidays;
  } catch (err) {
    console.log("Error: ", err);
  }
};

// special case: only HolidayInput
const checkOnlyHolidayInput = () => {
  return searchHolidayByName.value && !searchCountry.value;
};

function getCountryName(countryCode) {
  if (!countryCode) {
    return "Vietnam";
  }
  for (let i = 0; i < allCountriesList.length; i++) {
    // console.log("each country: ", allCountriesList[i]);
    if (allCountriesList[i].code === countryCode) {
      // console.log("get name: ", allCountriesList[i].name);
      return allCountriesList[i].name;
      break;
    }
  }
}

const title = document.getElementById("holidays-title");
function displayCountry(countryName) {
  onlyHolidayInput = checkOnlyHolidayInput();
  // console.log(onlyHolidayInput);
  if (onlyHolidayInput) {
    title.textContent = `The holiday found in below countries`;
  } else {
    title.textContent = `Holiday of ${countryName}`;
  }
}

const renderHolidays = async () => {
  try {
    let holidaysListFromApi = await getHolidays();

    const holidaysList = document.getElementById("holidays-list");

    const ulHolidaysList = holidaysList.children[1];
    // 4. delete the sample inside `ul ` element
    ulHolidaysList.innerHTML = "";
    createHolidaysLiHtml(holidaysListFromApi, ulHolidaysList);
  } catch (err) {
    console.log("Error: ", err);
  }
};

// show Render Holidays list
showHolidaysListButton.addEventListener("click", async function () {
  allCountriesList = await getCountries();
  let countryName = getCountryName(searchCountry.value);
  displayCountry(countryName);
  renderHolidays();
});
