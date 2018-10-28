import React from "react";
import styled from "styled-components";
import H2 from "../../theme/H2";
import A from "../../theme/A";

export const StyleWrapper = styled.div`
  background: ${({ theme }) => theme.colors.silver};
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-shadow: 0 0 1px ${({ theme }) => theme.colors.black};
  position: relative;
`;

/**
 * The header at the top of the application.
 */
const Header = () => (
  <StyleWrapper>
    <H2>
      <A href="#">KitePaint</A>
    </H2>
  </StyleWrapper>
);

export default Header;
