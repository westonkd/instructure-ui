/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// these locales are supported by Canvas
import 'dayjs/locale/ar'
import 'dayjs/locale/hy-am'
import 'dayjs/locale/ca'
import 'dayjs/locale/da'
import 'dayjs/locale/nl'
import 'dayjs/locale/en-au'
import 'dayjs/locale/en-ca'
import 'dayjs/locale/en-gb'
import 'dayjs/locale/fi'
import 'dayjs/locale/fr'
import 'dayjs/locale/fr-ca'
import 'dayjs/locale/de'
import 'dayjs/locale/el'
import 'dayjs/locale/ht'
import 'dayjs/locale/he'
import 'dayjs/locale/hu'
import 'dayjs/locale/is'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/mi'
import 'dayjs/locale/nb'
import 'dayjs/locale/fa'
import 'dayjs/locale/pl'
import 'dayjs/locale/pt'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/ru'
import 'dayjs/locale/zh'
import 'dayjs/locale/sl'
import 'dayjs/locale/es'
import 'dayjs/locale/sv'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/tr'
import 'dayjs/locale/uk'
import 'dayjs/locale/cy'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

/**
 * Get the user's time zone (or guess)
 * see https://day.js.org/docs/en/timezone/guessing-user-timezone
 * @returns A time zone identifier (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 */
function browserTimeZone() {
  return dayjs.tz.guess()
}

/**
 * Return an instance of a [dayJS](https://day.js.org/) initialized with the current date + time
 * @param locale
 * @param timezone
 * @returns An instance of a dayJS.
 */
function now(locale: string, timezone: string) {
  _checkParams(locale, timezone)
  return dayjs().locale(locale).tz(timezone)
}

/**
 * Parses a string into a localized ISO 8601 string with timezone using
 * dayJs
 * @param dateString
 * @param locale
 * @param timezone
 * @returns ISO8601 string
 */
function parse(dateString: string, locale: string, timezone: string) {
  _checkParams(locale, timezone)
  return dayjs.tz(dateString).locale(locale).tz(timezone, true)
}

/**
 * Determines if a string is a valid ISO 8601 string
 * @param dateString
 * @returns true if dateString is a valid ISO 8601 string
 */
function isValid(dateString: string) {
  return dayjs(dateString).isValid()
}

function _checkParams(locale: string, timezone: string) {
  if (locale == null) throw Error('locale must be specified')
  if (timezone == null) throw Error('timezone must be specified')
}

const TimeUtils = {
  now,
  parse,
  browserTimeZone,
  isValid
}

export default TimeUtils
export { TimeUtils }
