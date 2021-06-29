import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size = 32, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28">
    <Path
      d="M14 4.5C8.75329 4.5 4.5 8.75329 4.5 14C4.5 16.3653 5.36439 18.5286 6.79451 20.1915C7.48009 19.239 8.35047 18.4282 9.3585 17.8099C9.72913 17.5826 10.1145 17.3837 10.5114 17.2142C9.35691 16.2283 8.625 14.7621 8.625 13.125C8.625 10.1565 11.0315 7.75 14 7.75C16.9685 7.75 19.375 10.1565 19.375 13.125C19.375 14.7621 18.6431 16.2283 17.4886 17.2141C17.8855 17.3837 18.2709 17.5826 18.6415 17.8099C19.6495 18.4281 20.5199 19.239 21.2055 20.1914C22.6356 18.5286 23.5 16.3653 23.5 14C23.5 8.75329 19.2467 4.5 14 4.5ZM21.7042 22.538C24.0351 20.4334 25.5 17.3878 25.5 14C25.5 7.64873 20.3513 2.5 14 2.5C7.64873 2.5 2.5 7.64873 2.5 14C2.5 17.3873 3.96447 20.4325 6.29481 22.5371C6.30373 22.5454 6.31282 22.5536 6.32209 22.5617C8.35799 24.3886 11.0492 25.5 14 25.5C16.9513 25.5 19.6429 24.3883 21.6789 22.5608C21.6875 22.5533 21.6959 22.5457 21.7042 22.538ZM19.732 21.5765C19.1803 20.7446 18.4522 20.04 17.5959 19.5148C16.5139 18.8512 15.2693 18.5 14 18.5C12.7307 18.5 11.4861 18.8512 10.4041 19.5148C9.54779 20.04 8.8197 20.7446 8.26797 21.5765C9.86118 22.7838 11.8469 23.5 14 23.5C16.1531 23.5 18.1388 22.7838 19.732 21.5765ZM14 9.75C12.136 9.75 10.625 11.261 10.625 13.125C10.625 14.989 12.136 16.5 14 16.5C15.864 16.5 17.375 14.989 17.375 13.125C17.375 11.261 15.864 9.75 14 9.75Z"
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
