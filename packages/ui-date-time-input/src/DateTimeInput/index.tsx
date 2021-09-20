/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 - present Instructure, Inc.
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

import React, { Component, SyntheticEvent } from 'react'
import PropTypes from 'prop-types'

import { controllable } from '@instructure/ui-prop-types'
import {
  TimeUtils,
  I18nPropTypes,
  Locale,
  DateTime,
  ApplyLocaleContext
} from '@instructure/ui-i18n'
import { FormPropTypes, FormFieldGroup } from '@instructure/ui-form-field'
import type { FormMessage } from '@instructure/ui-form-field'

import { DateInput } from '@instructure/ui-date-input'
import { TimeSelect } from '@instructure/ui-time-select'
import type { InteractionType } from '@instructure/ui-react-utils'
import { Calendar } from '@instructure/ui-calendar'
import { testable } from '@instructure/ui-testable'
import { AccessibleContent } from '@instructure/ui-a11y-content'
import { IconButton } from '@instructure/ui-buttons'
import {
  IconArrowOpenEndSolid,
  IconArrowOpenStartSolid
} from '@instructure/ui-icons'

type DateTimeInputProps = {
  /**
   * The label over the composite `DateTimeInput` component
   **/
  description: React.ReactNode
  /**
   * The label over the DateInput
   **/
  dateLabel: string
  /**
   * The screen reader label for the calendar navigation header's prev month
   * button
   */
  prevMonthLabel: string
  /**
   * The screen reader label for the calendar navigation header's next month
   * button
   */
  nextMonthLabel: string
  /**
   * HTML placeholder text to display when the date input has no value.
   * This should be hint text, not a label replacement.
   **/
  datePlaceholder?: string
  /**
   * The format of the date shown in the `DateInput` when a date is selected.
   * Valid formats are compatible with
   * [Luxon formats](https://moment.github.io/luxon/#/formatting?id=table-of-tokens),
   * including localized formats.
   *
   * If omitted, it will use 'DDD' which is a localized date with full month,
   * e.g. "August 6, 2014"
   **/
  dateFormat?: string
  /**
   * The label over the time input
   **/
  timeLabel: React.ReactNode | ((...args: any[]) => React.ReactNode)
  /**
   * The number of minutes to increment by when generating the allowable time options.
   */
  timeStep?: 5 | 10 | 15 | 20 | 30 | 60
  /**
   * The format of the time shown in the `TimeSelect` when a time is selected.
   * Valid formats are compatible with
   * [Luxon formats](https://moment.github.io/luxon/#/formatting?id=table-of-tokens),
   * including localized formats.
   *
   * If omitted, defers to the underlying `TimeSelect`'s default.
   **/
  timeFormat?: string
  /**
   * A standard language identifier.
   *
   * See [Luxon](https://moment.github.io/luxon/#/intl?id=how-locales-work) for more details.
   *
   * This property can also be set via a context property and if both are set then the component property takes
   * precedence over the context property.
   *
   * The web browser's locale will be used if no value is set via a component property or a context
   * property.
   **/
  locale?: string
  /**
   * A timezone identifier in the format: Area/Location
   *
   * See [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for the list
   * of possible options.
   *
   * This property can also be set via a context property and if both are set then the component property takes
   * precedence over the context property.
   *
   * The web browser's timezone will be used if no value is set via a component property or a context
   * property.
   **/
  timezone?: string
  /**
   * The message shown to the user when the data is invalid.
   * If a string, shown to the user anytime the input is invalid.
   *
   * If a function, receives a single parameter:
   *  *rawDateValue*: the string entered as a date by the user
   *
   * Currently, times must be selected from a list, it can never be incorrect,
   * Though `invalidDateTimeMessage()` will be called if the user selects a time without
   * setting the date.
   **/
  invalidDateTimeMessage: string | ((rawDateValue?: string) => string)
  /**
   * Messages to be displayed
   */
  messages?: FormMessage[]
  /**
   * This format of the composite date-time when displayed in messages.
   * Valid formats are defined in the
   * [Luxon docs](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
   **/
  messageFormat?: string
  /**
   * The layout of this component
   * Vertically stacked, horizontally arranged in 2 columns, or inline.
   * See [FormFieldGroup](#FormFieldGroup) for details.
   **/
  layout?: 'stacked' | 'columns' | 'inline'
  /**
   * An ISO 8601 formatted date string representing the current date-time
   * (must be accompanied by an onChange prop).
   **/
  value?: string
  /**
   * An ISO 8601 formatted date string to use if `value` isn't provided.
   **/
  defaultValue?: string
  /**
   * An array of labels containing the name of each day of the week. The visible
   * portion of the label should be abbreviated (no longer than three characters).
   * Note that screen readers will read this content preceding each date as the
   * `<Calendar />` is navigated. Consider using
   * [AccessibleContent](#AccessibleContent) with the `alt` prop containing the
   * full day name for assistive technologies and the children containing the
   * abbreviation. ex. `[<AccessibleContent alt="Monday">Mon</AccessibleContent>, ...]`
   *
   * You must render set the starting day of the week to the one specified by
   * the current locale (e.g. Sunday in the US, Monday in Germany),
   * dates are already displayed this way.
   *
   * By default it will render accessible, localized, abbreviated weekdays
   * with week starts according to the current locale.
   */
  renderWeekdayLabels?: (((...args: any[]) => any) | React.ReactNode)[]
  /**
   * Specifies if the input is required.
   */
  isRequired?: boolean
  /**
   * Specifies if interaction with the input is enabled, disabled, or readonly.
   * When "disabled", the input changes visibly to indicate that it cannot
   * receive user interactions. When "readonly" the input still cannot receive
   * user interactions but it keeps the same styles as if it were enabled.
   */
  interaction?: InteractionType
  /**
   * Called when the date-time value has changed.
   * The passed in parameters are:
   *   *event*: The triggering event (which may be from the underlying
   * `          DateInput` or `TimeSelect`)
   *   *isoValue*: The new date value in ISO 8601 format, undefined if its invalid
   **/
  onChange?: (event: SyntheticEvent, isoValue?: string) => void
  /**
   * The <input> element where the date is entered.
   **/
  dateInputRef?: (...args: any[]) => any
  /**
   * The <input> element where the time is entered.
   **/
  timeInputRef?: (...args: any[]) => any
  /**
   * onBlur event handler for when focus leaves DateTimeInput.
   * Does not fire when focus moves between DateInput and TimeSelect within the component
   */
  onBlur?: (e: SyntheticEvent) => void
}

