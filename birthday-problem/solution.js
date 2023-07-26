const holidays = [
  "Sat Aug 26 2023",
  "Fri Aug 11 2023",
  "Sat Aug 19 2023",
  "Thu Aug 10 2023",
  "Wed Aug 09 2023",
  "Tue Aug 08 2023",
  "Mon Aug 07 2023",
];

const datesArray = [
  new Date("2023-08-09"),
  new Date("2023-08-10"),
  new Date("2023-08-12"),
  new Date("2023-08-14"),
  new Date("2023-08-16"),
  new Date("2023-08-18"),
  new Date("2023-08-05"),
  new Date("2023-09-10"),
  new Date("2023-09-01"),
  new Date("2023-09-24"),
  new Date("2023-09-28"),
  new Date("2023-09-06"),
  new Date("2023-09-18"),
  new Date("2023-09-05"),
  new Date("2023-10-19"),
  new Date("2023-10-31"),
  new Date("2023-10-12"),
  new Date("2023-10-24"),
  new Date("2023-10-07"),
  new Date("2023-10-30"),
  new Date("2023-10-05"),
];

let nextWorkingDayNotFound = false;

function isSecondSaturday(givenDate) {
  const date = new Date(givenDate);
  if (date.getDay() !== 6) {
    return false;
  }

  const day = date.getDate();
  const month = date.getMonth();

  for (let m = 0; m < 12; m++) {
    const firstDayOfMonth = new Date(date.getFullYear(), m, 1);

    const firstDayOfWeek = firstDayOfMonth.getDay();

    let daysOffset = 6 - firstDayOfWeek + 7;

    if (firstDayOfWeek === 6) {
      daysOffset = 7;
    }

    const secondSaturday = new Date(date.getFullYear(), m, 1 + daysOffset);

    if (
      secondSaturday.getDate() === day &&
      secondSaturday.getMonth() === month
    ) {
      return true;
    }
  }

  return false;
}

const findLastWorkingDayOfTheWeek = (date, holidays) => {
  const givenDate = new Date(date);

  let daysToBeAdded;
  if (givenDate.getDay() === 0) {
    daysToBeAdded = 6;
  } else if (givenDate.getDay() === 1) {
    daysToBeAdded = 5;
  } else if (givenDate.getDay() === 2) {
    daysToBeAdded = 4;
  } else if (givenDate.getDay() === 3) {
    daysToBeAdded = 3;
  } else if (givenDate.getDay() === 4) {
    daysToBeAdded = 2;
  } else if (givenDate.getDay() === 5) {
    daysToBeAdded = 1;
  } else {
    daysToBeAdded = 0;
  }

  givenDate.setDate(givenDate.getDate() + daysToBeAdded);
  while (
    holidays.includes(givenDate.toDateString()) ||
    isSecondSaturday(givenDate)
  ) {
    givenDate.setDate(givenDate.getDate() - 1);
  }

  if (givenDate.getDay() === 0) {
    nextWorkingDayNotFound = true;
  } else {
    nextWorkingDayNotFound = false;
  }

  return givenDate;
};

function findNextWeekLastWorkingDay(date, holidays) {
  let lastworkingDay;

  lastworkingDay = findLastWorkingDayOfTheWeek(date, holidays);
  findLastWorkingDayOfTheWeek(lastworkingDay, holidays);

  while (nextWorkingDayNotFound) {
    lastworkingDay.setDate(lastworkingDay.getDate() + 7);
    findLastWorkingDayOfTheWeek(lastworkingDay, holidays);
  }

  return findLastWorkingDayOfTheWeek(lastworkingDay, holidays);
}

function groupBirthdayDatesByWeek(datesArray) {
  const groupedDates = {};

  for (const date of datesArray) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekNumber = new Date(
      year,
      month,
      date.getDate() + 3 - date.getDay()
    ).getTime();

    if (!groupedDates[weekNumber]) {
      groupedDates[weekNumber] = [];
    }

    groupedDates[weekNumber].push(date);
  }

  const groupedDatesArray = Object.values(groupedDates);

  return groupedDatesArray;
}

const groupedDatesArray = groupBirthdayDatesByWeek(datesArray);

const cakeCuttingDays = groupedDatesArray.map((birthDayWeek) => {
  const lastIndex = birthDayWeek.length - 1;
  const lastBirthDayOfTheWeek = birthDayWeek[lastIndex];

  const cakeCuttingDay = findNextWeekLastWorkingDay(
    lastBirthDayOfTheWeek,
    holidays
  );
  console.log({ cakeCuttingDay });
});
