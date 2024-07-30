import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import { getDesignById } from "../redux/modules/designs";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_DESIGN, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

/**
 * Provides information about a specific product.
 */
export const EditContainer = ({
  designId,
  design,
  product,
  manufacturer,
  user,
  onRequestDesign,
  onRequestProduct,
  onRequestManufacturer,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          onRequestDesign(designId),
          onRequestProduct(),
          onRequestManufacturer()
        ]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  const userMatchesDesign = design?.get("user") === user?.id;
  return children({
    props: {
      design: userMatchesDesign ? design : null,
      isLoading,
      product,
      manufacturer,
      user
    }
  });
};
EditContainer.propTypes = {
  /**
   * The ID of the design to get information about.
   */
  designId: PropTypes.string.isRequired,
  /**
   * The design being edited
   */
  design: PropTypes.instanceOf(Design),
  /**
   * The product. Provided by redux.
   */
  product: PropTypes.instanceOf(Product),
  /**
   * The manufactuer of the product. Provided by redux.
   */
  manufacturer: PropTypes.instanceOf(Manufacturer),
  /**
   * The currently logged in user
   */
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  /**
   * A function to request the design be fetched. Provided by redux.
   */
  onRequestDesign: PropTypes.func.isRequired,
  /**
   * A function to request the product be fetched. Provided by redux.
   */
  onRequestProduct: PropTypes.func.isRequired,
  /**
   * A function to request the manufacturer of the product be fetched. Provided by redux.
   */
  onRequestManufacturer: PropTypes.func.isRequired,
  /**
   * A function that returns the content to be rendered.
   */
  children: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  user: getUser(state),
  product: getProductById(state, props.design && props.design.get("product")),
  manufacturer: getManufacturerByProductId(
    state,
    props.design && props.design.get("product")
  )
});

const mapDispatchToProps = {
  onRequestDesign: GET_DESIGN,
  onRequestProduct: GET_PRODUCTS,
  onRequestManufacturer: GET_MANUFACTURERS
};

const withoutDesign = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContainer);

export default connect((state, props) => ({
  design: getDesignById(state, props.designId)
}))(withoutDesign);
