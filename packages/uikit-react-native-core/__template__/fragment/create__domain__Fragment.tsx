import React, { useContext } from "react";
import { Pressable, Text } from "react-native";

// @ts-ignore - !!REMOVE
import type { __domain__HeaderProps } from "@sendbird/uikit-react-native-core";

//TODO: move to @sendbird/uikit-react-native/fragments
import create__domain__Module from "../module/create__domain__Module";
import type { __domain__Fragment, __domain__Module } from "../types";

const create__domain__Fragment = (initModule?: __domain__Module): __domain__Fragment => {
  const module = create__domain__Module(initModule);

  return ({ Header }) => {
    // const fragmentHook  = use__domain__();
    return (
      <module.Provider>
        <HeaderRenderer Header={Header} Context={module.Context} />
        {module.View({})}
      </module.Provider>
    );
  };
};

const HeaderRenderer: React.FC<__domain__HeaderProps> = ({ Header, Context, onPressHeaderLeft }) => {
  const {} = useContext(Context);
  if (!Header) return null;
  return (
    <Header
      title={'__domain__Fragment'}
      left={
        <Pressable onPress={onPressHeaderLeft}>
          <Text>{'LEFT'}</Text>
        </Pressable>
      }
    />
  );
};

export default create__domain__Fragment;
