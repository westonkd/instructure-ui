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

import React, { ComponentClass, forwardRef, useState } from 'react'
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes
} from 'react'

import { isEqual } from 'lodash'
import hoistNonReactStatics from 'hoist-non-react-statics'

import { decorator } from '@instructure/ui-decorator'
import { useTextDirectionContext } from '@instructure/ui-i18n'
import { bidirectionalPolyfill } from './styleUtils/bidirectionalPolyfill'

import { getComponentThemeOverride } from './getComponentThemeOverride'
import { useTheme } from './useTheme'

import type { BaseTheme, ComponentTheme } from '@instructure/shared-types'
import type {
  ComponentStyle,
  ComponentOverride,
  GenerateComponentTheme,
  GenerateStyle,
  Props
} from './EmotionTypes'

type ComponentName = keyof ComponentOverride

interface WithStyleComponent extends ComponentClass<any, any> {
  componentId?: ComponentName
}

type WithStylePrivateProps<
  Style extends ComponentStyle | null = ComponentStyle
> = Style extends null
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : {
      styles?: Style
      makeStyles?: (extraArgs?: Record<string, unknown>) => void
    }

type ThemeOverrideProp<Theme extends ComponentTheme | null = ComponentTheme> = {
  themeOverride?: Partial<Theme>
}

type WithStyleProps<
  Theme extends ComponentTheme | null = ComponentTheme,
  Style extends ComponentStyle | null = ComponentStyle
> = Theme extends null
  ? WithStylePrivateProps<Style>
  : WithStylePrivateProps<Style> & ThemeOverrideProp<Theme>

/**
 * ---
 * category: utilities/themes
 * ---
 *
 * A decorator or higher order component that makes a component themeable.
 *
 * It adds a `makeStyles` function and the generated `styles` object to the decorated Component's props.
 *
 * As a HOC:
 *
 * ```js
 * import { withStyle, jsx } from '@instructure/emotion'
 * import generateStyle from './styles'
 * import generateComponentTheme from './theme'
 *
 *
 * export default withStyle(generateStyle, generateComponentTheme)(ExampleComponent)
 * ```
 *
 * Themeable components inject their themed styles into the document
 * when they are mounted.
 *
 * ### Applying themes
 *
 * A themeable component’s theme can be configured via wrapping it in an
 * [EmotionThemeProvider](#EmotionThemeProvider) component, and/or set
 * explicitly via its `themeOverride` prop.
 *
 * EmotionThemeProvider provides a theme object with [global theme variables](#canvas).
 * These variables are mapped to the component's own variables in `theme.js` (see [@instructure/emotion](#emotion) package documentation for more info).
 *
 * With the `themeOverride` prop you can directly set/override the component theme variables declared in theme.js.
 *
 * ```js
 * // ExampleComponent/theme.js
 * const generateComponentTheme = (theme) => {
 *   const { colors } = theme
 *
 *   const componentVariables = {
 *     background: colors?.backgroundMedium,
 *     color: colors?.textDarkest,
 *
 *     hoverColor: colors?.textLightest,
 *     hoverBackground: colors?.backgroundDarkest
 *   }
 *
 *   return componentVariables
 * }
 * export default generateComponentTheme
 * ```
 *
 * ```jsx
 * {// global theme override}
 * <EmotionThemeProvider theme={{
 *   colors: { backgroundMedium: '#888' }
 * }}>
 *  {// component theme override}
 *   <ExampleComponent themeOverride={{ hoverColor: '#eee' }} />
 * </EmotionThemeProvider>
 * ```
 *
 * @module withStyle
 *
 * @param {function} generateStyle - The function that returns the component's style object
 * @param {function} generateComponentTheme - The function that returns the component's theme variables object
 * @returns {ReactElement} The decorated WithStyle Component
 */
const withStyle = decorator(
  (
    // TODO: better type
    ComposedComponent: WithStyleComponent,
    generateStyle: GenerateStyle,
    generateComponentTheme: GenerateComponentTheme
  ) => {
    const displayName = ComposedComponent.displayName || ComposedComponent.name

    const WithStyle: ForwardRefExoticComponent<
      PropsWithoutRef<Props> & RefAttributes<any>
    > & { generateComponentTheme?: GenerateComponentTheme } = forwardRef(
      (props, ref) => {
        const theme = useTheme()
        const dir = useTextDirectionContext()

        const componentProps: Props = {
          ...ComposedComponent.defaultProps,
          ...props
        }

        const themeOverride = getComponentThemeOverride(
          theme,
          displayName,
          ComposedComponent.componentId,
          componentProps
        )

        const componentTheme: ComponentTheme =
          typeof generateComponentTheme === 'function'
            ? {
                ...generateComponentTheme(theme as BaseTheme),
                ...themeOverride
              }
            : {}

        const [styles, setStyles] = useState(
          generateStyle
            ? bidirectionalPolyfill(
                generateStyle(componentTheme, componentProps, {}),
                // @ts-expect-error TODO: this shouldn't be "auto" (INSTUI-3241)
                dir
              )
            : {}
        )

        const makeStyleHandler: WithStyleProps['makeStyles'] = (extraArgs) => {
          const calculatedStyles = bidirectionalPolyfill(
            generateStyle(componentTheme, componentProps, extraArgs),
            // @ts-expect-error TODO: this shouldn't be "auto" (INSTUI-3241)
            dir
          )
          if (!isEqual(calculatedStyles, styles)) {
            setStyles(calculatedStyles)
          }
        }

        return (
          <ComposedComponent
            ref={ref}
            makeStyles={makeStyleHandler}
            styles={styles}
            {...props}
          />
        )
      }
    )

    hoistNonReactStatics(WithStyle, ComposedComponent)

    // we have to pass these on, because sometimes we need to
    // access propTypes of the component in other components
    // (mainly in the `omitProps` method)
    WithStyle.propTypes = ComposedComponent.propTypes
    WithStyle.defaultProps = ComposedComponent.defaultProps

    // we are exposing the theme generator for the docs generation
    WithStyle.generateComponentTheme = generateComponentTheme

    // we have to add defaults to makeStyles and styles added by this decorator
    // eslint-disable-next-line no-param-reassign
    ComposedComponent.defaultProps = {
      ...ComposedComponent.defaultProps,
      makeStyles: () => {},
      styles: {}
    }

    if (process.env.NODE_ENV !== 'production') {
      WithStyle.displayName = `WithStyle(${displayName})`
    }

    return WithStyle
  }
)

export default withStyle
export { withStyle }
export type { WithStyleProps }
