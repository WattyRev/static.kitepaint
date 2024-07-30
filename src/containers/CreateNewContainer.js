import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

export const CreateNewContainer = ({
  product,
  manufacturer,
  onRequestProduct,
  onRequestManufacturer,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([onRequestProduct(), onRequestManufacturer()]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  return children({
    props: {
      isLoading,
      product,
      manufacturer
    }
  });
};

CreateNewContainer.propTypes = {
  /**
   * The ID of the product to get information about.
   */
  productId: PropTypes.string.isRequired,
  /**
   * The product. Provided by redux.
   */
  product: PropTypes.instanceOf(Product),
  /**
   * The manufactuer of the product. Provided by redux.
   */
  manufacturer: PropTypes.instanceOf(Manufacturer),
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
  product: getProductById(state, props.productId),
  manufacturer: getManufacturerByProductId(state, props.productId)
});

const mapDispatchToProps = {
  onRequestProduct: GET_PRODUCTS,
  onRequestManufacturer: GET_MANUFACTURERS
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewContainer);
