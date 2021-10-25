import React from 'react';
import { get } from 'lodash';

import {
  ButtonLink,
  CardContent,
  H3,
  H4,
  PaddedView,
  SideBySideView,
  ThemeMixin,
  styled,
  withIsLoading,
  withTheme,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';

import { useNavigation } from '@react-navigation/core';
import { View } from 'react-native';

const StyledCard = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  cardColor: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 2,
  overflow: 'hidden',
}))(View);

const stretchyStyle = {
  aspectRatio: 1,
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.paper,
  overlayType: 'gradient-bottom',
  style: stretchyStyle,
}))(GradientOverlayImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
  paddingVertical: theme.sizing.baseUnit * 2,
}))(CardContent);

const StyledButtonLink = styled(({ theme }) => ({
  alignSelf: 'center',
  color: theme.colors.secondary,
}))(ButtonLink);

const StyledCardTitle = styled(({ theme }) => ({
  color: theme.colors.text.primary,
}))(H3);

const Label = styled(({ theme }) => ({ color: theme.colors.quaternary }))(H4);

const CurrentCampus = withIsLoading(
  ({
    cardTitle,
    coverImage,
    headerActionText,
    headerBackgroundColor,
    headerTintColor,
    headerTitleColor,
    isLoading,
    sectionTitle,
    theme,
  }) => {
    const navigation = useNavigation();

    return (
      <ThemeMixin
        mixin={{
          type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
          colors: get(theme, 'colors', {}),
        }}
      >
        <PaddedView vertical={false}>
          <SideBySideView>
            <Label padded>{sectionTitle}</Label>
            <StyledButtonLink
              onPress={() => {
                navigation.navigate('Location', {
                  headerBackgroundColor,
                  headerTintColor,
                  headerTitleColor,
                });
              }}
            >
              {headerActionText}
            </StyledButtonLink>
          </SideBySideView>

          <StyledCard isLoading={isLoading}>
            <Image
              forceRatio={1}
              overlayType={'featured'}
              source={coverImage}
            />
            <Content>
              <StyledCardTitle numberOfLines={1}>{cardTitle}</StyledCardTitle>
            </Content>
          </StyledCard>
        </PaddedView>
      </ThemeMixin>
    );
  }
);

export default CurrentCampus;
