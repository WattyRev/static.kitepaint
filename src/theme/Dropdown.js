import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyleWrapper = styled.div`
  position: relative;
`;

const StyledDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  border-top-right-radius: 0;
  border: 1px solid ${props => props.theme.colors.silver};
  text-align: right;
`;

class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    dropdownContent: PropTypes.func.isRequired
  };
  state = {
    isOpen: false
  };

  autoCloseDropdown = event => {
    if (!this.state.isOpen) {
      return;
    }
    if (this.node.contains(event.target)) {
      return;
    }
    this.closeDropdown();
  };

  componentDidMount() {
    document.addEventListener("click", this.autoCloseDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.autoCloseDropdown);
  }

  openDropdown = () => {
    this.setState({
      isOpen: true
    });
  };
  closeDropdown = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    const renderData = {
      actions: {
        openDropdown: this.openDropdown,
        closeDropdown: this.closeDropdown
      },
      props: {
        isOpen: this.state.isOpen
      }
    };
    return (
      <StyleWrapper ref={node => (this.node = node)}>
        {this.props.children(renderData)}
        {this.state.isOpen && (
          <StyledDropdown>
            {this.props.dropdownContent(renderData)}
          </StyledDropdown>
        )}
      </StyleWrapper>
    );
  }
}

export default Dropdown;
