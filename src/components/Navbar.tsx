import {
  Box,
  Code,
  Collapse,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconHome2, IconSettings } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

import { Logo } from "./Logo";
import classes from "./Navbar.module.css";

interface MenuLink {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  icon: Icon;
  path?: string;
  links?: MenuLink[];
}

const menuItems: MenuItem[] = [
  {
    label: "首頁",
    icon: IconHome2,
    path: "/"
  },
  {
    label: "系統設定",
    icon: IconSettings,
    links: [
      {
        label: "使用者管理",
        path: "/settings/users"
      }
    ]
  }
];

interface LinksGroupProps {
  item: MenuItem;
}

const LinksGroup = ({ item }: LinksGroupProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasLinks = !!item.links?.length;

  const isChildActive =
    item.links?.some((link) => location.pathname.startsWith(link.path)) ?? false;

  const isActive =
    item.path === "/"
      ? location.pathname === "/"
      : !!item.path && location.pathname.startsWith(item.path);

  const [opened, { toggle }] = useDisclosure(isChildActive);

  const handleClick = () => {
    if (hasLinks) {
      toggle();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <UnstyledButton
        className={classes.control}
        data-active={isActive || isChildActive || undefined}
        onClick={handleClick}
      >
        <Group justify="space-between" gap={0}>
          <Box className={classes.controlContent}>
            <ThemeIcon variant="light" size={30}>
              <item.icon size={18} stroke={1.5} />
            </ThemeIcon>

            <Text size="sm">{item.label}</Text>
          </Box>

          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              data-opened={opened || undefined}
              size={16}
              stroke={1.5}
            />
          )}
        </Group>
      </UnstyledButton>

      {hasLinks && (
        <Collapse expanded={opened}>
          <Box className={classes.links}>
            {item.links?.map((link) => {
              const isLinkActive = location.pathname.startsWith(link.path);

              return (
                <UnstyledButton
                  key={link.path}
                  className={classes.link}
                  data-active={isLinkActive || undefined}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </UnstyledButton>
              );
            })}
          </Box>
        </Collapse>
      )}
    </>
  );
};

const Navbar = () => {
  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: 120 }} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.linksContainer}>
        <div className={classes.linksInner}>
          {menuItems.map((item) => (
            <LinksGroup key={item.label} item={item} />
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
};

export default Navbar;
