app = {};

// Array to store relevant indicator objects
app.indicatorObjects = [
  {
    id: "SP.POP.TOTL",
    name: "Total Population",
    tag: "population",
    value: "Population",
    checked: true,
  },

  {
    id: "SP.POP.TOTL.FE.IN",
    name: "Female Total Population",
    tag: "population_fem",
    value: "Population (F)",
    checked: true,
  },

  {
    id: "SP.POP.TOTL.MA.IN",
    name: "Male Total Population",
    tag: "population_male",
    value: "Population (M)",
    checked: true,
  },

  {
    id: "NY.GDP.MKTP.CD",
    name: "GDP (current, $US)",
    tag: "gdp",
    value: "GDP (USD)",
    checked: true,
  },

  {
    id: "NY.GDP.MKTP.KD.ZG",
    name: "GDP growth (annual %)",
    tag: "gdp-growth",
    value: "GDP growth",
    checked: true,
  },

  {
    id: "SP.DYN.LE00.IN",
    name: "Life expectancy at birth, total",
    tag: "life-expectancy",
    value: "Life exp.",
    checked: true,
  },

  {
    id: "5.51.01.01.poverty",
    name: "Income Poverty",
    tag: "poverty",
    value: "Income poverty",
    checked: true,
  },

  // {
  //   id: "EN.ATM.CO2E.KT",
  //   name: "CO2 emissions (kt)",
  //   tag: "co2",
  //   value: "CO2 emissions (kt)",
  //   checked: true,
  // },

  {
    id: "UIS.E.4",
    name: "Enrolment in Post-Secondary Education (both sexes)",
    tag: "education_ps",
    value: "Enrolment (post-sec)",
    checked: true,
  },

  {
    id: "UIS.E.3.GPV",
    name: "Enrolment in Secondary Education",
    tag: "education_sec",
    value: "Enrolment (sec)",
    checked: true,
  },
  {
    id: "SE.TOT.ENRR",
    name: "Gross enrolment ratio, primary school to tertiary (both sexes %)",
    tag: "education_prim",
    value: "Enrolment (prim)",
    checked: true,
  },

  {
    id: "SL.EMP.TOTL.SP.FE.NE.ZS",
    name: "Employment to population ratio, 15+, female (%)",
    tag: "employment_fem",
    value: "Employment (F)",
    checked: true,
  },

  {
    id: "SL.EMP.TOTL.SP.MA.NE.ZS",
    name: "Employment to population ratio, 15+, male (%)",
    tag: "employment_male",
    value: "Employment (M)",
    checked: true,
  },
];

// Function to prepare value for DOM
app.prepareForDOM = (tag, num) => {
  let value = num; 
  // If indicator value is null or undefined, set value to 'N/A'
  if (num == null || num == undefined) {
    value = `N/A`;
  // If indicator is for any population value, set value to the indicator value divided by 1mil, rounded to 2 decimal points, and with "m" appended to the end
  } else if (tag === 'population' || tag === 'population_fem' || tag === 'population_male') {
    value = `${(((num / 1000000) * 100) / 100).toFixed(2)}m`;
  // If indicator is for GDP and value is greater than 1 trillion, set value to the indicator value divided by 1 trillion, rounded to 2 decimal points, and with "t" appended to the end
  } else if (tag === 'gdp' && num > 1000000000000) {
    value = `$${(((num / 1000000000000) * 100) / 100).toFixed(2)}t`;
  // If indicator is for GDP and value is greater than 1 billion, set value to the indicator value divided by 1 billion, rounded to 2 decimal points, and with "b" appended to the end
  } else if (tag === 'gdp' && num > 1000000000) {
    value = `$${(((num / 1000000000) * 100) / 100).toFixed(2)}b`;
  // If indicator is for GDP and value is less than 1 billion, set value to the indicator value divided by 1 million, rounded to 2 decimal points, and with "m" appended to the end
  } else if (tag === 'gdp') {
    value = `$${(((num / 1000000) * 100) / 100).toFixed(2)}m`;
  // If indicator is for secondary or post-sec education  and value is greater than 1 million, set value to the indicator value divided by 1 million, rounded to 2 decimal points, and with "m" appended to the end
  } else if (tag === 'education_ps' && num > 10000 || tag === 'education_sec' && num > 10000) {
    value = `${(((num / 1000000) * 100) / 100).toFixed(2)}m`;
  // If indicator is for secondary or post-sec education and value is less than 1 million, set value to the indicator value
  } else if (tag === 'education_ps' && num < 1000000 || tag === 'education_sec' && num < 1000000) {
    value = `${(num).toFixed(2)}`;
  // If indicator is for GDP growth, primary education or M/F employment or, set value to the indicator value with "%" added at the end
  } else if (tag === 'gdp-growth' || tag === 'education_prim' || tag === 'employment_fem' || tag === 'employment_male') {
    value = `${(num).toFixed(2)}%`;
  // If indicator is for life expectancy, set value to the indicator value with "years" added at the end
  } else if (tag === 'life-expectancy') {
    value = `${(num).toFixed(1)} years`;
  } else {
    value = `${(num).toFixed(2)}`;
  }
  // Return final indicator value
  return value;
}

