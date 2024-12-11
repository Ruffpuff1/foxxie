import { I18nFormattersService } from './I18nFormattersService.js';
import { StringFormattersService } from './StringExtensions.js';

export class FormattersService {
	/**
	 * String formatting service containing methods to manipulate strings.
	 */
	public string = new StringFormattersService();

	public t = new I18nFormattersService();
}
