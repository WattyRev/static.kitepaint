import { connect } from "react-redux";
import { UPDATE_DESIGN } from "../redux/actions";
import DesignSettingsModal from "../components/DesignSettingsModal";

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: UPDATE_DESIGN
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DesignSettingsModal);