// Function to calculate difference between two values
app.calculateComparisonDiff = (userVal, hoveredVal, indicatorTag) => {
  console.log(indicatorTag, userVal, hoveredVal);
  // Initialize variable for value
  let value;
  // If both numerical values are null, or the second (hovered country) value is null, set the value to an empty string
  if (userVal == null && hoveredVal == null || hoveredVal == null) {
    value = '';
  // If only the user value is null, set the comparison value to 'N/A'
  } else if (userVal == null) {
    value = 'N/A';
  // If the indicator tag is population/male or female pop, or education post-sec/sec & val is over 10000, set the comparison value to the hovered country minus user country, divided by 1 mil
  } else if (indicatorTag === 'population' || indicatorTag === 'population_fem' || indicatorTag === 'population_male' || (indicatorTag === 'education_ps' && (Math.abs(hoveredVal - userVal) > 10000)) || (indicatorTag === 'education_sec' && (Math.abs(hoveredVal - userVal) > 10000))) {
    value = (hoveredVal - userVal)/1000000;
  // If the indicator tag is anything else, set the comparison value to the hovered value minus the user value
  } else if (indicatorTag === 'gdp' || indicatorTag === 'gdp-growth' || indicatorTag === 'education_prim' || indicatorTag === 'employment_fem' || indicatorTag === 'employment_male' || indicatorTag === 'life-expectancy' || indicatorTag === 'poverty' || indicatorTag === 'education_ps' || indicatorTag === 'education_sec') {
    value = hoveredVal - userVal;
  }
  console.log('value', value);
  return value;
}

