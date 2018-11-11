import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CHECK_LOGIN } from "../redux/actions";
import { getCheckingLogin } from "../redux/modules/user";
import setupFontAwesome from "../theme/FontAwesome.js";

setupFontAwesome();

export class AppContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    isCheckingLogin: PropTypes.bool.isRequired,
    onCheckLogin: PropTypes.func.isRequired
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    props.onCheckLogin().catch(() => {});
  }

  render() {
    if (this.props.isCheckingLogin) {
      return "";
    }
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  isCheckingLogin: getCheckingLogin(state)
});

const mapDispatchToProps = {
  onCheckLogin: CHECK_LOGIN
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
