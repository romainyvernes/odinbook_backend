import React, { useState } from 'react'
import { NavLink, Switch, Route } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

// stylesheet
import '../styles/AccountDashboard.css';

import Error from './Error';

export default function AccountDashboard({ heading, mainItems, navItems, className }) {
  const [showNav, setShowNav] = useState(false);

  const toggleNavigation = () => {
    setShowNav(!showNav);
  };

  return (
    <div className={`account-dashboard ${className}`}>
      <aside className="quinary-frame primary-bg-color">
        <header>
          <h1>{heading}</h1>
          <div className="sm-display toggle-btn">
            <button onClick={toggleNavigation} 
                    className={`burger-btn${showNav ? ' open' : ''}`}>
              <div className="burger-icon"></div>
            </button>
          </div>
        </header>
        <ul className={showNav ? 'show' : undefined}>
          {
            navItems.map((item) => (
              <li key={uuid()}>
                <NavLink exact to={item.path} 
                        activeClassName="selected"
                        {...item.props} >
                  <i><item.icon /></i>
                  <h6>{item.heading}</h6>
                </NavLink>
              </li>
            ))
          }
        </ul>
      </aside>
      <main className="primary-bg-color quinary-frame">
        <Switch>
          {
            mainItems.map((item, index) => (
              <Route key={index} exact={index === 0} path={item.path} render={(props) => (
                <item.component {...props} {...item.componentProps} />
              )} />
            ))
          }
          <Route path={`${mainItems[0].path}/*`} component={Error} />
        </Switch>
      </main>
    </div>
  )
}
