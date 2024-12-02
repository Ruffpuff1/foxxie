import { I18nFormattersService } from './I18nFormattersService';
import { StringFormattersService } from './StringExtensions';

export class FormattersService {
    /**
     * String formatting service containing methods to manipulate strings.
     */
    public string = new StringFormattersService();

    public t = new I18nFormattersService();
}
