import React from 'react';
import { View } from 'react-native';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
} from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTable = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <View>
        <RowHeader>
          <Name>
            <H4>{'Additional Links'}</H4>
          </Name>
        </RowHeader>
        <TableView>
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/new')}
          >
            <Cell>
              <CellText>I&apos;m New</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/maps')}
          >
            <Cell>
              <CellText>Maps, Times & Locations</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/care')}
          >
            <Cell>
              <CellText>Counseling & Care</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable onPress={() => openUrl('https://fellowshipnwa.org/cr')}>
            <Cell>
              <CellText>Celebrate Recovery</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/prayer')}
          >
            <Cell>
              <CellText>Prayer</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/baptism')}
          >
            <Cell>
              <CellText>Baptism</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/membership')}
          >
            <Cell>
              <CellText>Become a Member</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() =>
              openUrl('https://www.fellowshipnwa.org/staffdirectory')
            }
          >
            <Cell>
              <CellText>Contact Us</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/aboutus')}
          >
            <Cell>
              <CellText>About Us</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
          <Divider />
          <Touchable
            onPress={() => openUrl('https://www.fellowshipnwa.org/give')}
          >
            <Cell>
              <CellText>Give</CellText>
              <CellIcon name="arrow-next" />
            </Cell>
          </Touchable>
        </TableView>
      </View>
    )}
  </RockAuthedWebBrowser>
);

const StyledActionTable = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 100,
}))(ActionTable);

export default StyledActionTable;
