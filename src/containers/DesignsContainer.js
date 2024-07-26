import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRecentDesigns } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

const PAGE_SIZE = 50;

/**
 * Manages pagination for the DesignsContainer
 */
export const Counter = ({ children }) => {
  const [count, setCount] = useState(0);

  const updateCount = pageSize => {
    setCount(count + pageSize);
  };
  return children({ actions: { updateCount }, props: { count } });
};
Counter.propTypes = {
  children: PropTypes.func.isRequired
};

export const Data = ({
  loadedCount,
  onChangeLoadedCount,
  onFetchDesigns,
  onFetchProducts,
  onFetchManufacturers,
  designs,
  products,
  manufacturers,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetches the designs. Fetches more designs each time it is
   * called.
   * Retrurns a Promise that is already cancelable.
   *
   * @param {Boolean} [setLoading=true] If true, will toggle isLoading on state.
   * @return {Promise}
   */
  const fetchDesigns = async (setLoading = true) => {
    if (setLoading) {
      setIsLoading(true);
    }
    const fetchedDesigns = await onFetchDesigns(
      {
        limit: `${loadedCount}, ${loadedCount + PAGE_SIZE}`,
        publicOnly: true
      },
      false // dont cache this request
    );

    // Get the number of items returned
    const count = fetchedDesigns.data.length;
    setHasMore(count >= loadedCount + PAGE_SIZE);
    onChangeLoadedCount(count);
    if (setLoading) {
      setIsLoading(false);
    }
    return fetchedDesigns;
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          fetchDesigns(false),
          onFetchProducts(),
          onFetchManufacturers()
        ]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  return children({
    actions: {
      loadMore: fetchDesigns
    },
    props: {
      hasMore: hasMore,
      isLoading: isLoading,
      designs,
      products,
      manufacturers
    }
  });
};

Data.propTypes = {
  /** Indicates how many items should be loaded for sake of pagination. Provided as a prop so it can be provided in mapDispatchToProps. */
  loadedCount: PropTypes.number.isRequired,
  /** Called after each request for designs to increase the
   loadedCount. Is provided with the amount to increase the count
   by as the first param.*/
  onChangeLoadedCount: PropTypes.func.isRequired,
  /**
   * A function that triggers the retieval of the user's designs. Provided by Redux.
   */
  onFetchDesigns: PropTypes.func.isRequired,
  /**
   * A function that triggers the retrieval of products. Provided by Redux.
   */
  onFetchProducts: PropTypes.func.isRequired,
  /**
   * A function that triggers the retireval of manufacturers. Provided by Redux.
   */
  onFetchManufacturers: PropTypes.func.isRequired,
  /**
   * The designs created by the current user. Provided by Redux.
   */
  designs: PropTypes.arrayOf(PropTypes.instanceOf(Design)).isRequired,
  /**
   * All of the products, indexed by ID. Provided by Redux.
   */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)).isRequired,
  /**
   * All the manufacturers, indexed by ID. Provided by Redux.
   */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  /**
   * A function that renders content.
   */
  children: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  designs: getRecentDesigns(state, props.loadedCount),
  products: getProductsWithIndex(state),
  manufacturers: getManufacturersWithIndex(state)
});

const mapDispatchToProps = {
  onFetchDesigns: GET_DESIGNS,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS
};

const DataConnected = connect(mapStateToProps, mapDispatchToProps)(Data);

/**
 * Retrieves and manages public designs with pagination
 */
const DesignsContainer = ({ children }) => (
  <Counter>
    {counter => (
      <DataConnected
        loadedCount={counter.props.count}
        onChangeLoadedCount={counter.actions.updateCount}
      >
        {data => children(data)}
      </DataConnected>
    )}
  </Counter>
);

DesignsContainer.propTypes = {
  children: PropTypes.func.isRequired
};

export default DesignsContainer;