// Function to convert numerical comparison value to string with '+' or '-' in front, rounded to 2 decimal places
app.positiveOrNegative = (value, indicatorTag) => {
  // Initialize value to store string
  let stringValue;

  // If comparison value is positive and for life expectancy, add "+" to front of string and round to 1 decimal point
  if (value > 0 && indicatorTag === 'life-expectancy') {
    stringValue = `+${value.toFixed(1)}`;
  // Else if comparison value is greater than 1tril and for GDP, add "+$" to front of string, divide by 1 tril and round to 2 decimal points
  } else if (value > 1000000000000 && indicatorTag === 'gdp') {
    stringValue = `+$${(((value / 1000000000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is greater than 1bil and for GDP, add "+$" to front of string, divide by 1 bil and round to 2 decimal points
  } else if (value > 1000000000 && indicatorTag === 'gdp') {
    stringValue = `+$${(((value / 1000000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is greater than 1mil and for GDP, add "+$" to front of string, divide by 1 mil and round to 2 decimal points
  } else if (value > 1000000 && indicatorTag === 'gdp') {
    stringValue = `+$${(((value / 1000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is less than than -1tril and for GDP, add "-$" to front of string, divide by 1 tril and round to 2 decimal points
  } else if (value < -1000000000000 && indicatorTag === 'gdp') {
    stringValue = `-$${(((Math.abs(value) / 1000000000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is less than than -1bil and for GDP, add "-$" to front of string, divide by 1 bil and round to 2 decimal points
  } else if (value < -1000000000 && indicatorTag === 'gdp') {
    stringValue = `-$${(((Math.abs(value) / 1000000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is less than than -mil and for GDP, add "-$" to front of string, divide by 1 mil and round to 2 decimal points
  } else if (value < -1000000 && indicatorTag === 'gdp') {
    stringValue = `-$${(((Math.abs(value) / 1000000) * 100) / 100).toFixed(2)}`;
  // Else if comparison value is greater than 0, add "+" to front of string and round to 2 decimal points
  } else if (value > 0) {
    stringValue = `+${value.toFixed(2)}`;
  // Else if comparison value is less than 0 and for life expectancy, add "-" to front of string and round to 1 decimal point
  } else if (value < 0 && indicatorTag === 'life-expectancy') {
    stringValue = `${value.toFixed(1)}`;
  // Else if comparison value is less than 0 and for GDP, add "-$" to front of string and round to 2 decimal points
  } else if (value < 0 && indicatorTag === 'gdp') {
    stringValue = `-$${value.toFixed(2)}`;
  // Else if comparison value is less than 0, round to 2 decimal points
  } else if (value < 0) {
    stringValue = `${value.toFixed(2)}`;
  // Else if comparison value is equal to 0, set value to "equal"
  } else if (value === 0) {
    stringValue = 'equal';
  // Else leave comparison value as its initial value (will run for "" and "N/A" options)
  } else {
    stringValue = value;
  }

  // Return final string value
  return stringValue;
}
// Function to convert comparison value to string for display on DOM
app.prepComparisonForDOM = (value, indicatorTag) => {
  // Run string value through positive/negative function
  let stringValue = app.positiveOrNegative(value, indicatorTag);

  // If string value is 'N/A', empty, or 'equal', leave it as its original value
  if (stringValue === 'N/A' || stringValue === '' || stringValue === 'equal') {
    stringValue = stringValue;
  // Else if string value is for GDP and its absolute value is over 1 tril, add "t" at end
  } else if (indicatorTag === 'gdp' && Math.abs(value) > 1000000000000) {
    stringValue = `${stringValue}t`;
  // Else if string value is for GDP and its absolute value is over 1 bil, add "b" at end
  } else if (indicatorTag === 'gdp' && Math.abs(value) > 1000000000) {
    stringValue = `${stringValue}b`;
  // Else if string value is for GDP and its absolute value is less than 1 bil, add "m" at end
  } else if (indicatorTag === 'gdp') {
    stringValue = `${stringValue}m`;
  // Else if string value is for population/female or male pop, add "m" at the end
  } else if (indicatorTag === 'population' || indicatorTag === 'population_fem' || indicatorTag === 'population_male' || (indicatorTag === 'education_sec' && Math.abs(value) > 0.01) || (indicatorTag === 'education_ps' && Math.abs(value) > 0.01)) {
    stringValue = `${stringValue}m`
  // Else if string value is for GDP, prim education, or employment values, add "%" at the end
  } else if (indicatorTag === 'gdp-growth' || indicatorTag === 'education_prim' || indicatorTag === 'employment_fem' || indicatorTag === 'employment_male') {
    stringValue = `${stringValue}%`
  // Else if string value is for life expectancy, add "years" at the end
  } else if (indicatorTag === 'life-expectancy') {
    stringValue = `${stringValue} years`
  // Else if string value is for any other indicator, leave as is
  } else {
    stringValue = stringValue;
  }

  // Return final comparison string value result
  return stringValue;
}

app.comparisonColor = (value) => {
  let color;
  // If value is positive, set color of number on DOM to green
  if (value >= 0) {
    color = '#8AD137';
  // If value is negative, set color of number on DOM to red
  } else if (value < 0) {
    color = '#EF2929';
  // For any other instance, set color to light gray
  } else {
    color = 'rgba(255, 255, 255, 0.35)';
  }
  return color;
}

app.displayParameterValues = (modalID, countryID, booleanForComparison) => {
  // Loop through all indicator objects
  app.indicatorObjects.forEach(function (item) {
    // Grab indicator ID from array
    const indicatorID = item.id;

    // Grab indicator tag from array
    const indicatorTag = item.tag;

    // Grab value of indicator for chosen country from app.countryData object
    let countryIndicatorVal = app.countryData[countryID][indicatorID];

    const indicatorValueForDOM = app.prepareForDOM(indicatorTag, countryIndicatorVal);

  if (booleanForComparison === true && app.userCountryObject !== null) {
    // Initialize user country value
    let userCountryIndicatorVal = app.countryData[app.userCountryID][indicatorID];

    // Calculate difference between two countries for indicator and store in variable
    const comparisonValue = app.calculateComparisonDiff(userCountryIndicatorVal, countryIndicatorVal, indicatorTag);

    // Convert comparison value to string for appending to DOM
    const comparisonValueForDOM = app.prepComparisonForDOM(comparisonValue, indicatorTag);
    // console.log('indicator tag', indicatorTag, 'comp val', comparisonValueForDOM, 'type', typeof (comparisonValueForDOM), 'num type', typeof (parseInt(comparisonValueForDOM)));

    // Find indicator location in DOM and fill with data
    const indicatorHTML = `<span class="parameter-num ${indicatorTag}">${indicatorValueForDOM}</span> <span class="parameter-perc ${indicatorTag}">${comparisonValueForDOM}</span>`;

    $(`.parameter-value.${indicatorTag}`).append(indicatorHTML);

    const comparisonColor = app.comparisonColor(comparisonValue, indicatorTag);
    $(`.parameter-perc.${indicatorTag}`).css('color', comparisonColor);

  } else if (booleanForComparison === true && app.userCountryObject === null){
    // const comparisonValueForDOM = 'N/A';
    const comparisonValueForDOM = 'N/A';

    // Find indicator location in DOM and fill with data
    const indicatorHTML = `<span class="parameter-num ${indicatorTag}">${indicatorValueForDOM}</span> <span class="parameter-perc ${indicatorTag} no-display">${comparisonValueForDOM}</span>`;

    $(`.parameter-value.${indicatorTag}`).append(indicatorHTML);
  } else if (booleanForComparison === false) {

    // Find indicator location in DOM and fill with data
    const indicatorHTML = `<span class="parameter-num--secondary ${indicatorTag}">${indicatorValueForDOM}</span>`;

    $(`.parameter-value--secondary.${indicatorTag}`).append(indicatorHTML);
  }
  })
}

