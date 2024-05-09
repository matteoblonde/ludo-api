/**
 * Converts the given date to a formatted string representation.
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} The formatted date string in the format "DD/MM/YYYY HH:MM".
 */
export const dateTimeConverter = (date: any): string => {

  /** Extract single date value form the date */
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  /** Return the final date */
  return day + '/' + month + '/' + year + ' ' + hour + ':' + minutes;

};

/**
 * Converts a given date to the format 'dd/mm/yyyy'.
 *
 * @param {any} date - The input date object.
 * @returns {string} The converted date string.
 */
export const dateConverter = (date: any): string => {

  /** Extract single date value form the date */
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  /** Return the final date */
  return day + '/' + month + '/' + year;

};

/**
 * Rounds the given date to the nearest quarter.
 *
 * @param {any} date - The input date to be rounded.
 * @returns {Date} - The rounded date object.
 */
export const roundDateToNearestQuarter = (date?: any): Date => {

  let startDate = !date ? () => new Date() : date;

  const minutes = startDate.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;

  if (roundedMinutes === 60) {
    startDate.setHours(startDate.getHours() + 1);
    startDate.setMinutes(0);
  }
  else {
    startDate.setMinutes(roundedMinutes);
  }

  return startDate;
};
