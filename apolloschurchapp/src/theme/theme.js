import React from 'react';
import { Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');
/* Add your custom theme definitions below. Anything that is supported in UI-Kit Theme can be
 overridden and/or customized here! */

/* Base colors.
 * These get used by theme types (see /types directory) to color
 * specific parts of the interface. For more control on how certain
 * elements are colored, go there. The next level of control comes
 * on a per-component basis with "overrides"
 */
const lightColors = {
  primary: '#27272E', // 27272E',
  secondary: '#4E9AF4',
  tertiary: '#AFAFAF',
  quaternary: '#808080',

  screen: '#F8F8FB',
};

const darkColors = {
  primary: '#AFAFAF', // 27272E',
  secondary: '#4E9AF4',
  tertiary: '#AFAFAF',
};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
const typography = {
  baseFontSize: 18,
  baseLineHeight: 27, // 1.5 ratio
  sans: {
    regular: {
      default: 'ProximaNova-Regular',
      italic: 'ProximaNova-RegularIt',
    },
    medium: {
      default: 'ProximaNova-Medium',
      italic: 'ProximaNova-MediumIt',
    },
    bold: {
      default: 'ProximaNova-Semibold',
      italic: 'ProximaNova-SemiboldIt',
    },
    black: {
      default: 'ProximaNova-Bold',
      italic: 'ProximaNova-BoldIt',
    },
  },
};

/* Responsive breakpoints */
// export const breakpoints = {};

/* Base sizing units. These are used to scale
 * space, and size components relatively to one another.
 */
// export const sizing = {};

/* Base alpha values. These are used to keep transparent values across the app consistant */
// export const alpha = {};

/* Base overlays. These are used as configuration for LinearGradients across the app */
const overlays = ({ colors: themeColors }) => ({
  'background-gradient': ({ colors: customColors }) => ({
    colors: customColors || [
      themeColors.background.screen,
      themeColors.background.screen,
    ],
    // default props from `react-native-linear-gradient`
    start: { x: 0.5, y: 0.0 },
    end: { x: 0.5, y: 1.0 },
    locations: null,
  }),
});

/* Overrides allow you to override the styles of any component styled using the `styled` HOC. You
 * can also override the props of any component using the `withTheme` HOC. See examples below:
 * ```const StyledComponent = styled({ margin: 10, padding: 20 }, 'StyledComponent');
 *    const PropsComponent = withTheme(({ theme }) => ({ fill: theme.colors.primary }), 'PropsComponent');
 * ```
 * These componnents can have their styles/props overriden by including the following overrides:
 * ```{
 *   overides: {
 *     StyledComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *     // #protip: you even have access 👇to component props! This applies to style overrides too 💥
 *     PropsComponent: () => ({ theme, isActive }) => ({
 *       fill: isActive ? theme.colors.secondary : theme.colors.primary,
 *     }),
 *   },
 * }
 * ```
 */

const buttons = () => ({
  default: {
    // Full Width Button Text
    fill: '#ffffff',
    // Hide Follow Request Button Text
    accent: '#ffffff',
  },
});

const overrides = {
  // ui-auth.Entry will work once named entry is reviewed in core
  'ui-auth.Entry': {
    authTitleText: "Let's Connect!",
    promptText:
      'Sign in for a personalized experience that helps you grow and connect with God and others.',
  },
  'ui-kit.Button.ButtonStyles': {
    backgroundColor: lightColors.secondary,
    borderColor: lightColors.secondary,
  },
  'ui-onboarding.Slide.SlideContent.Title': {
    textAlign: 'center',
  },
  'ui-onboarding.Slide.SlideContent.Description': {
    textAlign: 'center',
  },
  'ui-onboarding.Features': {
    description:
      "We'd like to help you personalize your profile to make the most of your Fellowship App experience.",
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <Image
        style={{ height: width * 0.7 }}
        resizeMode={'contain'}
        alignSelf={'center'}
        marginTop={'25%'}
        source={require('../onboarding/Welcome_2x.png')}
      />
    ),
  },
  'ui-onboarding.LocationFinder': {
    slideTitle: 'Select your congregation',
    description:
      'We have multiple congregations that meet at three locations across Northwest Arkansas.',
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <Image
        style={{ height: width * 0.7 }}
        resizeMode={'contain'}
        alignSelf={'center'}
        marginTop={'25%'}
        source={require('../onboarding/Gather_2x.png')}
      />
    ),
  },
  'ui-onboarding.AskNotifications': {
    slideTitle: "Let's stay connected",
    description:
      'We’ll let you know when important things are happening and keep you up to date.',
    // eslint-disable-next-line react/display-name
    BackgroundComponent: () => (
      <Image
        style={{ height: width * 0.7 }}
        resizeMode={'contain'}
        alignSelf={'center'}
        marginTop={'25%'}
        source={require('../onboarding/Connect_2x.png')}
      />
    ),
  },
  'ui-onboarding.Follow': {
    slideTitle: 'Who would you like to follow?',
    description:
      'Follow the journal entries and prayer requests of others in your congregation.',
  },
};

export default {
  buttons,
  darkColors,
  lightColors,
  overlays,
  overrides,
  typography,
};
