import styled from "styled-components";

const Tile = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
`;

export default Tile;
