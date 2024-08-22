import React, { useState } from 'react';
import { ViewProps, View, Text, Button } from 'react-native';

import { useLocalSearchParams } from '../hooks';
import { router } from '../imperative-api';
import { Stack } from '../layouts/Stack';
import { RenderRouterOptions, act, fireEvent, renderRouter, screen } from '../testing-library';
import { TabList, TabSlot, TabTrigger, Tabs } from '../ui';
import { Pressable, PressableProps } from '../views/Pressable';

const renderFruitApp = (options: RenderRouterOptions = {}) =>
  renderRouter(
    {
      '(group)/_layout': {
        unstable_settings: {
          initialRouteName: 'orange',
        },
        default: () => {
          return (
            <Tabs>
              <TabList>
                <TabTrigger name="apple" testID="goto-apple" href="/apple">
                  <Text>Apple</Text>
                </TabTrigger>
                <TabTrigger name="banana" testID="goto-banana" href="/banana/taste">
                  <Text>Banana</Text>
                </TabTrigger>
                <TabTrigger name="orange" testID="goto-orange" href="/orange">
                  <Text>Orange</Text>
                </TabTrigger>
                <TabTrigger
                  name="pear"
                  testID="goto-pear"
                  href={{ pathname: '/[fruit]', params: { fruit: 'pear' } }}>
                  <Text>Pear</Text>
                </TabTrigger>
              </TabList>
              <TabSlot />
            </Tabs>
          );
        },
      },
      '(group)/apple': () => <Text testID="apple">Apple</Text>,

      // Banana
      '(group)/banana/_layout': {
        unstable_settings: {
          initialRouteName: 'index',
        },
        default: () => <Stack />,
      },
      '(group)/banana/index': () => <Text testID="banana">Banana Index</Text>,
      '(group)/banana/color': () => <Text testID="banana-color">Banana Color</Text>,
      '(group)/banana/shape': () => <Text testID="banana">Banana Shape</Text>,
      '(group)/banana/[dynamic]': () => <Text testID="banana-dynamic">Banana dynamic</Text>,

      // Orange
      '(group)/orange/_layout': {
        unstable_settings: {
          initialRouteName: 'index',
        },
        default: () => <Stack />,
      },
      '(group)/orange/index': () => <Text testID="orange">Orange</Text>,
      '(group)/orange/color': () => <Text testID="orange-color">Orange Color</Text>,
      '(group)/orange/shape': () => <Text testID="orange">Orange Shape</Text>,

      // [fruit]
      '(group)/[fruit]/_layout': {
        unstable_settings: {
          initialRouteName: 'index',
        },
        default: () => <Stack />,
      },
      '(group)/[fruit]/index': () => <Text testID="[fruit]">Fruit</Text>,
      '(group)/[fruit]/color': () => <Text testID="[fruit]-color">Fruit Color</Text>,
      '(group)/[fruit]/shape': () => <Text testID="[fruit]">Fruit Shape</Text>,
    },
    options
  );

it('should render the correct screen with nested navigators', () => {
  renderFruitApp({ initialUrl: '/apple' });
  expect(screen).toHaveSegments(['(group)', 'apple']);

  fireEvent.press(screen.getByTestId('goto-banana'));
  expect(screen.getByTestId('banana-dynamic')).toBeVisible();
  expect(screen).toHaveSegments(['(group)', 'banana', '[dynamic]']);
  act(() => router.push('/banana/shape'));
  expect(screen).toHaveSegments(['(group)', 'banana', 'shape']);

  fireEvent.press(screen.getByTestId('goto-orange'));
  expect(screen).toHaveSegments(['(group)', 'orange']);
  act(() => router.push('/orange/color'));
  expect(screen).toHaveSegments(['(group)', 'orange', 'color']);

  // Banana should retain its state
  fireEvent.press(screen.getByTestId('goto-banana'));
  expect(screen).toHaveSegments(['(group)', 'banana', 'shape']);
});

it('should respect `unstable_settings', () => {
  renderFruitApp({ initialUrl: '/orange' });
  expect(screen).toHaveSegments(['(group)', 'orange']);

  expect(screen.getByTestId('orange')).toBeVisible();
  expect(router.canGoBack()).toBe(false);

  // Reset the app, but start at /banana
  screen.unmount();
  renderFruitApp({ initialUrl: '/banana' });

  // Orange should be the initialRouteName, because we are now in (two)
  expect(screen.getByTestId('banana')).toBeVisible();
  act(() => router.back());
  expect(screen.getByTestId('orange')).toBeVisible();
});

it('should allow Href objects', () => {
  renderFruitApp({ initialUrl: '/pear/color' });
  expect(screen).toHaveSegments(['(group)', '[fruit]', 'color']);
  expect(screen.getByTestId('[fruit]-color')).toBeVisible();

  act(() => router.back());
  expect(screen).toHaveSegments(['(group)', '[fruit]']);
  expect(screen.getByTestId('[fruit]')).toBeVisible();
});

