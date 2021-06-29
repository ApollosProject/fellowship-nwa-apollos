import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28">
    <Path
      d="M12.738 3.29436C13.0831 2.98055 13.5329 2.80666 13.9993 2.80664C14.4658 2.80663 14.9155 2.98049 15.2607 3.29428L24.0113 11.2497C24.2046 11.4254 24.359 11.6396 24.4647 11.8785C24.5704 12.1174 24.625 12.3758 24.625 12.637V22.625H26.25C26.8023 22.625 27.25 23.0727 27.25 23.625C27.25 24.1773 26.8023 24.625 26.25 24.625H1.75C1.19772 24.625 0.75 24.1773 0.75 23.625C0.75 23.0727 1.19772 22.625 1.75 22.625H3.375V12.637C3.375 12.3758 3.42958 12.1174 3.53525 11.8785C3.64092 11.6396 3.79534 11.4255 3.98862 11.2497L12.738 3.29436ZM22.625 12.6923V22.625H17.6243V16.6241C17.6243 16.0719 17.1766 15.6241 16.6243 15.6241H11.3743C10.822 15.6241 10.3743 16.0719 10.3743 16.6241V22.625H5.375V12.6923L13.9994 4.85058L22.625 12.6923ZM12.3743 22.625V17.6241H15.6243V22.625H12.3743Z"
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
