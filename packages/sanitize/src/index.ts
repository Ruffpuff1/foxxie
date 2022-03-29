import unidecode from 'unidecode';
import latinize from 'latinize';
import removeAccents from 'remove-accents';
import { nfkc } from 'unorm';

export const sanitize = (str: string) =>
    unidecode(nfkc(latinize(removeAccents(str)))) //
        .replace(/\[\?\]/g, '')
        .replace(/[@4]/g, 'a')
        .replace(/3/g, 'e')
        .replace(/0/g, 'o');
