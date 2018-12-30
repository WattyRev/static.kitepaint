import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/design";
import Status from "../../models/status";
import ShareModal, { Content } from "../ShareModal";

describe("ShareModal", () => {
  describe("Content", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        design: getMockDesign(),
        onClose: jest.fn(),
        onDownload: jest.fn()
      };
    });
    it("renders", () => {
      shallow(<Content {...defaultProps} />);
    });
    it("shows the public URL if the design is public", () => {
      expect.assertions(1);
      defaultProps.design.status = Status.PUBLIC;
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".testing_public-url")).toHaveLength(1);
    });
    it("shows the public URL if the design is unlisted", () => {
      expect.assertions(1);
      defaultProps.design.status = Status.UNLISTED;
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".testing_public-url")).toHaveLength(1);
    });
    it("does not show the public url if the design is private", () => {
      expect.assertions(1);
      defaultProps.design.status = Status.PRIVATE;
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".testing_public-url")).toHaveLength(0);
    });
    it("shows the share content if a design is provided", () => {
      expect.assertions(1);
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".testing_share-content")).toHaveLength(1);
    });
    it("does not show the share content if a design is not provided", () => {
      expect.assertions(1);
      defaultProps.design = null;
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".testing_share-content")).toHaveLength(0);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      design: getMockDesign()
    };
  });
  it("renders", () => {
    shallow(<ShareModal {...defaultProps}>{() => <div />}</ShareModal>);
  });
  it("opens when told", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <ShareModal {...defaultProps}>
        {modal => <button className="open" onClick={modal.actions.open} />}
      </ShareModal>
    );
    expect(wrapper.prop("isOpen")).toEqual(false);
    wrapper.find(".open").simulate("click");
    expect(wrapper.prop("isOpen")).toEqual(true);
  });
});
