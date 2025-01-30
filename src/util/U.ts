import { Notice } from "obsidian";
import bigIF from "./bigIF";

export enum NewFileLocation {
  CurrentPane = 'current-pane',
  NewPane = 'new-pane',
  NewTab = 'new-tab',
}

type ErrorsString = string
/**
 * Validates a list of conditions and returns either `true` if all conditions pass,
 * or a formatted string containing all error messages if any condition fails.
 *
 * @param conditions - An array of tuples where each tuple contains:
 *                      - Any condition that you put in an `if()` statement to be evaluated.
 *                     - A string describing the error message for the condition if evaluated to `false`.
 * @returns `true` if all conditions pass, or a string with concatenated error messages otherwise.
 * @example
 * ```typescript
 * const result = IF([
 *   [5 > 10, "First condition message"], // false
 *   [8 === 8, "Second condition message"],     // true
 *   ["hello" === "wo", "Third condition message"], // false
 * ]);
 *
 * console.log(result);
 * // Output:
 * // 1: First condition message
 * // 2: third condition message
 * ```
 */
function IF(conditions: [boolean, string][]): true | ErrorsString {
  const errs: string[] = [];
  let errsNumber = 0;
  conditions.forEach((condition) => {
    if (condition[0]) {//condition itself is array [0] means first item
      errsNumber++;
      errs.push(`${errsNumber} : ${condition[1]}`);
    }
  });
  if (errs.length > 0) {
    // throw all errors as a single string
    return errs.join("\n");
  }
  return true
}
function createErrorMessage(source: string, message: string): void {
  const errorMessage = `Error in ${source}: ${message}`;
  new Notice(errorMessage, 10000);
  console.warn(errorMessage);
}
const U = {
  IF, NewFileLocation, createErrorMessage, bigIF
};

export default U;
