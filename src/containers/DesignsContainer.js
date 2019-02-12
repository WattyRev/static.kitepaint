import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRecentDesigns } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";
import { makeCancelable } from "../utils";

const PAGE_SIZE = 50;

/**
 * Manages pagination for the DesignsContainer
 */
export class Counter extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    count: 0
  };

  /**
   * Increment the count by the provided page size
   * @param  {Number} pageSize
   */
  updateCount = pageSize => {
    const count = this.state.count;
    this.setState({
      count: count + pageSize
    });
  };

  render() {
    return this.props.children({
      actions: {
        updateCount: this.updateCount
      },
      props: {
        count: this.state.count
      }
    });
  }
}

export class Data extends React.Component {
  static propTypes = {
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

  state = {
    /**
     *
     * @type {Boolean}
     */
    isLoading: true,
    hasMore: true
  };

  /**
   * Fetches the designs. Fetches more designs each time it is
   * called.
   * Retrurns a Promise that is already cancelable.
   *
   * @param {Boolean} [setLoading=true] If true, will toggle isLoading on state.
   * @return {Promise}
   */
  _fetchDesigns = (setLoading = true) => {
    if (setLoading) {
      this.setState({ isLoading: true });
    }
    const request = makeCancelable(
      this.props.onFetchDesigns(
        {
          limit: `${this.props.loadedCount}, ${this.props.loadedCount +
            PAGE_SIZE}`,
          publicOnly: true
        },
        false // dont cache this request
      )
    );
    request.promise
      .then(response => {
        // Get the number of items returned
        const count = response.data.length;

        this.setState({
          // The API will return all of the items so far. If it
          // returned fewer than the previous count + the page size,
          // then there are no more items to retrieve.
          hasMore: count >= this.props.loadedCount + PAGE_SIZE
        });
        this.props.onChangeLoadedCount(count);

        if (setLoading) {
          this.setState({
            isLoading: false
          });
        }
      })
      .catch(() => {});
    this.cancelablePromises.push(request);
    return request.promise;
  };

  componentDidMount() {
    // fetch designs, products, and manufacturers
    const designRequest = this._fetchDesigns(false);
    const productRequest = makeCancelable(this.props.onFetchProducts());
    const manufacturerRequest = makeCancelable(
      this.props.onFetchManufacturers()
    );

    this.cancelablePromises.push(productRequest);
    this.cancelablePromises.push(manufacturerRequest);

    Promise.all([
      designRequest,
      productRequest.promise,
      manufacturerRequest.promise
    ])
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(responses => {
        if (responses[0].isCanceled) {
          return;
        }
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillUnmount() {
    this.cancelablePromises.forEach(cancelable => cancelable.cancel());
  }

  cancelablePromises = [];

  render() {
    return this.props.children({
      actions: {
        loadMore: this._fetchDesigns
      },
      props: {
        hasMore: this.state.hasMore,
        isLoading: this.state.isLoading,
        designs: this.props.designs,
        products: this.props.products,
        manufacturers: this.props.manufacturers
      }
    });
  }
}

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

const DataConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Data);

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
