import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationService,
  withTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import {
  createFeatureFeedTab,
  UserAvatarConnected,
  ConnectScreenConnected,
  CampusTabComponent,
  GET_USER_PROFILE,
} from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import ActionTable from '../ui/ActionTable';
import CurrentCampus from '../ui/CurrentCampus';
import tabBarIcon from './tabBarIcon';

// const HeaderLogo = withTheme(({ theme }) => ({
//   fill: theme.colors.primary,
//   size: 24,
//   name: 'brand-icon',
// }))(Icon);

const SearchIcon = withTheme(({ theme: { colors, sizing: { baseUnit } } }) => ({
  name: 'magnifying-glass',
  size: baseUnit * 2,
  fill: colors.primary,
}))(Icon);

const SearchButton = ({ onPress }) => (
  <Touchable onPress={onPress}>
    <SearchIcon />
  </Touchable>
);

SearchButton.propTypes = {
  onPress: PropTypes.func,
};

const Avatar = withTheme(({ theme: { sizing: { baseUnit } } }) => ({
  size: 'xsmall',
  containerStyle: {
    marginLeft: baseUnit,
  },
}))(UserAvatarConnected);

const ProfileButton = ({ onPress }) => (
  <Touchable onPress={onPress}>
    <View>
      <Avatar />
    </View>
  </Touchable>
);

ProfileButton.propTypes = {
  onPress: PropTypes.func,
};

const HeaderAvatar = () => {
  const navigation = useNavigation();
  return (
    <ProfileButton
      onPress={() => {
        navigation.navigate('UserSettingsNavigator');
      }}
    />
  );
};
// const HeaderCenter = () => <HeaderLogo source={require('./wordmark.png')} />;
const HeaderSearch = () => {
  const navigation = useNavigation();
  return (
    <SearchButton
      onPress={() => {
        navigation.navigate('Search');
      }}
    />
  );
};

const HeaderRight = () => (
  <>
    <HeaderSearch />
    <HeaderAvatar />
  </>
);

const FellowshipIcon = withTheme(({ theme }) => ({
  name: 'fellowship',
  size: theme.sizing.baseUnit * 2,
  fill: theme.type === 'dark' ? '#FFFFFF' : theme.colors.primary,
}))(Icon);

const WatchListenIcon = withTheme(({ theme }) => ({
  name: 'watch-listen',
  size: theme.sizing.baseUnit * 2,
  fill: theme.type === 'dark' ? '#FFFFFF' : theme.colors.primary,
}))(Icon);

const EventsIcon = withTheme(({ theme }) => ({
  name: 'events',
  size: theme.sizing.baseUnit * 2,
  fill: theme.type === 'dark' ? '#FFFFFF' : theme.colors.primary,
}))(Icon);

const BlankHeaderCenter = () => null;

const CustomConnectScreen = () => (
  <ConnectScreenConnected
    ActionTable={ActionTable}
    ActionBar={() => (
      <>
        <Query query={GET_USER_PROFILE}>
          {({ data: campusData, loading: userCampusLoading }) => {
            const userCampus = get(campusData, 'currentUser.profile.campus');
            return userCampus ? (
              <CurrentCampus
                cardButtonText={'Campus Details'}
                cardTitle={userCampus.name}
                coverImage={userCampus.image}
                headerActionText={'Change'}
                itemId={userCampus.id}
                sectionTitle={'Your Campus'}
                isLoading={userCampusLoading}
              />
            ) : (
              <CurrentCampus
                cardButtonText={'Select a Campus'}
                cardTitle={'No location'}
                headerActionText={'Select'}
                sectionTitle={'Your Campus'}
                isLoading={userCampusLoading}
              />
            );
          }}
        </Query>
      </>
    )}
  />
);

// we nest stack inside of tabs so we can use all the fancy native header features
const HomeTab = createFeatureFeedTab({
  options: {
    headerHideShadow: true,
    headerLeft: FellowshipIcon,
    headerRight: HeaderRight,
    headerCenter: BlankHeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Home',
  feedName: 'HOME',
  TabComponent: CampusTabComponent,
});

const EventsTab = createFeatureFeedTab({
  options: {
    headerLeft: EventsIcon,
    headerRight: HeaderRight,
    headerCenter: BlankHeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Events',
  feedName: 'READ',
  TabComponent: CampusTabComponent,
});

const WatchTab = createFeatureFeedTab({
  options: {
    headerLeft: WatchListenIcon,
    headerRight: HeaderRight,
    headerCenter: BlankHeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Watch',
  feedName: 'WATCH',
  TabComponent: CampusTabComponent,
});

const GiveTab = createFeatureFeedTab({
  options: {
    headerHideShadow: true,
    headerLeft: FellowshipIcon,
    headerRight: HeaderRight,
    headerCenter: BlankHeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Give',
  feedName: 'GIVE',
});

const ConnectTab = createFeatureFeedTab({
  options: {
    headerLeft: FellowshipIcon,
    headerRight: HeaderRight,
    headerCenter: BlankHeaderCenter,
    headerLargeTitle: false,
  },
  tabName: 'Connect',
  feedName: 'CONNECT',
  TabComponent: CustomConnectScreen,
});

const { Navigator, Screen } = createBottomTabNavigator();

const ThemedTabNavigator = withTheme(({ theme }) => ({
  tabBarOptions: {
    activeTintColor: theme.type === 'dark' ? '#FFFFFF' : '#000000',
  },
}))(Navigator);

const TabNavigator = () => {
  const client = useApolloClient();
  // this is only used by the tab loaded first
  // if there is a new version of the onboarding flow,
  // we'll navigate there first to show new screens
  useEffect(
    () => {
      checkOnboardingStatusAndNavigate({
        client,
        navigation: NavigationService,
        navigateHome: false,
      });
    },
    [client]
  );

  return (
    <ThemedTabNavigator>
      <Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: tabBarIcon('house'),
        }}
      />
      <Screen
        name="Watch"
        component={WatchTab}
        options={{ tabBarIcon: tabBarIcon('play') }}
      />
      <Screen
        name="Events"
        component={EventsTab}
        options={{ tabBarIcon: tabBarIcon('calendar') }}
      />
      <Screen
        name="Give"
        component={GiveTab}
        options={{ tabBarIcon: tabBarIcon('currency-circle-dollar') }}
      />
      <Screen
        name="Connect"
        component={ConnectTab}
        options={{ tabBarIcon: tabBarIcon('user') }}
      />
    </ThemedTabNavigator>
  );
};

export default TabNavigator;
