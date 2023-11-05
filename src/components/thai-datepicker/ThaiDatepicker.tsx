import generatePicker from 'antd/es/date-picker/generatePicker';
import dayjs, { Dayjs } from 'dayjs';
import th from 'dayjs/locale/th';
import buddistEra from 'dayjs/plugin/buddhistEra';
import { GenerateConfig } from 'rc-picker/lib/generate';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import { noteOnce } from 'rc-util/lib/warning';

dayjs.locale(
  {
    ...th,
    formats: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'DD/MM/BBBB',
      LL: 'D MMMM BBBB',
      LLL: 'D MMMM BBBB เวลา H:mm',
      LLLL: 'วันddddที่ D MMMM BBBB เวลา H:mm',
    },
  },
  null,
  true,
);

dayjs.extend(buddistEra);

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(
    false,
    'Not match any format. Please help to fire a issue about this.',
  );
};

const config: GenerateConfig<Dayjs> = {
  ...dayjsGenerateConfig,
  getFixedDate: (string) => dayjs(string, ['BBBB-M-DD', 'BBBB-MM-DD']),
  setYear: (date, year) => {
    return date.year(year - 543);
  },
  getYear: (date) => Number(date.format('BBBB')),
  locale: {
    getWeekFirstDay: (locale) =>
      dayjs().locale('th').localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, date) => date.locale('th').weekday(0),
    getWeek: (locale, date) => date.locale('th').week(),
    getShortWeekDays: (locale) =>
      dayjs().locale('th').localeData().weekdaysMin(),
    getShortMonths: (locale) => dayjs().locale('th').localeData().monthsShort(),
    format: (locale, date, format) => {
      const convertFormat = format.replace('YYYY', 'BBBB');
      return date.locale('th').format(convertFormat);
    },
    parse: (locale, text, formats) => {
      const localeStr = 'th';
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes('wo') || format.includes('Wo')) {
          const year = formatText.split('-')[0];
          const weekStr = formatText.split('-')[1];
          const firstWeek = dayjs(year, 'BBBB')
            .startOf('year')
            .locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, 'week');
            if (nextWeek.format('Wo') === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = dayjs(formatText, format, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }

      if (text) {
        parseNoMatchNotice();
      }
      return null;
    },
  },
};

const ThaiDatePicker = generatePicker<Dayjs>(config);

export default ThaiDatePicker;
