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

import { AsElementType } from '@instructure/shared-types'
import type { InteractionType } from '@instructure/ui-react-utils'
import type { Spacing } from '@instructure/emotion'

export type BaseButtonProps = {
  makeStyles?: (...args: any[]) => any
  styles?: any
  type?: 'button' | 'submit' | 'reset'
  size?: 'small' | 'medium' | 'large'
  elementRef?: (...args: any[]) => any
  as?: AsElementType
  interaction?: InteractionType
  color?: 'primary' | 'primary-inverse' | 'secondary' | 'success' | 'danger'
  focusColor?: 'info' | 'inverse'
  display?: 'inline-block' | 'block'
  textAlign?: 'start' | 'center'
  shape?: 'rectangle' | 'circle'
  withBackground?: boolean
  withBorder?: boolean
  isCondensed?: boolean
  margin?: Spacing
  cursor?: string
  href?: string
  onClick?: (...args: any[]) => any
  onKeyDown?: (...args: any[]) => any
  renderIcon?: React.ReactNode | ((...args: any[]) => any)
  tabIndex?: number | string
}

export type BaseButtonStyleProps = {
  isDisabled: boolean
  hasOnlyIconVisible: boolean
}