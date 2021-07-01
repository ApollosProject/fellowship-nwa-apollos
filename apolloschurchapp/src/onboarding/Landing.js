import React, { useCallback } from 'react';
import { Image } from 'react-native';

import { H4, PaddedView, styled } from '@apollosproject/ui-kit';

import { useNavigation } from '@react-navigation/native';
import { Slide } from '@apollosproject/ui-onboarding';

const HeaderImage = styled({
  width: '100%',
  aspectRatio: 0.7,
  marginTop: '-15%',
  height: null,
})(Image);

const GrowImage = styled({
  width: '85%',
  height: null,
  resizeMode: 'contain',
  aspectRatio: 1012 / 355,
  marginBottom: '5%',
})(Image);

const Content = styled({
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '15%',
})(PaddedView);

const Subtitle = styled({ textAlign: 'center' })(H4);

const Landing = () => {
  const navigation = useNavigation();
  const onPressPrimary = useCallback(() => navigation.navigate('Auth'), [
    navigation.navigate,
  ]);
  return (
    <Slide
      onPressPrimary={onPressPrimary}
      primaryNavText="Let's go!"
      scrollEnabled={false}
    >
      <HeaderImage source={require('./Intro.png')} />
      <Content>
        <GrowImage source={require('./GrowTogether.png')} />
        <Subtitle>
          We&apos;re not just a building you go to, but a family to belong to.
        </Subtitle>
      </Content>
    </Slide>
  );
};

export default Landing;