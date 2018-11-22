import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../theme";
import Dropdown, { StyledDropdown, Item, Spacer } from "../Dropdown";

describe("Dropdown", () => {
  it("renders", () => {
    shallow(
      <Dropdown dropdownContent={() => <div>test</div>}>
        {() => <div>test2</div>}
      </Dropdown>
    );
  });
  it("renders when using the provided components", () => {
    shallow(
      <Dropdown dropdownContent={() => <div>test</div>}>
        {data => (
          <React.Fragment>
            <data.components.Item>Item</data.components.Item>
            <data.components.Spacer />
          </React.Fragment>
        )}
      </Dropdown>
    );
  });
  it("renders the dropdown content when openDropdown is triggered", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <Dropdown dropdownContent={() => <div className="target">test</div>}>
        {data => (
          <div className="click-open" onClick={data.actions.openDropdown}>
            test2
          </div>
        )}
      </Dropdown>
    );
    expect(wrapper.find(".target")).toHaveLength(0);
    wrapper.find(".click-open").simulate("click");
    expect(wrapper.find(".target")).toHaveLength(1);
  });
  it("removes the dropdown content when closeDropdown is triggered", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <Dropdown dropdownContent={() => <div className="target">test</div>}>
        {data => (
          <React.Fragment>
            <div className="click-open" onClick={data.actions.openDropdown}>
              test2
            </div>
            <div className="click-close" onClick={data.actions.closeDropdown}>
              test3
            </div>
          </React.Fragment>
        )}
      </Dropdown>
    );
    wrapper.find(".click-open").simulate("click");
    expect(wrapper.find(".target")).toHaveLength(1);
    wrapper.find(".click-close").simulate("click");
    expect(wrapper.find(".target")).toHaveLength(0);
  });
  it("can remove the dropdown when triggered within the dropdown", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <Dropdown
        dropdownContent={data => (
          <React.Fragment>
            <div className="target">test</div>
            <div className="click-close" onClick={data.actions.closeDropdown}>
              test3
            </div>
          </React.Fragment>
        )}
      >
        {data => (
          <div className="click-open" onClick={data.actions.openDropdown}>
            test2
          </div>
        )}
      </Dropdown>
    );
    wrapper.find(".click-open").simulate("click");
    expect(wrapper.find(".target")).toHaveLength(1);
    wrapper.find(".click-close").simulate("click");
    expect(wrapper.find(".target")).toHaveLength(0);
  });

  describe("StyledDropdown", () => {
    it("renders", () => {
      const wrapper = mount(<StyledDropdown theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });

  describe("Item", () => {
    it("renders", () => {
      const wrapper = mount(<Item theme={Theme} />);
      expect(wrapper.find("a")).toHaveLength(1);
    });
  });
  describe("Spacer", () => {
    it("renders", () => {
      const wrapper = mount(<Spacer theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });
});
