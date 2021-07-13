import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Circle, Line } from 'react-native-svg';

import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill } = {}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={fill}
    viewBox="0 0 256 256"
  >
    <Circle
      cx="116"
      cy="116"
      r="84"
      fill="none"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <Line
      x1="175.39356"
      y1="175.40039"
      x2="223.99414"
      y2="224.00098"
      fill="none"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;