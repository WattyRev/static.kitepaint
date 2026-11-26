import React from "react";
import { shallow } from "enzyme";
import Designs from "../Designs";

describe("Designs", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Designs />);
    expect(wrapper).toMatchSnapshot();
  });
  it("passes the page from the query string to the container", () => {
    const wrapper = shallow(<Designs location={{ search: "?page=4" }} />);
    expect(wrapper.find("DesignsContainer").prop("page")).toEqual(4);
  });
  it("defaults to the first page", () => {
    const wrapper = shallow(<Designs location={{ search: "" }} />);
    expect(wrapper.find("DesignsContainer").prop("page")).toEqual(1);
  });
  it("replaces the URL with the last page when the page is out of range", () => {
    const history = { replace: jest.fn() };
    const wrapper = shallow(
      <Designs location={{ search: "?page=99" }} history={history} />
    );
    wrapper.find("DesignsContainer").prop("onPageOutOfRange")(5);
    expect(history.replace).toHaveBeenCalledWith("/designs?page=5");
  });
});