it('allows for custom elements', () => {
  function CustomTabs({ children, ...props }: ViewProps) {
    return (
      <View testID="custom-tabs" {...props}>
        {children}
      </View>
    );
  }
  function CustomTabList({ children, ...props }: ViewProps) {
    return (
      <View testID="custom-tablist" {...props}>
        {children}
      </View>
    );
  }
  function CustomTrigger(props: PressableProps) {
    return <Pressable testID="custom-trigger" {...props} />;
  }

  renderRouter(
    {
      _layout: () => {
        return (
          <Tabs asChild>
            <CustomTabs>
              <TabList asChild>
                <CustomTabList>
                  <TabTrigger name="apple" href="/apple">
                    <Text>Apple</Text>
                  </TabTrigger>
                  <TabTrigger asChild name="orange" href="/orange">
                    <CustomTrigger>
                      <Text>Orange</Text>
                    </CustomTrigger>
                  </TabTrigger>
                </CustomTabList>
              </TabList>
              <TabSlot />
              <TabTrigger name="apple" testID="goto-apple">
                <Text>TabTrigger outside of a TabList</Text>
              </TabTrigger>
            </CustomTabs>
          </Tabs>
        );
      },
      apple: () => null,
      orange: () => null,
    },
    {
      initialUrl: '/apple',
    }
  );

  expect(screen.getByTestId('custom-tabs')).toBeVisible();
  expect(screen.getByTestId('custom-tablist')).toBeVisible();
  expect(screen.getByTestId('custom-trigger')).toBeVisible();

  expect(screen).toHaveSegments(['apple']);
  act(() => router.push('/orange'));
  expect(screen).toHaveSegments(['orange']);

  fireEvent.press(screen.getByTestId('goto-apple'));
  expect(screen).toHaveSegments(['apple']);
});

it('can dynamically add tabs', () => {
  renderRouter(
    {
      _layout: () => {
        const [showAll, setShowAll] = useState(false);

        const tabs = showAll ? (
          <>
            <TabTrigger name="apple" href="/apple" />
            <TabTrigger name="orange" href="/orange" />
          </>
        ) : (
          <TabTrigger name="apple" href="/apple" />
        );

        return (
          <Tabs>
            <TabList>{tabs}</TabList>
            <TabSlot />
            <Button testID="show-all" title="Show all" onPress={() => setShowAll(true)} />
          </Tabs>
        );
      },
      apple: () => null,
      orange: () => null,
    },
    {
      initialUrl: '/apple',
    }
  );

  expect(screen).toHaveSegments(['apple']);

  // This stays on /apple because there is no orange tab
  act(() => router.push('/orange'));
  expect(screen).toHaveSegments(['apple']);

  fireEvent.press(screen.getByTestId('show-all'));

  // This now works because there is an orange tab
  act(() => router.push('/orange'));
  expect(screen).toHaveSegments(['orange']);
});

it('does works with shared groups', () => {
  renderRouter(
    {
      _layout: () => (
        <Tabs>
          <TabList>
            <TabTrigger
              name="apple"
              href={{ pathname: '/(one)/[fruit]', params: { fruit: 'apple' } }}>
              <Text>Apple</Text>
            </TabTrigger>
            <TabTrigger
              name="orange"
              testID="goto-orange"
              href={{ pathname: '/(two)/[fruit]', params: { fruit: 'orange' } }}>
              <Text>Orange</Text>
            </TabTrigger>
          </TabList>
          <TabSlot />
        </Tabs>
      ),
      '(one,two)/[fruit]': function Fruit() {
        const fruit = useLocalSearchParams().fruit.toString();
        return <Text testID={fruit}>Fruit: {fruit}</Text>;
      },
    },
    {
      initialUrl: '/apple',
    }
  );

  expect(screen.getByTestId('apple')).toBeVisible();
  expect(screen).toHaveSegments(['(one)', '[fruit]']);

  fireEvent.press(screen.getByTestId('goto-orange'));
  expect(screen.getByTestId('orange')).toBeVisible();
  expect(screen).toHaveSegments(['(two)', '[fruit]']);
});

describe('warnings', () => {
  const originalWarn = console.warn;

  const warn = jest.fn();

  beforeEach(() => {
    console.warn = warn;
  });
  afterEach(() => {
    console.warn = originalWarn;
  });

  it('should warn when using an invalid href', () => {
    renderRouter({
      _layout: () => {
        return (
          <Tabs>
            <TabList>
              <TabTrigger name="index" href="/" />
              <TabTrigger name="apple" href="/apple" />
            </TabList>
            <TabSlot />
          </Tabs>
        );
      },
      index: () => null,
    });

    expect(warn).toHaveBeenCalledWith(
      "Tab trigger 'apple' has the href '/apple' which points to a +not-found route."
    );

    console.warn = originalWarn;
  });

  it('should fail when there are no valid tabs', () => {
    const originalWarn = console.warn;
    const warn = jest.fn();
    console.warn = warn;

    expect(() => {
      renderRouter({
        _layout: () => {
          return (
            <Tabs>
              <TabList>
                <TabTrigger name="apple" href="/apple" />
              </TabList>
              <TabSlot />
            </Tabs>
          );
        },
      });
    }).toThrow(
      "Couldn't find any screens for the navigator. Have you defined any screens as its children?"
    );

    expect(warn).toHaveBeenCalledWith(
      "Tab trigger 'apple' has the href '/apple' which points to a +not-found route."
    );

    console.warn = originalWarn;
  });

  it('does not allow duplicate screens', () => {
    // TODO: We should try an implement this functionality
    expect(() =>
      renderRouter({
        _layout: () => (
          <Tabs>
            <TabList>
              <TabTrigger name="apple" href={{ pathname: '/[fruit]', params: { fruit: 'apple' } }}>
                <Text>Apple</Text>
              </TabTrigger>
              <TabTrigger
                name="orange"
                href={{ pathname: '/[fruit]', params: { fruit: 'orange' } }}>
                <Text>Orange</Text>
              </TabTrigger>
            </TabList>
            <TabSlot />
          </Tabs>
        ),
        '[fruit]': () => null,
      })
    ).toThrow(
      `A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '[fruit]')`
    );
  });
});
