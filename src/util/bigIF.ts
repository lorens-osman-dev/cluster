import { Notice } from "obsidian";

const IF = {
  /*
  This method checks errors one by one. It starts with the first error. If it finds an error, it stops checking for more errors. If it doesn't find an error, it moves on to the next error.
  */
  checkOneByOne: function (errArr: [boolean, string][]) {
    errArr.forEach((err) => {
      if (err[0]) {
        throw err[1];
      }
    });
  },
  /*
  This method loops through the errors and collects the messages of the ones that match the error condition. If there are any messages, the function throws them as a single string. Otherwise, the function does nothing.
  */
  checkAll: function (errArr: [boolean, string][]) {
    const errs: string[] = [];
    let errsNumber = 0;
    errArr.forEach((err) => {
      if (err[0]) {
        errsNumber++;
        errs.push(`${errsNumber} : ${err[1]}`);
      }
    });
    if (errs.length > 0) {
      // throw all errors as a single string
      throw errs.join("\n");
    }
  },
  ELSE: function (callback: () => void) {
    try {
      callback();
    } catch (e) {
      new Notice(e, 1e4)
      console.warn('There is an Error :\n' + e);
    }
  },
};

export default IF;
