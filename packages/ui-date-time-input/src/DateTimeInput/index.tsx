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
import { TimeUtils, I18nPropTypes, Locale } from '@instructure/ui-i18n'
import { FormPropTypes, FormFieldGroup } from '@instructure/ui-form-field'
import type { FormMessage } from '@instructure/ui-form-field'

import { DateInput } from '@instructure/ui-date-input'
import { TimeSelect } from '@instructure/ui-time-select'
import type { InteractionType } from '@instructure/ui-react-utils'
import { Calendar } from '@instructure/ui-calendar'
import { testable } from '@instructure/ui-testable'
import type { Dayjs } from 'dayjs'

type DateTimeInputProps = {
  /**
   * The label over the composite `DateTimeInput` component
   **/
  description: React.ReactNode
  /**
   * The label over the Date Input
   **/
  dateLabel: string
  /**
   * A button to render in the calendar navigation header. The recommendation is
   * to compose it with the [Button](#Button) component, setting the `variant`
   * prop to `icon`, the `size` prop to `small`, and setting the `icon` prop to
   * [IconArrowOpenEnd](#iconography).
   */
  renderNextMonthButton: ((...args: any[]) => any) | React.ReactNode
  /**
   * A button to render in the calendar navigation header. The recommendation is
   * to compose it with the [Button](#Button) component, setting the `variant`
   * prop to `icon`, the `size` prop to `small`, and setting the `icon` prop to
   * [IconArrowOpenStart](#iconography).
   */
  renderPrevMonthButton: ((...args: any[]) => any) | React.ReactNode
  /**
   * HTML placeholder text to display when the date input has no value.
   * This should be hint text, not a label replacement.
   **/
  datePlaceholder?: string
  /**
   * The format of the date shown in the `DateInput` when a date is selected.
   * Valid formats are compatible with
   * [moment.js formats](https://momentjs.com/docs/#/displaying/format/),
   * including localized formats.
   *
   * If omitted, defers to the underlying `DateInput`'s default.
   **/
  dateFormat?: string
  /**
   * The label over the time input
   **/
  timeLabel: React.ReactNode | ((...args: any[]) => any)
  /**
   * The number of minutes to increment by when generating the allowable time options.
   */
  timeStep?: 5 | 10 | 15 | 20 | 30 | 60
  /**
   * The format of the time shown in the `TimeSelect` when a time is selected.
   * Valid formats are compatible with
   * [moment.js formats](https://momentjs.com/docs/#/displaying/format/),
   * including localized formats.
   *
   * If omitted, defers to the underlying `TimeSelect`'s default.
   **/
  timeFormat?: string
  /**
   * A standard language identifier.
   *
   * See [moment.js i18n](https://momentjs.com/docs/#/i18n/) for more details.
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
   * Though `invalidDateTimeMessage` will be called if the user selects a time without
   * setting the date.
   *
   * Either parameter is undefined if the user has not entered anything,
   * which you can use to test for no input if the `DateTimeInput` is required.
   **/
  invalidDateTimeMessage: string | ((rawDateValue?: string) => string)
  /**
   * Messages my parent would like displayed
   */
  messages?: FormMessage[]
  /**
   * This format of the composite date-time when displayed in messages.
   * Valid formats are compatible with
   * [moment.js formats](https://momentjs.com/docs/#/displaying/format/),
   * including localized formats.
   **/
  messageFormat?: string
  /**
   * Vertically stacked, horizontally arranged in 2 columns, or inline.
   * See [FormFieldGroup](#FormFieldGroup) for details.
   **/
  layout?: 'stacked' | 'columns' | 'inline'
  /**
   * An ISO 8601 formatted date string representing the current date-time
   * (must be accompanied by an onChange prop).
   **/
  value?: string //controllable(I18nPropTypes.iso8601, 'onChange'),
  /**
   * An ISO 8601 formatted date string to use if `value` isn't provided.
   **/
  defaultValue?: string //I18nPropTypes.iso8601,
  /**
   * An array of labels containing the name of each day of the week. The visible
   * portion of the label should be abbreviated (no longer than three characters).
   * Note that screen readers will read this content preceding each date as the
   * `<Calendar />` is navigated. Consider using
   * [AccessibleContent](#AccessibleContent) with the `alt` prop containing the
   * full day name for assistive technologies and the children containing the
   * abbreviation. ex. `[<AccessibleContent alt="Sunday">Sun</AccessibleContent>, ...]`
   */
  renderWeekdayLabels: (((...args: any[]) => any) | React.ReactNode)[]
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
   * The passed in parameters are
   * *event*: the triggering event (which may be from the underlying
   * `DateInput` or `TimeSelect`), *isoValue*: the new date value in ISO 8601 format.
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
  iso?: Dayjs
  // the date rendered by the opened calendar
  renderedDate: Dayjs
  // The value currently displayed in the dateTime component
  dateInputText: string
  message?: FormMessage
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
    renderNextMonthButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
      .isRequired,
    renderPrevMonthButton: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
      .isRequired,
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
    messageFormat: PropTypes.string,
    layout: PropTypes.oneOf(['stacked', 'columns', 'inline']),
    value: controllable(I18nPropTypes.iso8601, 'onChange'),
    defaultValue: I18nPropTypes.iso8601,
    renderWeekdayLabels: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.node])
    ).isRequired,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func,
    dateInputRef: PropTypes.func,
    timeInputRef: PropTypes.func,
    onBlur: PropTypes.func
  }
  // TODO extract dayJS stuff to a class
  static defaultProps = {
    layout: 'inline',
    timeStep: 30,
    messageFormat: 'LLL',
    isRequired: false,
    // Leave interaction default undefined so that `disabled` and `readOnly` can also be supplied
    interaction: undefined,
    onBlur: undefined,
    timeInputRef: undefined,
    dateInputRef: undefined,
    onChange: undefined,
    defaultValue: undefined,
    value: undefined,
    messages: undefined,
    timezone: undefined,
    locale: undefined,
    timeFormat: undefined,
    datePlaceholder: undefined,
    dateFormat: undefined
  }

  // static contextTypes = {
  //  locale: PropTypes.string,
  //  timezone: PropTypes.string
  //}
  private _dateInput?: DateInput
  private _timeInput?: TimeSelect

  constructor(props: DateTimeInputProps) {
    super(props)
    this.state = {
      ...this.recalculateState(props.value || props.defaultValue),
      isShowingCalendar: false
    }
  }

  componentWillReceiveProps(nextProps: DateTimeInputProps) {
    const valueChanged =
      nextProps.value !== this.props.value ||
      nextProps.defaultValue !== this.props.defaultValue
    const isUpdated =
      valueChanged ||
      nextProps.locale !== this.props.locale ||
      nextProps.timezone !== this.props.timezone

    if (isUpdated) {
      this.setState((prevState: DateTimeInputState) => {
        const iso = valueChanged
          ? nextProps.value || nextProps.defaultValue
          : prevState.iso?.toISOString()
        return {
          ...this.recalculateState(iso, nextProps.locale, nextProps.timezone)
        }
      })
    }
  }

  get locale() {
    return (
      this.props.locale || /*this.context.locale ||*/ Locale.browserLocale()
    )
  }

  get timezone() {
    return (
      this.props.timezone ||
      /*this.context.timezone ||*/ TimeUtils.browserTimeZone()
    )
  }

  getErrorMessage(rawValue?: string): FormMessage | undefined {
    const { invalidDateTimeMessage } = this.props
    const text =
      typeof invalidDateTimeMessage === 'function'
        ? invalidDateTimeMessage(rawValue)
        : invalidDateTimeMessage
    return text ? { text, type: 'error' } : undefined
  }

  recalculateState(
    dateStr?: string,
    locale = this.locale,
    timezone = this.timezone,
    validDateModifier?: (value: Dayjs, origDate: Dayjs) => Dayjs
  ): DateTimeInputState {
    let parsed
    if (dateStr) {
      parsed = TimeUtils.parse(dateStr, locale, timezone)
    }
    if (dateStr && parsed && parsed.isValid()) {
      if (validDateModifier && this.state.iso) {
        parsed = validDateModifier(parsed, this.state.iso)
      }
      return {
        iso: parsed,
        // TODO make it customizable
        dateInputText: `${parsed.format('MMMM')} ${parsed.format(
          'D'
        )}, ${parsed.format('YYYY')}`,
        message: {
          type: 'success',
          text: parsed.format(this.props.messageFormat)
        },
        renderedDate: parsed
      }
    }
    let errorMsg
    if ((dateStr && dateStr.length > 0) || this.props.isRequired) {
      errorMsg = this.getErrorMessage(dateStr)
    }
    return {
      iso: undefined,
      dateInputText: '',
      message: errorMsg,
      renderedDate: TimeUtils.now(this.locale, this.timezone)
    }
  }

  // when the user enters a new date via keyboard
  // dateValue is a localized value, like '5/1/2017'
  handleDateTextChange = (_e: SyntheticEvent, dateValue: { value: string }) => {
    this.setState({ dateInputText: dateValue.value })
  }

  // date is returned es a ISO string, like 2021-09-14T22:00:00.000Z
  handleDayClick = (event: SyntheticEvent, { date }: { date: string }) => {
    const newState = this.recalculateState(
      date,
      this.locale,
      this.timezone,
      (dateToModify, origDate) => {
        let newDate = dateToModify
        newDate = newDate.hour(origDate.hour())
        newDate = newDate.minute(origDate.minute())
        return newDate
      }
    )
    this.changeStateIfNeeded(newState, event)
  }

  handleTimeChange = (event: SyntheticEvent, option: { value: string }) => {
    const newState = this.recalculateState(
      option.value,
      this.locale,
      this.timezone,
      (dateToModify, origDate) => {
        let newDate = dateToModify
        newDate = newDate.year(origDate.year())
        newDate = newDate.date(origDate.date())
        newDate = newDate.month(origDate.month())
        return newDate
      }
    )
    this.changeStateIfNeeded(newState, event)
  }

  changeStateIfNeeded = (newState: DateTimeInputState, e: SyntheticEvent) => {
    this.setState({ message: newState.message })
    if (!newState.iso && !this.state.iso) {
      return
    }
    if (!this.state.iso || !this.state.iso.isSame(newState.iso)) {
      this.setState(newState)
      if (this.props.onChange) {
        this.props.onChange(e, newState.iso?.toISOString())
      }
    }
  }

  handleBlur = (e: SyntheticEvent) => {
    const newState = this.recalculateState(
      this.state.dateInputText,
      this.locale,
      this.timezone
    )
    this.changeStateIfNeeded(newState, e)
    // when TABbing from the DateInput to TimeInput or visa-versa, the blur
    // happens on the target before the relatedTarget gets focus.
    // The timeout gives it a moment for that to happen
    if (typeof this.props.onBlur === 'function') {
      window.setTimeout(() => {
        if (!this.focused) {
          this.props.onBlur?.(e)
        }
      }, 0)
    }
  }

  /**
   * Focus me.
   *
   * When this `DateTimeInput` gets focus, we hand it off to the
   * underlying `DateInput`.
   */
  focus = () => {
    if (this._dateInput) {
      // @ts-expect-error TODO fix this when DateInput is typed
      this._dateInput.focus()
    }
  }

  get focused() {
    return (
      // @ts-expect-error TODO fix this when DateInput is typed
      (this._dateInput && this._dateInput.focused) ||
      (this._timeInput && this._timeInput.focused)
    )
  }

  dateInputComponentRef = (node: DateInput) => {
    this._dateInput = node
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

  handleSelectNextDay = (_event: SyntheticEvent) => {
    const toAlter = this.state.iso ? this.state.iso : this.state.renderedDate
    toAlter.add(1, 'day')
    this.setState({
      iso: toAlter,
      renderedDate: toAlter
    })
  }

  handleSelectPrevDay = (_event: SyntheticEvent) => {
    const toAlter = this.state.iso ? this.state.iso : this.state.renderedDate
    toAlter.add(-1, 'day')
    this.setState({
      iso: toAlter,
      renderedDate: toAlter
    })
  }

  handleRenderNextMonth = (_event: SyntheticEvent) => {
    this.setState({
      renderedDate: this.state.renderedDate.add(1, 'month')
    })
  }

  handleRenderPrevMonth = (_event: SyntheticEvent) => {
    this.setState({
      renderedDate: this.state.renderedDate.add(-1, 'month')
    })
  }

  renderDays() {
    const renderedDate = this.state.renderedDate

    let currDate = renderedDate.startOf('month').startOf('week')
    const arr: Dayjs[] = []
    for (let i = 0; i < Calendar.DAY_COUNT; i++) {
      currDate = currDate.add(1, 'days')
      arr.push(currDate)
    }
    return arr.map((date) => {
      const dateStr = date.toISOString()
      return (
        <DateInput.Day
          key={dateStr}
          date={dateStr}
          isSelected={date.isSame(this.state.iso, 'day')}
          isToday={date.isSame(
            TimeUtils.now(this.locale, this.timezone),
            'day'
          )}
          isOutsideMonth={!date.isSame(renderedDate, 'month')}
          label={`${date.format('D')} ${date.format('MMMM')} ${date.format(
            'YYYY'
          )}`} // TODO make this customizable?
          onClick={this.handleDayClick}
        >
          {date.format('D')}
        </DateInput.Day>
      )
    })
  }

  render() {
    const {
      description,
      datePlaceholder,
      dateLabel,
      renderNextMonthButton,
      renderPrevMonthButton,
      //dateFormat,
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
    const { iso, message } = this.state
    //console.log("RENDER", iso?.toISOString(), message)
    return (
      <FormFieldGroup
        description={description}
        colSpacing="medium"
        rowSpacing="small"
        layout={layout}
        vAlign="top"
        messages={[...(message ? [message] : []), ...(messages || [])]}
      >
        <DateInput
          value={this.state.dateInputText}
          onChange={this.handleDateTextChange}
          onBlur={this.handleBlur}
          ref={this.dateInputComponentRef}
          inputRef={dateInputRef}
          placeholder={datePlaceholder}
          renderLabel={dateLabel}
          renderWeekdayLabels={renderWeekdayLabels}
          onRequestShowCalendar={this.handleShowCalendar}
          onRequestHideCalendar={this.handleHideCalendar}
          isShowingCalendar={this.state.isShowingCalendar}
          renderNextMonthButton={renderNextMonthButton}
          renderPrevMonthButton={renderPrevMonthButton}
          onRequestSelectNextDay={this.handleSelectNextDay}
          onRequestSelectPrevDay={this.handleSelectPrevDay}
          onRequestRenderNextMonth={this.handleRenderNextMonth}
          onRequestRenderPrevMonth={this.handleRenderPrevMonth}
          isRequired={isRequired}
          interaction={interaction}
          renderNavigationLabel={
            <span>
              <div>{this.state.renderedDate.format('MMMM')}</div>
              <div>{this.state.renderedDate.format('YYYY')}</div>
            </span>
          }
        >
          {this.renderDays()}
        </DateInput>
        <TimeSelect
          value={iso?.toISOString()}
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
