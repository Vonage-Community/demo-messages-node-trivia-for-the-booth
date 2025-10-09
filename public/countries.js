
export const localeEnv = navigator.language;

export const resolvedLocale = localeEnv?.replace('_', '-') || 'en-US';

export const localeObj = new Intl.Locale(resolvedLocale);

export const region = localeObj.region || 'US';

export const locale = localeObj.toString();

export const countries = {
  'AC': {
    'name': 'Ascension Island',
    'flag': '🇦🇨',
    'currency': 'SHP',
  },
  'AD': {
    'name': 'Andorra',
    'flag': '🇦🇩',
    'currency': 'EUR',
    'dialCode': '+376',
  },
  'AE': {
    'name': 'United Arab Emirates',
    'flag': '🇦🇪',
    'currency': 'AED',
    'dialCode': '+971',
  },
  'AF': {
    'name': 'Afghanistan',
    'flag': '🇦🇫',
    'currency': 'AFN',
    'dialCode': '+93',
  },
  'AG': {
    'name': 'Antigua & Barbuda',
    'flag': '🇦🇬',
    'currency': 'XCD',
    'dialCode': '+1268',
  },
  'AI': {
    'name': 'Anguilla',
    'flag': '🇦🇮',
    'currency': 'XCD',
    'dialCode': '+1264',
  },
  'AL': {
    'name': 'Albania',
    'flag': '🇦🇱',
    'currency': 'ALL',
    'dialCode': '+355',
  },
  'AM': {
    'name': 'Armenia',
    'flag': '🇦🇲',
    'currency': 'AMD',
    'dialCode': '+374',
  },
  'AO': {
    'name': 'Angola',
    'flag': '🇦🇴',
    'currency': 'AOA',
    'dialCode': '+244',
  },
  'AQ': {
    'name': 'Antarctica',
    'flag': '🇦🇶',
    'currency': 'USD',
    'dialCode': '+672',
  },
  'AR': {
    'name': 'Argentina',
    'flag': '🇦🇷',
    'currency': 'ARS',
    'dialCode': '+54',
  },
  'AS': {
    'name': 'American Samoa',
    'flag': '🇦🇸',
    'currency': 'EUR',
    'dialCode': '+1684',
  },
  'AT': {
    'name': 'Austria',
    'flag': '🇦🇹',
    'currency': 'EUR',
    'dialCode': '+43',
  },
  'AU': {
    'name': 'Australia',
    'flag': '🇦🇺',
    'currency': 'AUD',
    'dialCode': '+61',
  },
  'AW': {
    'name': 'Aruba',
    'flag': '🇦🇼',
    'currency': 'AWG',
    'dialCode': '+297',
  },
  'AX': {
    'name': 'Åland Islands',
    'flag': '🇦🇽',
    'currency': 'EUR',
    'dialCode': '+358',
  },
  'AZ': {
    'name': 'Azerbaijan',
    'flag': '🇦🇿',
    'currency': 'AZN',
    'dialCode': '+994',
  },
  'BA': {
    'name': 'Bosnia & Herzegovina',
    'flag': '🇧🇦',
    'currency': 'BAM',
    'dialCode': '+387',
  },
  'BB': {
    'name': 'Barbados',
    'flag': '🇧🇧',
    'currency': 'BBD',
    'dialCode': '+1246',
  },
  'BD': {
    'name': 'Bangladesh',
    'flag': '🇧🇩',
    'currency': 'BDT',
    'dialCode': '+880',
  },
  'BE': {
    'name': 'Belgium',
    'flag': '🇧🇪',
    'currency': 'EUR',
    'dialCode': '+32',
  },
  'BF': {
    'name': 'Burkina Faso',
    'flag': '🇧🇫',
    'currency': 'XOF',
    'dialCode': '+226',
  },
  'BG': {
    'name': 'Bulgaria',
    'flag': '🇧🇬',
    'currency': 'BGN',
    'dialCode': '+359',
  },
  'BH': {
    'name': 'Bahrain',
    'flag': '🇧🇭',
    'currency': 'BHD',
    'dialCode': '+973',
  },
  'BI': {
    'name': 'Burundi',
    'flag': '🇧🇮',
    'currency': 'BIF',
    'dialCode': '+257',
  },
  'BJ': {
    'name': 'Benin',
    'flag': '🇧🇯',
    'currency': 'XOF',
    'dialCode': '+229',
  },
  'BL': {
    'name': 'St. Barthélemy',
    'flag': '🇧🇱',
    'currency': 'EUR',
    'dialCode': '+590',
  },
  'BM': {
    'name': 'Bermuda',
    'flag': '🇧🇲',
    'currency': 'BMD',
    'dialCode': '+1441',
  },
  'BN': {
    'name': 'Brunei',
    'flag': '🇧🇳',
    'currency': 'BND',
    'dialCode': '+673',
  },
  'BO': {
    'name': 'Bolivia',
    'flag': '🇧🇴',
    'currency': 'BOB',
    'dialCode': '+591',
  },
  'BQ': {
    'name': 'Caribbean Netherlands',
    'flag': '🇧🇶',
    'currency': 'EUR',
  },
  'BR': {
    'name': 'Brazil',
    'flag': '🇧🇷',
    'currency': 'BRL',
    'dialCode': '+55',
  },
  'BS': {
    'name': 'Bahamas',
    'flag': '🇧🇸',
    'currency': 'BSD',
    'dialCode': '+1242',
  },
  'BT': {
    'name': 'Bhutan',
    'flag': '🇧🇹',
    'currency': 'BTN',
    'dialCode': '+975',
  },
  'BV': {
    'name': 'Bouvet Island',
    'flag': '🇧🇻',
    'currency': 'EUR',
  },
  'BW': {
    'name': 'Botswana',
    'flag': '🇧🇼',
    'currency': 'BWP',
    'dialCode': '+267',
  },
  'BY': {
    'name': 'Belarus',
    'flag': '🇧🇾',
    'currency': 'BYN',
    'dialCode': '+375',
  },
  'BZ': {
    'name': 'Belize',
    'flag': '🇧🇿',
    'currency': 'BZD',
    'dialCode': '+501',
  },
  'CA': {
    'name': 'Canada',
    'flag': '🇨🇦',
    'currency': 'CAD',
    'dialCode': '+1',
  },
  'CC': {
    'name': 'Cocos (Keeling) Islands',
    'flag': '🇨🇨',
    'currency': 'EUR',
    'dialCode': '+61',
  },
  'CD': {
    'name': 'Congo - Kinshasa',
    'flag': '🇨🇩',
    'currency': 'CDF',
    'dialCode': '+243',
  },
  'CF': {
    'name': 'Central African Republic',
    'flag': '🇨🇫',
    'currency': 'XAF',
    'dialCode': '+236',
  },
  'CG': {
    'name': 'Congo - Brazzaville',
    'flag': '🇨🇬',
    'currency': 'XAF',
    'dialCode': '+242',
  },
  'CH': {
    'name': 'Switzerland',
    'flag': '🇨🇭',
    'currency': 'EUR',
    'dialCode': '+41',
  },
  'CI': {
    'name': 'Côte d’Ivoire',
    'flag': '🇨🇮',
    'currency': 'XOF',
    'dialCode': '+225',
  },
  'CK': {
    'name': 'Cook Islands',
    'flag': '🇨🇰',
    'currency': 'NZD',
    'dialCode': '+682',
  },
  'CL': {
    'name': 'Chile',
    'flag': '🇨🇱',
    'currency': 'CLP',
    'dialCode': '+56',
  },
  'CM': {
    'name': 'Cameroon',
    'flag': '🇨🇲',
    'currency': 'EUR',
    'dialCode': '+237',
  },
  'CN': {
    'name': 'China',
    'flag': '🇨🇳',
    'currency': 'CNY',
    'dialCode': '+86',
  },
  'CO': {
    'name': 'Colombia',
    'flag': '🇨🇴',
    'currency': 'COP',
    'dialCode': '+57',
  },
  'CP': {
    'name': 'Clipperton Island',
    'flag': '🇨🇵',
    'currency': 'EUR',
  },
  'CR': {
    'name': 'Costa Rica',
    'flag': '🇨🇷',
    'currency': 'CRC',
    'dialCode': '+506',
  },
  'CU': {
    'name': 'Cuba',
    'flag': '🇨🇺',
    'currency': 'CUP',
    'dialCode': '+53',
  },
  'CV': {
    'name': 'Cape Verde',
    'flag': '🇨🇻',
    'currency': 'EUR',
    'dialCode': '+238',
  },
  'CW': {
    'name': 'Curaçao',
    'flag': '🇨🇼',
    'currency': 'ANG',
  },
  'CX': {
    'name': 'Christmas Island',
    'flag': '🇨🇽',
    'currency': 'EUR',
    'dialCode': '+61',
  },
  'CY': {
    'name': 'Cyprus',
    'flag': '🇨🇾',
    'currency': 'EUR',
    'dialCode': '+357',
  },
  'CZ': {
    'name': 'Czechia',
    'flag': '🇨🇿',
    'currency': 'CZK',
    'dialCode': '+420',
  },
  'DE': {
    'name': 'Germany',
    'flag': '🇩🇪',
    'currency': 'EUR',
    'dialCode': '+49',
  },
  'DG': {
    'name': 'Diego Garcia',
    'flag': '🇩🇬',
    'currency': 'EUR',
  },
  'DJ': {
    'name': 'Djibouti',
    'flag': '🇩🇯',
    'currency': 'DJF',
    'dialCode': '+253',
  },
  'DK': {
    'name': 'Denmark',
    'flag': '🇩🇰',
    'currency': 'DKK',
    'dialCode': '+45',
  },
  'DM': {
    'name': 'Dominica',
    'flag': '🇩🇲',
    'currency': 'XCD',
    'dialCode': '+1767',
  },
  'DO': {
    'name': 'Dominican Republic',
    'flag': '🇩🇴',
    'currency': 'DOP',
    'dialCode': '+1849',
  },
  'DZ': {
    'name': 'Algeria',
    'flag': '🇩🇿',
    'currency': 'DZD',
    'dialCode': '+213',
  },
  'EA': {
    'name': 'Ceuta & Melilla',
    'flag': '🇪🇦',
    'currency': 'EUR',
  },
  'EC': {
    'name': 'Ecuador',
    'flag': '🇪🇨',
    'currency': 'USD',
    'dialCode': '+593',
  },
  'EE': {
    'name': 'Estonia',
    'flag': '🇪🇪',
    'currency': 'EUR',
    'dialCode': '+372',
  },
  'EG': {
    'name': 'Egypt',
    'flag': '🇪🇬',
    'currency': 'EGP',
    'dialCode': '+20',
  },
  'EH': {
    'name': 'Western Sahara',
    'flag': '🇪🇭',
    'currency': 'EUR',
  },
  'ER': {
    'name': 'Eritrea',
    'flag': '🇪🇷',
    'currency': 'ERN',
    'dialCode': '+291',
  },
  'ES': {
    'name': 'Spain',
    'flag': '🇪🇸',
    'currency': 'EUR',
    'dialCode': '+34',
  },
  'ET': {
    'name': 'Ethiopia',
    'flag': '🇪🇹',
    'currency': 'ETB',
    'dialCode': '+251',
  },
  'EU': {
    'name': 'European Union',
    'flag': '🇪🇺',
    'currency': 'EUR',
  },
  'FI': {
    'name': 'Finland',
    'flag': '🇫🇮',
    'currency': 'EUR',
    'dialCode': '+358',
  },
  'FJ': {
    'name': 'Fiji',
    'flag': '🇫🇯',
    'currency': 'FJD',
    'dialCode': '+679',
  },
  'FK': {
    'name': 'Falkland Islands',
    'flag': '🇫🇰',
    'currency': 'EUR',
    'dialCode': '+500',
  },
  'FM': {
    'name': 'Micronesia',
    'flag': '🇫🇲',
    'currency': 'EUR',
    'dialCode': '+691',
  },
  'FO': {
    'name': 'Faroe Islands',
    'flag': '🇫🇴',
    'currency': 'EUR',
    'dialCode': '+298',
  },
  'FR': {
    'name': 'France',
    'flag': '🇫🇷',
    'currency': 'EUR',
    'dialCode': '+33',
  },
  'GA': {
    'name': 'Gabon',
    'flag': '🇬🇦',
    'currency': 'XAF',
    'dialCode': '+241',
  },
  'GB': {
    'name': 'United Kingdom',
    'flag': '🇬🇧',
    'currency': 'GBP',
    'dialCode': '+44',
  },
  'GD': {
    'name': 'Grenada',
    'flag': '🇬🇩',
    'currency': 'XCD',
    'dialCode': '+1473',
  },
  'GE': {
    'name': 'Georgia',
    'flag': '🇬🇪',
    'currency': 'GEL',
    'dialCode': '+995',
  },
  'GF': {
    'name': 'French Guiana',
    'flag': '🇬🇫',
    'currency': 'EUR',
    'dialCode': '+594',
  },
  'GG': {
    'name': 'Guernsey',
    'flag': '🇬🇬',
    'currency': 'EUR',
    'dialCode': '+44',
  },
  'GH': {
    'name': 'Ghana',
    'flag': '🇬🇭',
    'currency': 'GHS',
    'dialCode': '+233',
  },
  'GI': {
    'name': 'Gibraltar',
    'flag': '🇬🇮',
    'currency': 'EUR',
    'dialCode': '+350',
  },
  'GL': {
    'name': 'Greenland',
    'flag': '🇬🇱',
    'currency': 'DKK',
    'dialCode': '+299',
  },
  'GM': {
    'name': 'Gambia',
    'flag': '🇬🇲',
    'currency': 'GMD',
    'dialCode': '+220',
  },
  'GN': {
    'name': 'Guinea',
    'flag': '🇬🇳',
    'currency': 'GNF',
    'dialCode': '+224',
  },
  'GP': {
    'name': 'Guadeloupe',
    'flag': '🇬🇵',
    'currency': 'EUR',
    'dialCode': '+590',
  },
  'GQ': {
    'name': 'Equatorial Guinea',
    'flag': '🇬🇶',
    'currency': 'XAF',
    'dialCode': '+240',
  },
  'GR': {
    'name': 'Greece',
    'flag': '🇬🇷',
    'currency': 'EUR',
    'dialCode': '+30',
  },
  'GS': {
    'name': 'South Georgia & South Sandwich Islands',
    'flag': '🇬🇸',
    'currency': 'EUR',
    'dialCode': '+500',
  },
  'GT': {
    'name': 'Guatemala',
    'flag': '🇬🇹',
    'currency': 'GTQ',
    'dialCode': '+502',
  },
  'GU': {
    'name': 'Guam',
    'flag': '🇬🇺',
    'currency': 'USD',
    'dialCode': '+1671',
  },
  'GW': {
    'name': 'Guinea-Bissau',
    'flag': '🇬🇼',
    'currency': 'XOF',
    'dialCode': '+245',
  },
  'GY': {
    'name': 'Guyana',
    'flag': '🇬🇾',
    'currency': 'GYD',
    'dialCode': '+595',
  },
  'HK': {
    'name': 'Hong Kong SAR China',
    'flag': '🇭🇰',
    'currency': 'HKD',
    'dialCode': '+852',
  },
  'HM': {
    'name': 'Heard & McDonald Islands',
    'flag': '🇭🇲',
    'currency': 'EUR',
  },
  'HN': {
    'name': 'Honduras',
    'flag': '🇭🇳',
    'currency': 'HNL',
    'dialCode': '+504',
  },
  'HR': {
    'name': 'Croatia',
    'flag': '🇭🇷',
    'currency': 'EUR',
    'dialCode': '+385',
  },
  'HT': {
    'name': 'Haiti',
    'flag': '🇭🇹',
    'currency': 'HTG',
    'dialCode': '+509',
  },
  'HU': {
    'name': 'Hungary',
    'flag': '🇭🇺',
    'currency': 'HUF',
    'dialCode': '+36',
  },
  'IC': {
    'name': 'Canary Islands',
    'flag': '🇮🇨',
    'currency': 'EUR',
  },
  'ID': {
    'name': 'Indonesia',
    'flag': '🇮🇩',
    'currency': 'IDR',
    'dialCode': '+62',
  },
  'IE': {
    'name': 'Ireland',
    'flag': '🇮🇪',
    'currency': 'EUR',
    'dialCode': '+353',
  },
  'IL': {
    'name': 'Israel',
    'flag': '🇮🇱',
    'currency': 'ILS',
    'dialCode': '+972',
  },
  'IM': {
    'name': 'Isle of Man',
    'flag': '🇮🇲',
    'currency': 'GBP',
    'dialCode': '+44',
  },
  'IN': {
    'name': 'India',
    'flag': '🇮🇳',
    'currency': 'INR',
    'dialCode': '+91',
  },
  'IO': {
    'name': 'British Indian Ocean Territory',
    'flag': '🇮🇴',
    'currency': 'USD',
    'dialCode': '+246',
  },
  'IQ': {
    'name': 'Iraq',
    'flag': '🇮🇶',
    'currency': 'IQD',
    'dialCode': '+964',
  },
  'IR': {
    'name': 'Iran',
    'flag': '🇮🇷',
    'currency': 'IRR',
    'dialCode': '+98',
  },
  'IS': {
    'name': 'Iceland',
    'flag': '🇮🇸',
    'currency': 'ISK',
    'dialCode': '+354',
  },
  'IT': {
    'name': 'Italy',
    'flag': '🇮🇹',
    'currency': 'EUR',
    'dialCode': '+39',
  },
  'JE': {
    'name': 'Jersey',
    'flag': '🇯🇪',
    'currency': 'GBP',
    'dialCode': '+44',
  },
  'JM': {
    'name': 'Jamaica',
    'flag': '🇯🇲',
    'currency': 'JMD',
    'dialCode': '+1876',
  },
  'JO': {
    'name': 'Jordan',
    'flag': '🇯🇴',
    'currency': 'JOD',
    'dialCode': '+962',
  },
  'JP': {
    'name': 'Japan',
    'flag': '🇯🇵',
    'currency': 'JPY',
    'dialCode': '+81',
  },
  'KE': {
    'name': 'Kenya',
    'flag': '🇰🇪',
    'currency': 'KES',
    'dialCode': '+254',
  },
  'KG': {
    'name': 'Kyrgyzstan',
    'flag': '🇰🇬',
    'currency': 'EUR',
    'dialCode': '+996',
  },
  'KH': {
    'name': 'Cambodia',
    'flag': '🇰🇭',
    'currency': 'EUR',
    'dialCode': '+855',
  },
  'KI': {
    'name': 'Kiribati',
    'flag': '🇰🇮',
    'currency': 'EUR',
    'dialCode': '+686',
  },
  'KM': {
    'name': 'Comoros',
    'flag': '🇰🇲',
    'currency': 'KMF',
    'dialCode': '+269',
  },
  'KN': {
    'name': 'St. Kitts & Nevis',
    'flag': '🇰🇳',
    'currency': 'EUR',
    'dialCode': '+1869',
  },
  'KP': {
    'name': 'North Korea',
    'flag': '🇰🇵',
    'currency': 'KPW',
    'dialCode': '+850',
  },
  'KR': {
    'name': 'South Korea',
    'flag': '🇰🇷',
    'currency': 'KRW',
    'dialCode': '+82',
  },
  'KW': {
    'name': 'Kuwait',
    'flag': '🇰🇼',
    'currency': 'KWD',
    'dialCode': '+965',
  },
  'KY': {
    'name': 'Cayman Islands',
    'flag': '🇰🇾',
    'currency': 'KYD',
    'dialCode': '+ 345',
  },
  'KZ': {
    'name': 'Kazakhstan',
    'flag': '🇰🇿',
    'currency': 'EUR',
    'dialCode': '+77',
  },
  'LA': {
    'name': 'Laos',
    'flag': '🇱🇦',
    'currency': 'EUR',
    'dialCode': '+856',
  },
  'LB': {
    'name': 'Lebanon',
    'flag': '🇱🇧',
    'currency': 'LBP',
    'dialCode': '+961',
  },
  'LC': {
    'name': 'St. Lucia',
    'flag': '🇱🇨',
    'currency': 'EUR',
    'dialCode': '+1758',
  },
  'LI': {
    'name': 'Liechtenstein',
    'flag': '🇱🇮',
    'currency': 'EUR',
    'dialCode': '+423',
  },
  'LK': {
    'name': 'Sri Lanka',
    'flag': '🇱🇰',
    'currency': 'EUR',
    'dialCode': '+94',
  },
  'LR': {
    'name': 'Liberia',
    'flag': '🇱🇷',
    'currency': 'EUR',
    'dialCode': '+231',
  },
  'LS': {
    'name': 'Lesotho',
    'flag': '🇱🇸',
    'currency': 'EUR',
    'dialCode': '+266',
  },
  'LT': {
    'name': 'Lithuania',
    'flag': '🇱🇹',
    'currency': 'EUR',
    'dialCode': '+370',
  },
  'LU': {
    'name': 'Luxembourg',
    'flag': '🇱🇺',
    'currency': 'EUR',
    'dialCode': '+352',
  },
  'LV': {
    'name': 'Latvia',
    'flag': '🇱🇻',
    'currency': 'EUR',
    'dialCode': '+371',
  },
  'LY': {
    'name': 'Libya',
    'flag': '🇱🇾',
    'currency': 'LYD',
    'dialCode': '+218',
  },
  'MA': {
    'name': 'Morocco',
    'flag': '🇲🇦',
    'currency': 'MAD',
    'dialCode': '+212',
  },
  'MC': {
    'name': 'Monaco',
    'flag': '🇲🇨',
    'currency': 'EUR',
    'dialCode': '+377',
  },
  'MD': {
    'name': 'Moldova',
    'flag': '🇲🇩',
    'currency': 'EUR',
    'dialCode': '+373',
  },
  'ME': {
    'name': 'Montenegro',
    'flag': '🇲🇪',
    'currency': 'EUR',
    'dialCode': '+382',
  },
  'MF': {
    'name': 'St. Martin',
    'flag': '🇲🇫',
    'currency': 'EUR',
    'dialCode': '+590',
  },
  'MG': {
    'name': 'Madagascar',
    'flag': '🇲🇬',
    'currency': 'EUR',
    'dialCode': '+261',
  },
  'MH': {
    'name': 'Marshall Islands',
    'flag': '🇲🇭',
    'currency': 'EUR',
    'dialCode': '+692',
  },
  'MK': {
    'name': 'North Macedonia',
    'flag': '🇲🇰',
    'currency': 'EUR',
    'dialCode': '+389',
  },
  'ML': {
    'name': 'Mali',
    'flag': '🇲🇱',
    'currency': 'EUR',
    'dialCode': '+223',
  },
  'MM': {
    'name': 'Myanmar (Burma)',
    'flag': '🇲🇲',
    'currency': 'EUR',
    'dialCode': '+95',
  },
  'MN': {
    'name': 'Mongolia',
    'flag': '🇲🇳',
    'currency': 'EUR',
    'dialCode': '+976',
  },
  'MO': {
    'name': 'Macao SAR China',
    'flag': '🇲🇴',
    'currency': 'EUR',
    'dialCode': '+853',
  },
  'MP': {
    'name': 'Northern Mariana Islands',
    'flag': '🇲🇵',
    'currency': 'EUR',
    'dialCode': '+1670',
  },
  'MQ': {
    'name': 'Martinique',
    'flag': '🇲🇶',
    'currency': 'EUR',
    'dialCode': '+596',
  },
  'MR': {
    'name': 'Mauritania',
    'flag': '🇲🇷',
    'currency': 'EUR',
    'dialCode': '+222',
  },
  'MS': {
    'name': 'Montserrat',
    'flag': '🇲🇸',
    'currency': 'EUR',
    'dialCode': '+1664',
  },
  'MT': {
    'name': 'Malta',
    'flag': '🇲🇹',
    'currency': 'EUR',
    'dialCode': '+356',
  },
  'MU': {
    'name': 'Mauritius',
    'flag': '🇲🇺',
    'currency': 'EUR',
    'dialCode': '+230',
  },
  'MV': {
    'name': 'Maldives',
    'flag': '🇲🇻',
    'currency': 'EUR',
    'dialCode': '+960',
  },
  'MW': {
    'name': 'Malawi',
    'flag': '🇲🇼',
    'currency': 'EUR',
    'dialCode': '+265',
  },
  'MX': {
    'name': 'Mexico',
    'flag': '🇲🇽',
    'currency': 'MXN',
    'dialCode': '+52',
  },
  'MY': {
    'name': 'Malaysia',
    'flag': '🇲🇾',
    'currency': 'MYR',
    'dialCode': '+60',
  },
  'MZ': {
    'name': 'Mozambique',
    'flag': '🇲🇿',
    'currency': 'EUR',
    'dialCode': '+258',
  },
  'NA': {
    'name': 'Namibia',
    'flag': '🇳🇦',
    'currency': 'EUR',
    'dialCode': '+264',
  },
  'NC': {
    'name': 'New Caledonia',
    'flag': '🇳🇨',
    'currency': 'EUR',
    'dialCode': '+687',
  },
  'NE': {
    'name': 'Niger',
    'flag': '🇳🇪',
    'currency': 'EUR',
    'dialCode': '+227',
  },
  'NF': {
    'name': 'Norfolk Island',
    'flag': '🇳🇫',
    'currency': 'EUR',
    'dialCode': '+672',
  },
  'NG': {
    'name': 'Nigeria',
    'flag': '🇳🇬',
    'currency': 'NGN',
    'dialCode': '+234',
  },
  'NI': {
    'name': 'Nicaragua',
    'flag': '🇳🇮',
    'currency': 'EUR',
    'dialCode': '+505',
  },
  'NL': {
    'name': 'Netherlands',
    'flag': '🇳🇱',
    'currency': 'EUR',
    'dialCode': '+31',
  },
  'NO': {
    'name': 'Norway',
    'flag': '🇳🇴',
    'currency': 'EUR',
    'dialCode': '+47',
  },
  'NP': {
    'name': 'Nepal',
    'flag': '🇳🇵',
    'currency': 'EUR',
    'dialCode': '+977',
  },
  'NR': {
    'name': 'Nauru',
    'flag': '🇳🇷',
    'currency': 'EUR',
    'dialCode': '+674',
  },
  'NU': {
    'name': 'Niue',
    'flag': '🇳🇺',
    'currency': 'EUR',
    'dialCode': '+683',
  },
  'NZ': {
    'name': 'New Zealand',
    'flag': '🇳🇿',
    'currency': 'NZD',
    'dialCode': '+64',
  },
  'OM': {
    'name': 'Oman',
    'flag': '🇴🇲',
    'currency': 'OMR',
    'dialCode': '+968',
  },
  'PA': {
    'name': 'Panama',
    'flag': '🇵🇦',
    'currency': 'EUR',
    'dialCode': '+507',
  },
  'PE': {
    'name': 'Peru',
    'flag': '🇵🇪',
    'currency': 'EUR',
    'dialCode': '+51',
  },
  'PF': {
    'name': 'French Polynesia',
    'flag': '🇵🇫',
    'currency': 'EUR',
    'dialCode': '+689',
  },
  'PG': {
    'name': 'Papua New Guinea',
    'flag': '🇵🇬',
    'currency': 'EUR',
    'dialCode': '+675',
  },
  'PH': {
    'name': 'Philippines',
    'flag': '🇵🇭',
    'currency': 'PHP',
    'dialCode': '+63',
  },
  'PK': {
    'name': 'Pakistan',
    'flag': '🇵🇰',
    'currency': 'PKR',
    'dialCode': '+92',
  },
  'PL': {
    'name': 'Poland',
    'flag': '🇵🇱',
    'currency': 'EUR',
    'dialCode': '+48',
  },
  'PM': {
    'name': 'St. Pierre & Miquelon',
    'flag': '🇵🇲',
    'currency': 'EUR',
    'dialCode': '+508',
  },
  'PN': {
    'name': 'Pitcairn Islands',
    'flag': '🇵🇳',
    'currency': 'EUR',
    'dialCode': '+872',
  },
  'PR': {
    'name': 'Puerto Rico',
    'flag': '🇵🇷',
    'currency': 'EUR',
    'dialCode': '+1939',
  },
  'PS': {
    'name': 'Palestinian Territories',
    'flag': '🇵🇸',
    'currency': 'ILS',
    'dialCode': '+970',
  },
  'PT': {
    'name': 'Portugal',
    'flag': '🇵🇹',
    'currency': 'EUR',
    'dialCode': '+351',
  },
  'PW': {
    'name': 'Palau',
    'flag': '🇵🇼',
    'currency': 'EUR',
    'dialCode': '+680',
  },
  'PY': {
    'name': 'Paraguay',
    'flag': '🇵🇾',
    'currency': 'EUR',
    'dialCode': '+595',
  },
  'QA': {
    'name': 'Qatar',
    'flag': '🇶🇦',
    'currency': 'QAR',
    'dialCode': '+974',
  },
  'RE': {
    'name': 'Réunion',
    'flag': '🇷🇪',
    'currency': 'EUR',
    'dialCode': '+262',
  },
  'RO': {
    'name': 'Romania',
    'flag': '🇷🇴',
    'currency': 'EUR',
    'dialCode': '+40',
  },
  'RS': {
    'name': 'Serbia',
    'flag': '🇷🇸',
    'currency': 'EUR',
    'dialCode': '+381',
  },
  'RU': {
    'name': 'Russia',
    'flag': '🇷🇺',
    'currency': 'RUB',
    'dialCode': '+7',
  },
  'RW': {
    'name': 'Rwanda',
    'flag': '🇷🇼',
    'currency': 'EUR',
    'dialCode': '+250',
  },
  'SA': {
    'name': 'Saudi Arabia',
    'flag': '🇸🇦',
    'currency': 'SAR',
    'dialCode': '+966',
  },
  'SB': {
    'name': 'Solomon Islands',
    'flag': '🇸🇧',
    'currency': 'EUR',
    'dialCode': '+677',
  },
  'SC': {
    'name': 'Seychelles',
    'flag': '🇸🇨',
    'currency': 'EUR',
    'dialCode': '+248',
  },
  'SD': {
    'name': 'Sudan',
    'flag': '🇸🇩',
    'currency': 'SDG',
    'dialCode': '+249',
  },
  'SE': {
    'name': 'Sweden',
    'flag': '🇸🇪',
    'currency': 'EUR',
    'dialCode': '+46',
  },
  'SG': {
    'name': 'Singapore',
    'flag': '🇸🇬',
    'currency': 'SGD',
    'dialCode': '+65',
  },
  'SH': {
    'name': 'St. Helena',
    'flag': '🇸🇭',
    'currency': 'EUR',
    'dialCode': '+290',
  },
  'SI': {
    'name': 'Slovenia',
    'flag': '🇸🇮',
    'currency': 'EUR',
    'dialCode': '+386',
  },
  'SJ': {
    'name': 'Svalbard & Jan Mayen',
    'flag': '🇸🇯',
    'currency': 'EUR',
    'dialCode': '+47',
  },
  'SK': {
    'name': 'Slovakia',
    'flag': '🇸🇰',
    'currency': 'EUR',
    'dialCode': '+421',
  },
  'SL': {
    'name': 'Sierra Leone',
    'flag': '🇸🇱',
    'currency': 'EUR',
    'dialCode': '+232',
  },
  'SM': {
    'name': 'San Marino',
    'flag': '🇸🇲',
    'currency': 'EUR',
    'dialCode': '+378',
  },
  'SN': {
    'name': 'Senegal',
    'flag': '🇸🇳',
    'currency': 'EUR',
    'dialCode': '+221',
  },
  'SO': {
    'name': 'Somalia',
    'flag': '🇸🇴',
    'currency': 'EUR',
    'dialCode': '+252',
  },
  'SR': {
    'name': 'Suriname',
    'flag': '🇸🇷',
    'currency': 'EUR',
    'dialCode': '+597',
  },
  'SS': {
    'name': 'South Sudan',
    'flag': '🇸🇸',
    'currency': 'SSP',
    'dialCode': '+211',
  },
  'ST': {
    'name': 'São Tomé & Príncipe',
    'flag': '🇸🇹',
    'currency': 'EUR',
    'dialCode': '+239',
  },
  'SV': {
    'name': 'El Salvador',
    'flag': '🇸🇻',
    'currency': 'USD',
    'dialCode': '+503',
  },
  'SX': {
    'name': 'Sint Maarten',
    'flag': '🇸🇽',
    'currency': 'EUR',
  },
  'SY': {
    'name': 'Syria',
    'flag': '🇸🇾',
    'currency': 'SYP',
    'dialCode': '+963',
  },
  'SZ': {
    'name': 'Eswatini',
    'flag': '🇸🇿',
    'currency': 'SZL',
    'dialCode': '+268',
  },
  'TA': {
    'name': 'Tristan da Cunha',
    'flag': '🇹🇦',
    'currency': 'EUR',
  },
  'TC': {
    'name': 'Turks & Caicos Islands',
    'flag': '🇹🇨',
    'currency': 'EUR',
    'dialCode': '+1649',
  },
  'TD': {
    'name': 'Chad',
    'flag': '🇹🇩',
    'currency': 'XAF',
    'dialCode': '+235',
  },
  'TF': {
    'name': 'French Southern Territories',
    'flag': '🇹🇫',
    'currency': 'EUR',
  },
  'TG': {
    'name': 'Togo',
    'flag': '🇹🇬',
    'currency': 'EUR',
    'dialCode': '+228',
  },
  'TH': {
    'name': 'Thailand',
    'flag': '🇹🇭',
    'currency': 'THB',
    'dialCode': '+66',
  },
  'TJ': {
    'name': 'Tajikistan',
    'flag': '🇹🇯',
    'currency': 'EUR',
    'dialCode': '+992',
  },
  'TK': {
    'name': 'Tokelau',
    'flag': '🇹🇰',
    'currency': 'EUR',
    'dialCode': '+690',
  },
  'TL': {
    'name': 'Timor-Leste',
    'flag': '🇹🇱',
    'currency': 'EUR',
    'dialCode': '+670',
  },
  'TM': {
    'name': 'Turkmenistan',
    'flag': '🇹🇲',
    'currency': 'EUR',
    'dialCode': '+993',
  },
  'TN': {
    'name': 'Tunisia',
    'flag': '🇹🇳',
    'currency': 'TND',
    'dialCode': '+216',
  },
  'TO': {
    'name': 'Tonga',
    'flag': '🇹🇴',
    'currency': 'EUR',
    'dialCode': '+676',
  },
  'TR': {
    'name': 'Turkey',
    'flag': '🇹🇷',
    'currency': 'TRY',
    'dialCode': '+90',
  },
  'TT': {
    'name': 'Trinidad & Tobago',
    'flag': '🇹🇹',
    'currency': 'EUR',
    'dialCode': '+1868',
  },
  'TV': {
    'name': 'Tuvalu',
    'flag': '🇹🇻',
    'currency': 'EUR',
    'dialCode': '+688',
  },
  'TW': {
    'name': 'Taiwan',
    'flag': '🇹🇼',
    'currency': 'EUR',
    'dialCode': '+886',
  },
  'TZ': {
    'name': 'Tanzania',
    'flag': '🇹🇿',
    'currency': 'EUR',
    'dialCode': '+255',
  },
  'UA': {
    'name': 'Ukraine',
    'flag': '🇺🇦',
    'currency': 'UAH',
    'dialCode': '+380',
  },
  'UG': {
    'name': 'Uganda',
    'flag': '🇺🇬',
    'currency': 'EUR',
    'dialCode': '+256',
  },
  'UM': {
    'name': 'U.S. Outlying Islands',
    'flag': '🇺🇲',
    'currency': 'EUR',
  },
  'UN': {
    'name': 'United Nations',
    'flag': '🇺🇳',
    'currency': 'EUR',
  },
  'US': {
    'name': 'United States',
    'flag': '🇺🇸',
    'currency': 'USD',
    'dialCode': '+1',
  },
  'UY': {
    'name': 'Uruguay',
    'flag': '🇺🇾',
    'currency': 'EUR',
    'dialCode': '+598',
  },
  'UZ': {
    'name': 'Uzbekistan',
    'flag': '🇺🇿',
    'currency': 'EUR',
    'dialCode': '+998',
  },
  'VA': {
    'name': 'Vatican City',
    'flag': '🇻🇦',
    'currency': 'EUR',
    'dialCode': '+379',
  },
  'VC': {
    'name': 'St. Vincent & Grenadines',
    'flag': '🇻🇨',
    'currency': 'EUR',
    'dialCode': '+1784',
  },
  'VE': {
    'name': 'Venezuela',
    'flag': '🇻🇪',
    'currency': 'VES',
    'dialCode': '+58',
  },
  'VG': {
    'name': 'British Virgin Islands',
    'flag': '🇻🇬',
    'currency': 'USD',
    'dialCode': '+1284',
  },
  'VI': {
    'name': 'U.S. Virgin Islands',
    'flag': '🇻🇮',
    'currency': 'EUR',
    'dialCode': '+1340',
  },
  'VN': {
    'name': 'Vietnam',
    'flag': '🇻🇳',
    'currency': 'VND',
    'dialCode': '+84',
  },
  'VU': {
    'name': 'Vanuatu',
    'flag': '🇻🇺',
    'currency': 'EUR',
    'dialCode': '+678',
  },
  'WF': {
    'name': 'Wallis & Futuna',
    'flag': '🇼🇫',
    'currency': 'EUR',
    'dialCode': '+681',
  },
  'WS': {
    'name': 'Samoa',
    'flag': '🇼🇸',
    'currency': 'EUR',
    'dialCode': '+685',
  },
  'XK': {
    'name': 'Kosovo',
    'flag': '🇽🇰',
    'currency': 'EUR',
  },
  'YE': {
    'name': 'Yemen',
    'flag': '🇾🇪',
    'currency': 'YER',
    'dialCode': '+967',
  },
  'YT': {
    'name': 'Mayotte',
    'flag': '🇾🇹',
    'currency': 'EUR',
    'dialCode': '+262',
  },
  'ZA': {
    'name': 'South Africa',
    'flag': '🇿🇦',
    'currency': 'ZAR',
    'dialCode': '+27',
  },
  'ZM': {
    'name': 'Zambia',
    'flag': '🇿🇲',
    'currency': 'EUR',
    'dialCode': '+260',
  },
  'ZW': {
    'name': 'Zimbabwe',
    'flag': '🇿🇼',
    'currency': 'ZWL',
    'dialCode': '+263',
  },
};

export const countryCodes = Object.keys(countries);

/**
 * Returns a hash table of all dialCodes for a country
 *
 * @returns Object
 */
export const getCountryDialCodes = countryCodes.reduce(
  (acc, code) => {
    if (countries[code].dialCode) {
      acc[code] = countries[code].dialCode;
    }

    return acc;
  },
  {},
);

/**
 * Returns a string with the country's flag flag and its name.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - A string combining flag and country name.
 */
export const buildCountryString = (countryCode = region) => `${getCountryFlag(countryCode)}${getCountryName(countryCode)}`;

/**
 * Returns the flag flag for the given country.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - The flag representing the country's flag.
 */
export const getCountryFlag = (countryCode = region) => countries[countryCode.toUpperCase()]?.flag?.trim();

/**
 * Returns the full name of the country.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - The name of the country.
 */
export const getCountryName = (countryCode = region) => countries[countryCode.toUpperCase()]?.name;

/**
 * Returns the dialCode
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - The name of the country.
 */
export const getCountryDialCode = (countryCode = region) => countries[countryCode.toUpperCase()]?.dialCode;

