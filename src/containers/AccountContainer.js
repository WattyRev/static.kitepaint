import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";

export class AccountContainer extends React.Component {
  static propTypes = {
    /**
     * A function that renders content
     */
    children: PropTypes.func.isRequired,
    /**
     * Details about the current user. Provided by redux.
     */
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      isLoggedIn: PropTypes.bool,
      isLoggingIn: PropTypes.bool,
      username: PropTypes.string
    })
  };

  state = {
    confirmNewPassword: "",
    currentPassword: "",
    editingEmail: false,
    editingPassword: false,
    email: "",
    newPassword: ""
  };

  static getDerivedStateFromProps(props) {
    return {
      email: props.user.email
    };
  }

  handleToggleEditEmail = () => {
    this.setState({
      editingEmail: !this.state.editingEmail,
      email: this.props.user.email
    });
  };

  handleToggleEditPassword = () => {
    this.setState({
      editingPassword: !this.state.editingPassword,
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: ""
    });
  };

  handleEmailChange = email => {
    this.setState({
      email
    });
  };

  handleCurrentPasswordChange = currentPassword => {
    this.setState({
      currentPassword
    });
  };

  handleNewPasswordChange = newPassword => {
    this.setState({
      newPassword
    });
  };

  handleConfirmNewPasswordChange = confirmNewPassword => {
    this.setState({
      confirmNewPassword
    });
  };

  render() {
    return this.props.children({
      actions: {
        changeEmail: this.handleEmailChange,
        changeCurrentPassword: this.handleCurrentPasswordChange,
        changeNewPassword: this.handleNewPasswordChange,
        changeConfirmNewPassword: this.handleConfirmNewPasswordChange,
        toggleEditEmail: this.handleToggleEditEmail,
        toggleEditPassword: this.handleToggleEditPassword,
        updateAccount: () => {},
        deleteAccount: () => {}
      },
      props: {
        email: this.state.email,
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
        confirmNewPassword: this.state.confirmNewPassword,
        user: this.props.user,
        editingEmail: this.state.editingEmail,
        editingPassword: this.state.editingPassword
      }
    });
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
});

// const mapDispatchToProps = {
//   onLogOut: LOG_OUT,
//   onSetRecognition: SET_RECOGNIZED_USER
// };

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(AccountContainer);