type DateTimeInputState = {
  // the time and date currently selected
  iso?: DateTime
  // the date rendered by the opened calendar
  renderedDate: DateTime
  // The value currently displayed in the dateTime component.
  // Just the time part is visible
  dateInputText: string
  // The value currently displayed in the timeSelect component as ISO datetime
  timeSelectValue?: string
  // The message (success/error) shown below the component
  message?: FormMessage
  // Whether the calendar is open
  isShowingCalendar?: boolean
}

/**
---
category: components
---
@tsProps
**/
@testable()
class DateTimeInput extends Component<DateTimeInputProps, DateTimeInputState> {
  static propTypes = {
    description: PropTypes.node.isRequired,
    dateLabel: PropTypes.string.isRequired,
    prevMonthLabel: PropTypes.string.isRequired,
    nextMonthLabel: PropTypes.string.isRequired,
    datePlaceholder: PropTypes.string,
    dateFormat: PropTypes.string,
    interaction: PropTypes.oneOf(['enabled', 'disabled', 'readonly']),
    timeLabel: PropTypes.string.isRequired,
    timeStep: PropTypes.oneOf([5, 10, 15, 20, 30, 60]),
    timeFormat: PropTypes.string,
    locale: PropTypes.string,
    timezone: PropTypes.string,
    invalidDateTimeMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    messages: PropTypes.arrayOf(FormPropTypes.message),
    messageFormat: PropTypes.object,
    layout: PropTypes.oneOf(['stacked', 'columns', 'inline']),
    value: controllable(I18nPropTypes.iso8601, 'onChange'),
    defaultValue: I18nPropTypes.iso8601,
    renderWeekdayLabels: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.node])
    ),
    isRequired: PropTypes.bool,
    onChange: PropTypes.func,
    dateInputRef: PropTypes.func,
    timeInputRef: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    layout: 'inline',
    timeStep: 30,
    messageFormat: 'ffff', // extra verbose localized date and time
    isRequired: false,
    // Leave interaction default undefined so that `disabled` and `readOnly` can also be supplied
    interaction: undefined,
    onBlur: undefined,
    timeInputRef: undefined,
    dateInputRef: undefined,
    onChange: undefined,
    renderWeekdayLabels: undefined,
    defaultValue: undefined,
    value: undefined,
    messages: undefined,
    timezone: undefined,
    locale: undefined,
    timeFormat: undefined,
    datePlaceholder: undefined,
    dateFormat: 'DDD' // Localized date with full month, e.g. "August 6, 2014"
  }

  static contextType = ApplyLocaleContext

  private _timeInput?: TimeSelect

  constructor(props: DateTimeInputProps) {
    super(props)
    // State needs to be calculated because render could be called before
    // componentDidMount()
    const initState = this.recalculateState(props.value || props.defaultValue)
    this.state = {
      ...initState,
      timeSelectValue: initState.iso
        ? props.value || props.defaultValue
        : undefined,
      isShowingCalendar: false
    }
  }

  componentDidMount() {
    // we'll need to recalculate the state because the context value is
    // set at this point (and it might change locale & timezone)
    const initState = this.recalculateState(
      this.props.value || this.props.defaultValue
    )
    this.setState({
      ...initState,
      timeSelectValue: initState.iso
        ? this.props.value || this.props.defaultValue
        : undefined
    })
  }

  componentDidUpdate(prevProps: Readonly<DateTimeInputProps>): void {
    const valueChanged =
      prevProps.value !== this.props.value ||
      prevProps.defaultValue !== this.props.defaultValue
    const isUpdated =
      valueChanged ||
      prevProps.locale !== this.props.locale ||
      prevProps.timezone !== this.props.timezone ||
      prevProps.dateFormat !== this.props.dateFormat ||
      prevProps.messageFormat !== this.props.messageFormat ||
      prevProps.invalidDateTimeMessage !== this.props.invalidDateTimeMessage

    if (isUpdated) {
      this.setState((_prevState: DateTimeInputState) => {
        return {
          ...this.recalculateState(this.props.value || this.props.defaultValue)
        }
      })
    }
  }

  recalculateState(
    dateStr?: string,
    doNotChangeDate = false,
    doNotChangeTime = false
  ): DateTimeInputState {
    let errorMsg: FormMessage | undefined
    if (dateStr) {
      let parsed = TimeUtils.parse(dateStr, this.locale(), this.timezone())
      if (parsed.isValid) {
        if (doNotChangeTime && this.state.iso) {
          parsed = parsed.set({ hour: this.state.iso.hour })
          parsed = parsed.set({ minute: this.state.iso.minute })
        }
        if (doNotChangeDate && this.state.iso) {
          parsed = parsed.set({ day: this.state.iso.day })
          parsed = parsed.set({ month: this.state.iso.month })
          parsed = parsed.set({ year: this.state.iso.year })
        }
        const newTimeSelectValue = this.state?.timeSelectValue
          ? this.state.timeSelectValue
          : this._timeInput
              ?.getBaseDate()
              .set({ minute: parsed.minute, hour: parsed.hour })
              .toISO()
        return {
          iso: parsed,
          dateInputText: parsed.toFormat(this.dateFormat),
          message: {
            type: 'success',
            text: this.props.messageFormat
              ? parsed.toFormat(this.props.messageFormat)
              : parsed.toFormat('ffff')
          },
          timeSelectValue: newTimeSelectValue,
          renderedDate: parsed
        }
      }
      if (dateStr.length > 0 || this.props.isRequired) {
        const text =
          typeof this.props.invalidDateTimeMessage === 'function'
            ? this.props.invalidDateTimeMessage(dateStr)
            : this.props.invalidDateTimeMessage
        errorMsg = text ? { text, type: 'error' } : undefined
      }
    }
    return {
      iso: undefined,
      dateInputText: '',
      message: errorMsg,
      renderedDate: TimeUtils.now(this.locale(), this.timezone())
    }
  }

  locale(): string {
    if (this.props.locale) {
      return this.props.locale
    } else if (this.context && this.context.locale) {
      return this.context.locale
    }
    return Locale.browserLocale()
  }

  timezone(): string {
    if (this.props.timezone) {
      return this.props.timezone
    } else if (this.context && this.context.timezone) {
      return this.context.timezone
    }
    return TimeUtils.browserTimeZone()
  }

  get dateFormat() {
    return this.props.dateFormat ? this.props.dateFormat : 'DDD'
  }

  // when the user enters a new date via keyboard. Currently only possible
  // by replacing 1 letter...
  // dateValue is a localized value, like '5/1/2017'
  // TODO this needs to be handled better
  handleDateTextChange = (event: SyntheticEvent, date: { value: string }) => {
    this.handleDayClick(event, {
      date: DateTime.fromFormat(date.value, this.dateFormat, {
        locale: this.locale(),
        zone: this.timezone()
      }).toISO()
    })
  }

  // date is returned es a ISO string, like 2021-09-14T22:00:00.000Z
  handleDayClick = (event: SyntheticEvent, { date }: { date: string }) => {
    let newState
    if (
      this.state.timeSelectValue &&
      (!this.state.dateInputText || this.state.dateInputText == '')
    ) {
      // There is already a selected time, but no date. Adjust the time too
      let dateParsed = TimeUtils.parse(date, this.locale(), this.timezone())
      const timeParsed = TimeUtils.parse(
        this.state.timeSelectValue,
        this.locale(),
        this.timezone()
      )
      dateParsed = dateParsed.set({
        hour: timeParsed.hour,
        minute: timeParsed.minute
      })
      newState = this.recalculateState(dateParsed.toISO(), false, false)
    } else {
      newState = this.recalculateState(date, false, true)
    }
    this.changeStateIfNeeded(newState, event)
  }

  handleTimeChange = (
    event: SyntheticEvent,
    option: { value: string; inputText: string }
  ) => {
    let newValue: string
    if (this.state.iso) {
      newValue = option.value
    } else {
      // if no date is set just return the input text, it will error
      newValue = option.inputText
    }
    const newState = this.recalculateState(newValue, true, false)
    this.changeStateIfNeeded(newState, event)
    this.setState({ timeSelectValue: option.value })
  }

  changeStateIfNeeded = (newState: DateTimeInputState, e: SyntheticEvent) => {
    this.setState({ message: newState.message })
    if (!newState.iso && !this.state.iso) {
      return
    }
    if (
      !this.state.iso ||
      !newState.iso ||
      !this.state.iso.equals(newState.iso)
    ) {
      this.setState(newState)
      if (this.props.onChange) {
        this.props.onChange(e, newState.iso?.toISO())
      }
    }
  }

  handleBlur = (e: SyntheticEvent) => {
    const newState = this.recalculateState(
      DateTime.fromFormat(this.state.dateInputText, this.dateFormat, {
        locale: this.locale(),
        zone: this.timezone()
      }).toISO(),
      false,
      true
    )
    this.changeStateIfNeeded(newState, e)
    // when TABbing from the DateInput to TimeInput or visa-versa, the blur
    // happens on the target before the relatedTarget gets focus.
    // The timeout gives it a moment for that to happen
    if (typeof this.props.onBlur === 'function') {
      window.setTimeout(() => {
        this.props.onBlur?.(e)
      }, 0)
    }
  }

  timeInputComponentRef = (node: TimeSelect) => {
    this._timeInput = node
  }

  handleShowCalendar = (_event: SyntheticEvent) => {
    this.setState({ isShowingCalendar: true })
  }

  handleHideCalendar = (_event: SyntheticEvent) => {
    this.setState({ isShowingCalendar: false })
  }

  handleSelectNextDay = (event: SyntheticEvent) => {
    let toAlter = this.state.iso ? this.state.iso : this.state.renderedDate
    toAlter = toAlter.plus({ days: 1 })
    this.handleDayClick(event, { date: toAlter.toISO() })
  }

  handleSelectPrevDay = (event: SyntheticEvent) => {
    let toAlter = this.state.iso ? this.state.iso : this.state.renderedDate
    toAlter = toAlter.minus({ days: 1 })
    this.handleDayClick(event, { date: toAlter.toISO() })
  }

  handleRenderNextMonth = (_event: SyntheticEvent) => {
    this.setState({
      renderedDate: this.state.renderedDate.plus({ months: 1 })
    })
  }

  handleRenderPrevMonth = (_event: SyntheticEvent) => {
    this.setState({
      renderedDate: this.state.renderedDate.minus({ months: 1 })
    })
  }

  renderDays() {
    if (!this.state.isShowingCalendar) {
      // this is an expensive function, only execute if the calendar is open
      return
    }
    const renderedDate = this.state.renderedDate
    // Sets it to the first local day of the week counting back from the start of the month.
    // Note that first day depends on the locale, e.g. it's Sunday in the US and
    // Monday in most of the EU.
    let currDate = TimeUtils.getFirstDayOfWeek(
      renderedDate.startOf('month'),
      this.locale()
    )
    const arr: DateTime[] = []
    for (let i = 0; i < Calendar.DAY_COUNT; i++) {
      arr.push(currDate)
      currDate = currDate.plus({ days: 1 })
    }
    return arr.map((date) => {
      const dateStr = date.toISO()
      return (
        <DateInput.Day
          key={dateStr}
          date={dateStr}
          isSelected={
            this.state.iso ? date.hasSame(this.state.iso, 'day') : false
          }
          isToday={date.hasSame(
            TimeUtils.now(this.locale(), this.timezone()),
            'day'
          )}
          isOutsideMonth={!date.hasSame(renderedDate, 'month')}
          label={date.toFormat('dd')}
          onClick={this.handleDayClick}
        >
          {date.toFormat('dd')}
        </DateInput.Day>
      )
    })
  }

  // The default weekdays rendered in the calendar
  get defaultWeekdays() {
    if (!this.state.isShowingCalendar) {
      // this is an expensive function, only execute if the calendar is open
      return []
    }
    const shortDayNames = TimeUtils.getLocalDayNamesOfTheWeek(
      this.locale(),
      'short'
    )
    const longDayNames = TimeUtils.getLocalDayNamesOfTheWeek(
      this.locale(),
      'long'
    )
    return [
      <AccessibleContent key={1} alt={longDayNames[0]}>
        {shortDayNames[0]}
      </AccessibleContent>,
      <AccessibleContent key={2} alt={longDayNames[1]}>
        {shortDayNames[1]}
      </AccessibleContent>,
      <AccessibleContent key={3} alt={longDayNames[2]}>
        {shortDayNames[2]}
      </AccessibleContent>,
      <AccessibleContent key={4} alt={longDayNames[3]}>
        {shortDayNames[3]}
      </AccessibleContent>,
      <AccessibleContent key={5} alt={longDayNames[4]}>
        {shortDayNames[4]}
      </AccessibleContent>,
      <AccessibleContent key={6} alt={longDayNames[5]}>
        {shortDayNames[5]}
      </AccessibleContent>,
      <AccessibleContent key={7} alt={longDayNames[6]}>
        {shortDayNames[6]}
      </AccessibleContent>
    ]
  }

  renderNextPrevMonthButton(type: 'prev' | 'next') {
    if (!this.state.isShowingCalendar) {
      return
    }
    return (
      <IconButton
        size="small"
        withBackground={false}
        withBorder={false}
        renderIcon={
          type === 'prev' ? (
            <IconArrowOpenStartSolid color="primary" />
          ) : (
            <IconArrowOpenEndSolid color="primary" />
          )
        }
        screenReaderLabel={
          type === 'prev'
            ? this.props.prevMonthLabel
            : this.props.nextMonthLabel
        }
      />
    )
  }

  render() {
    const {
      description,
      datePlaceholder,
      dateLabel,
      dateInputRef,
      timeLabel,
      timeFormat,
      timeStep,
      timeInputRef,
      locale,
      timezone,
      messages,
      layout,
      isRequired,
      interaction,
      renderWeekdayLabels
    } = this.props
    return (
      <FormFieldGroup
        description={description}
        colSpacing="medium"
        rowSpacing="small"
        layout={layout}
        vAlign="top"
        messages={[
          ...(this.state.message ? [this.state.message] : []),
          ...(messages || [])
        ]}
      >
        <DateInput
          value={this.state.dateInputText}
          onChange={this.handleDateTextChange}
          onBlur={this.handleBlur}
          inputRef={dateInputRef}
          placeholder={datePlaceholder}
          renderLabel={dateLabel}
          renderWeekdayLabels={
            renderWeekdayLabels ? renderWeekdayLabels : this.defaultWeekdays
          }
          onRequestShowCalendar={this.handleShowCalendar}
          onRequestHideCalendar={this.handleHideCalendar}
          isShowingCalendar={this.state.isShowingCalendar}
          renderNextMonthButton={this.renderNextPrevMonthButton('next')}
          renderPrevMonthButton={this.renderNextPrevMonthButton('prev')}
          onRequestSelectNextDay={this.handleSelectNextDay}
          onRequestSelectPrevDay={this.handleSelectPrevDay}
          onRequestRenderNextMonth={this.handleRenderNextMonth}
          onRequestRenderPrevMonth={this.handleRenderPrevMonth}
          isRequired={isRequired}
          interaction={interaction}
          renderNavigationLabel={
            <span>
              <div>{this.state.renderedDate.toFormat('MMMM')}</div>
              <div>{this.state.renderedDate.toFormat('y')}</div>
            </span>
          }
        >
          {this.renderDays()}
        </DateInput>
        <TimeSelect
          value={this.state.timeSelectValue}
          onChange={this.handleTimeChange}
          onBlur={this.handleBlur}
          ref={this.timeInputComponentRef}
          renderLabel={timeLabel}
          locale={locale}
          format={timeFormat}
          step={timeStep}
          timezone={timezone}
          inputRef={timeInputRef}
          interaction={interaction}
        />
      </FormFieldGroup>
    )
  }
}

export default DateTimeInput
export { DateTimeInput }
