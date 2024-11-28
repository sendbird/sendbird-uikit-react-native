## v3.8.1

- **Added fallback for deleted emoji icons**  
  Fixed a crash that occurred when a reaction emoji was deleted and could not be found. A question mark icon will now appear as a fallback in such cases.

- **Support for hiding user ids in mention suggestions**  
  Added an option to hide user IDs in the mention suggestion list. It can be used as shown below:
  ```tsx
  const module = createGroupChannelModule();
  const GroupChannelFragment = createGroupChannelFragment({
    SuggestedMentionList: (props) => <module.SuggestedMentionList {...props} showUserId={false} />,
  });
  ```
