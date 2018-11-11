import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import designShape from "../models/design";
import { getRecentDesigns } from "../redux/modules/designs";
import { GET_DESIGNS } from "../redux/actions";

/**
 * Provides information and actions about/for Designs.
 */
export class RecentDesignsContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    designs: PropTypes.arrayOf(designShape).isRequired,
    getDesigns: PropTypes.func.isRequired
  };

  componentDidMount() {
    // Get the designs, but limit the request to 6 since we don't need to show many.
    this.props.getDesigns({
      limit: 6
    });
  }

  render() {
    return this.props.children({
      actions: {},
      props: {
        designs: this.props.designs
      }
    });
  }
}

const mapStateToProps = state => ({
  designs: getRecentDesigns(state)
});

const mapDispatchToProps = {
  getDesigns: GET_DESIGNS
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentDesignsContainer);
