import styled from "styled-components";

/**
 * Styling for the manufacturer logo
 */
const ManufacturerLogo = styled.div`
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: block;
  width: ${props => props.size || 70}px;
  height: ${props => props.size || 70}px;
  margin: ${props => (props.noMargin ? 0 : "8px 8px 0 0")};
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.white};
`;

export default ManufacturerLogo;
