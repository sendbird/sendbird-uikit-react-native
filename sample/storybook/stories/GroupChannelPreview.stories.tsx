import { boolean, number, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';

// import { action } from '@storybook/addon-actions';
import { GroupChannelPreview } from '@sendbird/uikit-react-native';
import SBIconAssets from '@sendbird/uikit-react-native/src/assets/icon';

storiesOf('GroupChannelPreview', module)
  // .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add('GroupChannelPreview', () => (
    <>
      <GroupChannelPreview
        coverUrl={text('Cover uri', 'https://static.sendbird.com/sample/cover/cover_15.jpg')}
        onPress={() => Alert.alert('pressed')}
        title={text('Title', 'Title')}
        titleCaption={text('Title Caption', 'Caption')}
        body={text('Body', 'Body')}
        bodyIcon={select('Body Icon', Object.keys(SBIconAssets) as any, 'file-document')}
        memberCount={number('Member count', 10)}
        badgeCount={number('Badge count', 5)}
        frozen={boolean('Frozen', true)}
        muted={boolean('Muted', true)}
      />
    </>
  ));
