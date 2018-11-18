import styled from "styled-components";

/**
 * Creates a circle that represents a color on the color palette.
 *
 * Provide a color prop to set the color.
 */
const ColorTile = styled.div`
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color || "#ffffff"};
  border: 1px solid ${props => props.theme.colors.gray};
`;

export default ColorTile;
