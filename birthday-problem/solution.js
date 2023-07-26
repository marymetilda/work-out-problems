const holidays = ["Sat Aug 26 2023", "Fri Aug 11 2023", "Sat Aug 19 2023"];

const datesArray = [
  new Date("2023-08-09"),
  new Date("2023-08-10"),
  new Date("2023-08-12"),
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

function findLastWorkingDayOfTheWeek(date, holidays) {
  const givenDate = new Date(date);
  const givenDay = givenDate.getDay();
  const daysToBeAdded = 6 - givenDay;

  givenDate.setDate(givenDate.getDate() + daysToBeAdded);

  while (
    holidays.includes(givenDate.toDateString()) ||
    isSecondSaturday(givenDate)
  ) {
    givenDate.setDate(givenDate.getDate() - 1);
  }

  nextWorkingDayNotFound = givenDate.getDay() === 0;

  return givenDate;
}

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
      date.getDate() - date.getDay()
    ).getTime();

    if (!groupedDates[weekNumber]) {
      groupedDates[weekNumber] = [];
    }

    groupedDates[weekNumber].push(date);
  }
  return Object.values(groupedDates);
}

const cakeCuttingDays = groupBirthdayDatesByWeek(datesArray).map(
  (birthDayWeek) => {
    const lastIndex = birthDayWeek.length - 1;
    const lastBirthDayOfTheWeek = birthDayWeek[lastIndex];
    return findNextWeekLastWorkingDay(lastBirthDayOfTheWeek, holidays);
  }
);

console.log(cakeCuttingDays);
