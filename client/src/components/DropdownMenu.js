import React from 'react';
import { v4 as uuid } from 'uuid';

// stylesheets
import '../styles/DropdownMenu.css';

// bootstrap components
import Dropdown from 'react-bootstrap/Dropdown';

// icons
import { BsThreeDots } from 'react-icons/bs';

export default function DropdownMenu({ items }) {
  return (
    <Dropdown className="custom-dropdown secondary-font-color">
      <Dropdown.Toggle>
        <BsThreeDots className="more-btn secondary-bg-color-hover" />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <ul>
          {
            items.map((item) => (
              <li key={uuid()}>
                <Dropdown.Item onClick={item.function}>
                  {item.label}
                </Dropdown.Item>
              </li>
            ))
          }
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  )
}
