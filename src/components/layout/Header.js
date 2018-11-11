import React from "react";
import styled from "styled-components";
import UserContainer from "../../containers/UserContainer";
import { A, P, H2, Icon } from "../../theme";

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

  .left,
  .right {
    display: flex;
    algin-items: center;
    flex-grow: 1;
  }
  .right {
    justify-content: flex-end;
  }
`;

/**
 * The header at the top of the application.
 */
const Header = () => (
  <StyleWrapper>
    <div className="left">
      <H2>
        <A href="#">KitePaint</A>
      </H2>
    </div>
    <div className="right">
      <UserContainer>
        {userData =>
          userData.props.isLoggedIn && (
            <P>
              <A onClick={userData.actions.logOut} className="testing_sign-out">
                Sign Out <Icon icon="sign-out-alt" />
              </A>
            </P>
          )
        }
      </UserContainer>
    </div>
  </StyleWrapper>
);

export default Header;
