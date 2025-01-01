import unidecode from "unidecode";
import latinize from "latinize";
import removeAccents from "remove-accents";
import { clean } from "confusables";

export function sanitize(str: string) {
  return clean(
    unidecode(latinize(removeAccents(str)))
      .replace(/\[\?\]/g, "")
      .replace(/[@4]/g, "a")
      .replace(/3/g, "e")
      .replace(/0/g, "o")
  );
}
