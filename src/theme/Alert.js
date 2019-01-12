/* eslint-disable no-console */
import React from "react";
import styled, { css, keyframes } from "styled-components";
import P from "./P";

/**
 * Triggers a success alert to display with the provided message.
 * @param  {String} message message
 */
export function success(message) {
  window.kp_alert({
    message,
    type: "success"
  });
}

/**
 * Triggers a warning alert to display with the provided message.
 * @param  {String} message message
 */
export function warn(message) {
  window.kp_alert({
    message,
    type: "warning"
  });
}

/**
 * Triggers an error alert to display with the provided message.
 * @param  {String} message message
 */
export function error(message) {
  window.kp_alert({
    message,
    type: "error"
  });
}

/**
 * Styling for the element that contains all of the alerts.
 */
const AlertWrapper = styled.div`
  position: fixed;
  top: 7vh;
  right: 0;
  z-index: 1000;
`;

/** The animation used when an alert is created. */
const alertEntryAnimation = keyframes`
  0% {
    transform: translateX(120%);
  }
  80% {
    transform: translateX(-5%);
  }
  100% {
    transform: translateX(0);
  }
`;

/**
 * An individual alert
 * @prop {Boolean} removing Causes the alert to animate away before being removed from the DOM
 * @prop {"success"|"warning"|"error"} alertType
 */
export const StyledAlert = styled.div`
  padding: 8px;
  box-sizing: border-box;
  width: 300px;
  position: relative;
  max-height: 500px
  transition: .2s max-height, .2s padding;
  transition-delay: .2s;
  ${props =>
    props.removing
      ? css`
          max-height: 0;
          padding: 0;
        `
      : null};

  > div {
    box-sizing: border-box;
    padding: 8px 8px 8px 12px;
    background: ${props => props.theme.colors.grayDarker};
    border-radius: 4px;
    width: 100%;
    box-shadow: 0 1px 2px 0px ${props => props.theme.colors.black};
    transition: 0.2s transform;
    position: relative;
    animation: ${alertEntryAnimation} .3s ease-out 1

    ${props =>
      props.removing
        ? css`
            transform: translateX(120%);
          `
        : null};

    &:before {
      display: block;
      position: absolute;
      content: "";
      width: 4px;
      height: 100%;
      top: 0;
      left: 0;

      ${props =>
        props.alertType === "error"
          ? css`
              background: ${props.theme.colors.red};
            `
          : null};
      ${props =>
        props.alertType === "success"
          ? css`
              background: ${props.theme.colors.green};
            `
          : null};
      ${props =>
        props.alertType === "warning"
          ? css`
              background: ${props.theme.colors.orange};
            `
          : null};
    }
  }
`;

class Alert extends React.Component {
  state = {
    /** An array of alerts being displayed. */
    alerts: [
      // { Example data format
      //   // A unique ID for this alert
      //   id: "abc",
      //   // The displayed message
      //   message: "boogers",
      //   // The type of alert (error, warning, or success)
      //   type: "error",
      //   // The time that it was created (ms)
      //   created: 123,
      //   // Indication if the alert is about to be removed
      //   removing: false
      // },
    ]
  };

  componentDidMount() {
    if (window.kp_alert) {
      console.error(
        "More than one instance of Alert is rendered. Only one Alert should be rendered at a time."
      );
      return;
    }
    window.kp_alert = alert => {
      return this.handleIncomingAlert(alert);
    };
  }

  componentWillUnmount() {
    delete window.kp_alert;
  }

  handleIncomingAlert = alert => {
    const { message, type, duration = 5000 } = alert;
    if (!message || !type) {
      console.error(
        "Alert called with no message or type. A type and message must be supplied."
      );
      return;
    }
    if (!["error", "success", "warning"].includes(type)) {
      console.error(
        `Alert called with ${type} as type. Only "error", "success", and "warning" are accepted.`
      );
      return;
    }

    // Create the alert and store it on the state with the others
    const currentAlerts = this.state.alerts;
    const currentTime = new Date().getTime();
    const id = `${currentTime}${type}${message}`;
    currentAlerts.push({
      message,
      type,
      created: currentTime,
      id,
      removing: false
    });
    this.setState({
      alerts: currentAlerts
    });

    // Wait the specified duration to remove the alert
    return new Promise(resolve => {
      window.setTimeout(() => {
        // Only remove the alert if it still exists
        if (this.state.alerts.find(alert => alert.id === id)) {
          this.removeAlert(id);
        }
        resolve();
      }, duration);
    });
  };

  removeAlert = id => {
    // Indicate on the alert that it will be removed soon
    const updatedAlerts = this.state.alerts.map(alert => {
      if (alert.id === id) {
        alert.removing = true;
      }
      return alert;
    });
    this.setState({
      alerts: updatedAlerts
    });

    // Give the alert time to animate out before removing it from the DOM
    window.setTimeout(() => {
      const prunedAlerts = this.state.alerts.filter(alert => alert.id !== id);
      this.setState({
        alerts: prunedAlerts
      });
    }, 1000);
  };

  render() {
    return (
      <AlertWrapper>
        {this.state.alerts.map(alert => (
          <StyledAlert
            alertType={alert.type}
            removing={alert.removing}
            key={alert.id}
          >
            <div>
              <P isLight>{alert.message}</P>
            </div>
          </StyledAlert>
        ))}
      </AlertWrapper>
    );
  }
}

export default Alert;
