import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ActivateContainer from "../../containers/ActivateContainer";
import { Spacer, H1, P, Loading, Error } from "../../theme";

const StyleWrapper = styled.div`
  max-width: 1280px;
  padding: 16px;
  margin: 0 auto;
`;

const Activate = ({ match }) => (
  <StyleWrapper>
    <H1>Account Activation</H1>
    <Spacer bottom="md" />
    <ActivateContainer
      userId={match.params.userId}
      activationCode={match.params.activationCode}
    >
      {activation => {
        if (activation.props.isPending) {
          return <Loading />;
        }

        if (activation.props.error) {
          return (
            <React.Fragment>
              <P>Account activation was unsucccessful.</P>
              <Spacer bottom="sm" />
              <Error>
                <P>{activation.props.error}</P>
              </Error>
            </React.Fragment>
          );
        }

        return (
          <P className="testing_success">Your account has been activated!</P>
        );
      }}
    </ActivateContainer>
  </StyleWrapper>
);

Activate.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      activationCode: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Activate;
