import React from 'react';

// react components
import AccountDashboard from './AccountDashboard';
import AccountInfo from './AccountInfo';

// icons
import { FcSettings } from 'react-icons/fc';

export default function SettingsDashboard() {

  const navItems = [
    {
      path: "/settings",
      props: {
        className: "dashboard-link sidebar-link hovered-link"
      },
      icon: FcSettings,
      heading: "General"
    }
  ];

  const mainItems = [
    {
      path: "/settings",
      component: AccountInfo,
      componentProps: {
        heading: "General Account Settings"
      }
    }
  ];

  return (
    <AccountDashboard className="settings-dashboard"
                      navItems={navItems}
                      mainItems={mainItems}
                      heading="Settings" />
  )
}
