import { ActionBar, ActionBarItem } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

const Toolbar = () => (
  <RockAuthedWebBrowser>
    {(openUrl) => (
      <ActionBar>
        <ActionBarItem
          onPress={() => openUrl('https://www.fellowshipnwa.org/give')}
          icon="heart-straight"
          label="Give"
        />
        <ActionBarItem
          onPress={() =>
            openUrl('https://www.fellowshipnwa.org/SmallGroupForm')
          }
          icon="users-three"
          label="Join Group"
        />
        <ActionBarItem
          onPress={() => openUrl('https://www.fellowshipnwa.org/serve')}
          icon="hand-waving"
          label="Serve"
        />
      </ActionBar>
    )}
  </RockAuthedWebBrowser>
);

export default Toolbar;
