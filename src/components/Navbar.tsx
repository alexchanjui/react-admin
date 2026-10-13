import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ActionIcon,
  Avatar,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconDeviceDesktop,
  IconHome,
  IconLayoutGrid,
  IconLogout,
  IconMoon,
  IconPalette,
  IconSelector,
  IconSettings,
  IconShield,
  IconSun,
  IconUser,
  IconUsers,
  type Icon
} from "@tabler/icons-react";
import classes from "./Navbar.module.scss";

type NavLeaf = { label: string; icon: Icon; to: string };
type NavGroup = { label: string; icon: Icon; children: NavLeaf[] };

const NAV: (NavLeaf | NavGroup)[] = [
  { label: "首頁", icon: IconHome, to: "/" },
  {
    label: "系統設定",
    icon: IconSettings,
    children: [
      { label: "使用者管理", icon: IconUsers, to: "/settings/users" },
      { label: "角色管理", icon: IconShield, to: "/settings/roles" }
    ]
  }
];

const SCHEMES = [
  { value: "light", label: "淺色", icon: IconSun },
  { value: "dark", label: "深色", icon: IconMoon },
  { value: "auto", label: "跟隨系統", icon: IconDeviceDesktop }
] as const;

const USER = { name: "Benjamin Canac", email: "benjamin@example.com", initials: "BC" };

const Navbar = () => {
  const { pathname } = useLocation();
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const [collapsed, setCollapsed] = useLocalStorage({
    key: "sidebar-collapsed",
    defaultValue: false,
    getInitialValueInEffect: false
  });
  const toggle = () => setCollapsed((value) => !value);
  useHotkeys([["mod+B", toggle]]);

  // 次選單展開狀態（預設全部展開）
  const [openGroups, setOpenGroups] = useState(() =>
    NAV.filter((item) => "children" in item).map((item) => item.label)
  );
  const toggleGroup = (label: string) =>
    setOpenGroups((groups) =>
      groups.includes(label) ? groups.filter((g) => g !== label) : [...groups, label]
    );

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <nav className={classes.navbar} data-collapsed={collapsed || undefined}>
      <ActionIcon
        className={classes.toggle}
        variant="default"
        radius="xl"
        size={22}
        onClick={toggle}
        aria-label={collapsed ? "展開側邊欄" : "收合側邊欄"}
      >
        <IconChevronLeft size={14} className={classes.toggleIcon} />
      </ActionIcon>

      {/* Logo */}
      <div className={classes.brand}>
        <ThemeIcon size={28} radius="md" style={{ flex: "none" }}>
          <IconLayoutGrid size={16} />
        </ThemeIcon>
        <Text className={classes.brandText} fw={700}>
          Mantine Admin
        </Text>
      </div>

      {/* Navigation */}
      <Stack className={classes.nav} gap={2}>
        {NAV.map((item) => {
          const Icon = item.icon;

          // 有次選單：展開時點擊收合／展開，縮起時滑過去出現 popup
          if ("children" in item) {
            const open = openGroups.includes(item.label);
            const hasActive = item.children.some((child) => isActive(child.to));

            return (
              <div key={item.label}>
                <Menu
                  trigger="hover"
                  position="right-start"
                  offset={12}
                  openDelay={100}
                  closeDelay={150}
                  shadow="md"
                  width={180}
                  disabled={!collapsed}
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={classes.item}
                      data-open={open || undefined}
                      data-active={(hasActive && (collapsed || !open)) || undefined}
                      aria-expanded={open}
                      onClick={() => !collapsed && toggleGroup(item.label)}
                    >
                      <Icon className={classes.icon} size={20} stroke={1.75} />
                      <span className={classes.label}>{item.label}</span>
                      <IconChevronDown className={classes.chevron} size={16} stroke={1.75} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>{item.label}</Menu.Label>
                    {item.children.map((child) => (
                      <Menu.Item
                        key={child.to}
                        component={Link}
                        to={child.to}
                        leftSection={<child.icon size={16} stroke={1.75} />}
                        color={isActive(child.to) ? theme.primaryColor : undefined}
                      >
                        {child.label}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>

                <div className={classes.sub} data-open={open || undefined}>
                  <div className={classes.subInner}>
                    {item.children.map((child) => (
                      <UnstyledButton
                        key={child.to}
                        component={Link}
                        to={child.to}
                        className={classes.item}
                        data-sub
                        data-active={isActive(child.to) || undefined}
                      >
                        <child.icon className={classes.icon} size={18} stroke={1.75} />
                        <span className={classes.label}>{child.label}</span>
                      </UnstyledButton>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // 沒有次選單：縮起時顯示提示
          return (
            <Tooltip
              key={item.to}
              label={item.label}
              position="right"
              offset={12}
              withArrow
              disabled={!collapsed}
            >
              <UnstyledButton
                component={Link}
                to={item.to}
                className={classes.item}
                data-active={isActive(item.to) || undefined}
              >
                <Icon className={classes.icon} size={20} stroke={1.75} />
                <span className={classes.label}>{item.label}</span>
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* User */}
      <div className={classes.footer}>
        <Menu
          position={collapsed ? "right-end" : "top-start"}
          width={collapsed ? 220 : "target"}
          offset={collapsed ? 12 : 8}
          shadow="md"
        >
          <Menu.Target>
            <UnstyledButton className={classes.user}>
              <Avatar size={32} radius="xl" color="violet" style={{ flex: "none" }}>
                {USER.initials}
              </Avatar>
              <div className={classes.userContent}>
                <Text size="sm" fw={500} truncate>
                  {USER.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {USER.email}
                </Text>
              </div>
              <IconSelector className={classes.userSelector} size={16} />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            {collapsed && <Menu.Label>{USER.name}</Menu.Label>}

            <Menu.Item leftSection={<IconUser size={16} />} onClick={() => console.log("profile")}>
              個人檔案
            </Menu.Item>

            <Menu.Sub>
              <Menu.Sub.Target>
                <Menu.Sub.Item leftSection={<IconPalette size={16} />}>外觀</Menu.Sub.Item>
              </Menu.Sub.Target>
              <Menu.Sub.Dropdown>
                {SCHEMES.map((scheme) => (
                  <Menu.Item
                    key={scheme.value}
                    leftSection={<scheme.icon size={16} />}
                    rightSection={colorScheme === scheme.value ? <IconCheck size={14} /> : null}
                    closeMenuOnClick={false}
                    onClick={() => setColorScheme(scheme.value)}
                  >
                    {scheme.label}
                  </Menu.Item>
                ))}
              </Menu.Sub.Dropdown>
            </Menu.Sub>

            <Menu.Divider />

            <Menu.Item leftSection={<IconLogout size={16} />} onClick={() => console.log("logout")}>
              登出
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
