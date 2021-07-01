import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28">
    <Path
      d="M20.25 2.625C20.25 2.07272 19.8023 1.625 19.25 1.625C18.6977 1.625 18.25 2.07272 18.25 2.625V3.375H9.75V2.625C9.75 2.07272 9.30228 1.625 8.75 1.625C8.19772 1.625 7.75 2.07272 7.75 2.625V3.375H5.25C4.21447 3.375 3.375 4.21447 3.375 5.25V9.625V22.75C3.375 23.7855 4.21447 24.625 5.25 24.625H22.75C23.7855 24.625 24.625 23.7855 24.625 22.75V9.625V5.25C24.625 4.21447 23.7855 3.375 22.75 3.375H20.25V2.625ZM22.625 8.625V5.375H20.25V6.125C20.25 6.67728 19.8023 7.125 19.25 7.125C18.6977 7.125 18.25 6.67728 18.25 6.125V5.375H9.75V6.125C9.75 6.67728 9.30228 7.125 8.75 7.125C8.19772 7.125 7.75 6.67728 7.75 6.125V5.375H5.375V8.625H22.625ZM5.375 10.625H22.625V22.625H5.375V10.625Z"
      fill={fill}
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
