import React from "react";
import { shallow } from "enzyme";
import DesignsContainer, { Counter, Data } from "../DesignsContainer";

describe("DesignsContainer", () => {
  it("renders", () => {
    shallow(<DesignsContainer>{() => <div />}</DesignsContainer>);
  });
  describe("Counter", () => {
    it("renders", () => {
      shallow(<Counter>{() => <div />}</Counter>);
    });
    it("provides the count to the children", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Counter>
          {data => <div className="count">{data.props.count}</div>}
        </Counter>
      );
      expect(wrapper.find(".count").text()).toEqual("0");
    });
    it("increases the count by the provided amount when updateCount is called", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Counter>
          {data => (
            <React.Fragment>
              <div
                className="increment"
                onClick={() => data.actions.updateCount(7)}
              />
              <div className="count">{data.props.count}</div>
            </React.Fragment>
          )}
        </Counter>
      );
      wrapper.find(".increment").simulate("click");
      expect(wrapper.find(".count").text()).toEqual("7");
    });
  });
  describe("Data", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        loadedCount: 0,
        onChangeLoadedCount: jest.fn(),
        onFetchDesigns: jest.fn().mockResolvedValue({
          data: []
        }),
        onFetchProducts: jest.fn().mockResolvedValue(),
        onFetchManufacturers: jest.fn().mockResolvedValue(),
        designs: [],
        products: {},
        manufacturers: {}
      };
    });
    it("renders", () => {
      shallow(<Data {...defaultProps}>{() => <div />}</Data>);
    });
    it("unmounts without throwing errors", () => {
      const wrapper = shallow(<Data {...defaultProps}>{() => <div />}</Data>);
      wrapper.unmount();
    });
    it("fetches designs, products, and manufacturers immediately", () => {
      expect.assertions(3);
      shallow(<Data {...defaultProps}>{() => <div />}</Data>);
      expect(defaultProps.onFetchDesigns).toHaveBeenCalled();
      expect(defaultProps.onFetchProducts).toHaveBeenCalled();
      expect(defaultProps.onFetchManufacturers).toHaveBeenCalled();
    });
    it("fetches designs when loadMore is called", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Data {...defaultProps}>
          {data => (
            <div className="load-more" onClick={data.actions.loadMore} />
          )}
        </Data>
      );
      wrapper.find(".load-more").simulate("click");
      expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(2);
    });
  });
});
