import format from 'date-fns/format';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface Log {
  type: 'log' | 'warn' | 'error' | 'info';
  data: string;
  timestamp: number;
}

const TypeColor: Record<Log['type'], string> = {
  log: '#2d2d2d',
  warn: '#ffc443',
  error: '#ff4332',
  info: '#0773ff',
};

const LogView = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useLayoutEffect(() => {
    (['log', 'warn', 'error', 'info'] as const).forEach((type) => {
      const origin = console[type];

      console[type] = function (...args: unknown[]) {
        origin(...args);
        setLogs((prev) => [
          ...prev,
          {
            type,
            data: args.join(','),
            timestamp: Date.now(),
          },
        ]);
      };
    });
  }, []);

  useEffect(() => {
    Animated.timing(animated, { toValue: isCollapsed ? 0 : 1, duration: 250, useNativeDriver: false }).start();
  }, [isCollapsed]);

  const animated = useRef(new Animated.Value(0)).current;

  const { width } = useWindowDimensions();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        zIndex: 999,
        backgroundColor: '#969696',
        width: animated.interpolate({ extrapolate: 'clamp', inputRange: [0, 1], outputRange: [70, width] }),
        height: animated.interpolate({ extrapolate: 'clamp', inputRange: [0, 1], outputRange: [70, width] }),
        bottom: animated.interpolate({ extrapolate: 'clamp', inputRange: [0, 1], outputRange: [150, 0] }),
        right: animated.interpolate({ extrapolate: 'clamp', inputRange: [0, 1], outputRange: [15, 0] }),
      }}
    >
      <TouchableOpacity
        style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'orange', alignItems: 'center' }}
        onPress={() => setIsCollapsed((prev) => !prev)}
      >
        <Text>{isCollapsed ? 'Expand' : 'Collapse'}</Text>
      </TouchableOpacity>
      <ScrollView>
        {logs.map(({ type, data, timestamp }, idx) => {
          return (
            <View
              key={idx}
              style={{ marginBottom: 1, backgroundColor: TypeColor[type], paddingHorizontal: 4, paddingVertical: 2 }}
            >
              <Text style={{ color: 'white' }}>
                {format(timestamp, 'p')} / {data}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default LogView;
