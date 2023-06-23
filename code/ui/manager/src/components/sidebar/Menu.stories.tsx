import React from 'react';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import { TooltipLinkList } from '@storybook/components';
import { styled } from '@storybook/theming';
import { within, userEvent, screen } from '@storybook/testing-library';
import { SidebarMenu, ToolbarMenu } from './Menu';
import { useMenu } from '../../containers/menu';

const fakemenu: ComponentProps<typeof TooltipLinkList>['links'] = [
  { title: 'has icon', icon: 'link', id: 'icon' },
  { title: 'has no icon', id: 'non' },
];

const meta = {
  component: SidebarMenu,
  title: 'Sidebar/Menu',
  args: {
    menu: fakemenu,
  },
} satisfies Meta<typeof SidebarMenu>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Items: Story = {
  render: () => <TooltipLinkList links={fakemenu} />,
};

export const Real: Story = {
  render: () => <SidebarMenu menu={fakemenu} isHighlighted />,
};

export const Toolbar = {
  render: () => <ToolbarMenu menu={fakemenu} />,
};

const DoubleThemeRenderingHack = styled.div({
  '#storybook-root > [data-side="left"] > &': {
    textAlign: 'right',
  },
});

export const Expanded: Story = {
  render: () => {
    const menu = useMenu(
      {
        // @ts-expect-error (Converted from ts-ignore)
        getShortcutKeys: () => ({}),
        getAddonsShortcuts: () => ({}),
        versionUpdateAvailable: () => false,
      },
      false,
      false,
      false,
      false,
      false
    );
    return (
      <DoubleThemeRenderingHack>
        <SidebarMenu menu={menu} isHighlighted />
      </DoubleThemeRenderingHack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise((res) => {
      setTimeout(res, 500);
    });
    const menuButton = await canvas.findByRole('button');
    await userEvent.click(menuButton);
    const aboutStorybookBtn = await screen.findByText(/About your Storybook/);
    await expect(aboutStorybookBtn).toBeInTheDocument();
  },
  decorators: [
    (StoryFn) => (
      <div style={{ height: 800 }}>
        <StoryFn />
      </div>
    ),
  ],
};
