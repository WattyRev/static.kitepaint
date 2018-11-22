import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import UserContainer from "../../containers/UserContainer";
import { A, H2, Icon, Dropdown } from "../../theme";
import { TypographyStyles } from "../../theme/Text";

export const StyleWrapper = styled.div`
  background: ${({ theme }) => theme.colors.silver};
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-shadow: 0 0 1px ${({ theme }) => theme.colors.black};
  position: relative;
  box-sizing: border-box;
  z-index: 3;

  .left,
  .right {
    display: flex;
    algin-items: center;
    flex-grow: 1;
  }
  .right {
    align-items: stretch;
    justify-content: flex-end;
    height: 100%;
  }
`;

const NavLink = styled.div`
  ${TypographyStyles};
  display: block;
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  text-align: center;
  padding: 8px;
  text-decoration: none;
  background-image: linear-gradient(
    180deg,
    ${props => props.theme.colors.silver},
    ${props => props.theme.colors.silver},
    ${props => props.theme.colors.gray},
    ${props => props.theme.colors.gray}
  );
  background-size: 400% 400%;
  background-position: 50% 0%;
  transition: 0.5s background-position;
  cursor: pointer;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    background-position: 50% 35%;
  }
  .dropdown-arrow {
    margin-left: 4px;
  }
`;

/**
 * The header at the top of the application.
 */
const Header = () => (
  <StyleWrapper>
    <div className="left">
      <H2>
        <A as={Link} to="/">
          KitePaint
        </A>
      </H2>
    </div>
    <div className="right">
      <NavLink as={Link} to="/">
        <Icon icon="home" />
      </NavLink>
      <NavLink as={Link} to="/about">
        About
      </NavLink>
      <NavLink as={Link} to="/create">
        Create
      </NavLink>
      <UserContainer>
        {userData =>
          userData.props.isLoggedIn && (
            <Dropdown
              className="testing_account-dropdown"
              dropdownContent={accountDropdown => (
                <React.Fragment>
                  <accountDropdown.components.Item
                    as={Link}
                    to="/account"
                    onClick={accountDropdown.actions.closeDropdown}
                  >
                    Manage Account
                  </accountDropdown.components.Item>
                  <accountDropdown.components.Item
                    as={Link}
                    to="/my-designs"
                    onClick={accountDropdown.actions.closeDropdown}
                  >
                    My Designs
                  </accountDropdown.components.Item>
                  <accountDropdown.components.Spacer />
                  <accountDropdown.components.Item
                    onClick={userData.actions.logOut}
                  >
                    Sign Out
                  </accountDropdown.components.Item>
                </React.Fragment>
              )}
            >
              {accountDropdown => (
                <NavLink
                  onClick={
                    accountDropdown.props.isOpen
                      ? accountDropdown.actions.closeDropdown
                      : accountDropdown.actions.openDropdown
                  }
                >
                  {userData.props.username}
                  <Icon className="dropdown-arrow" icon="angle-down" />
                </NavLink>
              )}
            </Dropdown>
          )
        }
      </UserContainer>
    </div>
  </StyleWrapper>
);

export default Header;
