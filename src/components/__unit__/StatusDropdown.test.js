import React from "react";
import { shallow } from "enzyme";
import { Item } from "../../theme/Dropdown";
import { getMockDesign } from "../../models/design";
import Status from "../../models/status";
import { Dropdown } from "../../theme";
import StatusDropdown, { Content } from "../StatusDropdown";

describe("StatusDropdown", () => {
  describe("Content", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        current: "0",
        options: [
          {
            value: "0",
            label: "Private",
            disabled: false
          }
        ],
        onClick: jest.fn(),
        DropdownItem: Item
      };
    });
    it("renders", () => {
      shallow(<Content {...defaultProps} />);
    });
    it("displays a dropdown item for each option", () => {
      expect.assertions(1);
      defaultProps.options = [
        {
          value: "0",
          label: "Private",
          disabled: false
        },
        {
          value: "1",
          label: "Unlisted",
          disabled: false
        },
        {
          value: "2",
          label: "Public",
          disabled: false
        }
      ];
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(Item)).toHaveLength(3);
    });
    it("calls onClick when the value when an option is clicked", () => {
      expect.assertions(1);
      const wrapper = shallow(<Content {...defaultProps} />);
      wrapper.find(Item).simulate("click");
      expect(defaultProps.onClick).toHaveBeenCalledWith("0");
    });
    it("does not calls onClick when the value when an option is clicked if it is disabled", () => {
      expect.assertions(1);
      defaultProps.options[0].disabled = true;
      const wrapper = shallow(<Content {...defaultProps} />);
      wrapper.find(Item).simulate("click");
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
  });

  let defaultProps;
  let dropdownContentData;
  beforeEach(() => {
    defaultProps = {
      design: getMockDesign(),
      onChange: jest.fn()
    };
    dropdownContentData = {
      actions: {
        close: jest.fn()
      },
      components: {
        Item
      }
    };
  });
  it("renders", () => {
    shallow(<StatusDropdown {...defaultProps}>{() => <div />}</StatusDropdown>);
  });
  it("provides the expected data", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {data => (
          <React.Fragment>
            <div className="props">{Object.keys(data.props).join(", ")}</div>
            <div className="actions">
              {Object.keys(data.actions).join(", ")}
            </div>
          </React.Fragment>
        )}
      </StatusDropdown>
    );
    expect(
      wrapper
        .render()
        .find(".props")
        .text()
    ).toEqual("isOpen, currentStatus, isPending");
    expect(
      wrapper
        .render()
        .find(".actions")
        .text()
    ).toEqual("open, close");
  });
  it("correctly enables status options", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>{() => <div />}</StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    expect(dropdownContent.find(Content).prop("options")).toEqual([
      {
        value: Status.PUBLIC,
        label: Status[Status.PUBLIC],
        disabled: false
      },
      {
        value: Status.UNLISTED,
        label: Status[Status.UNLISTED],
        disabled: false
      },
      {
        value: Status.PRIVATE,
        label: Status[Status.PRIVATE],
        disabled: false
      }
    ]);
  });
  it("correctly disables status options", () => {
    expect.assertions(1);
    defaultProps.design.productStatus = Status.UNLISTED;
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>{() => <div />}</StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    expect(dropdownContent.find(Content).prop("options")).toEqual([
      {
        value: Status.PUBLIC,
        label: Status[Status.PUBLIC],
        disabled: true
      },
      {
        value: Status.UNLISTED,
        label: Status[Status.UNLISTED],
        disabled: false
      },
      {
        value: Status.PRIVATE,
        label: Status[Status.PRIVATE],
        disabled: false
      }
    ]);
  });
  it("correctly sets currentStatus when the product is more restrictive", () => {
    expect.assertions(1);
    defaultProps.design.productStatus = Status.UNLISTED;
    defaultProps.design.status = Status.PUBLIC;
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {data => (
          <React.Fragment>
            <div className="status">{data.props.currentStatus}</div>
          </React.Fragment>
        )}
      </StatusDropdown>
    );
    expect(
      wrapper
        .render()
        .find(".status")
        .text()
    ).toEqual(Status[Status.UNLISTED]);
  });
  it("correctly sets currentStatus when the design is more restrictive", () => {
    expect.assertions(1);
    defaultProps.design.productStatus = Status.UNLISTED;
    defaultProps.design.status = Status.PRIVATE;
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {data => (
          <React.Fragment>
            <div className="status">{data.props.currentStatus}</div>
          </React.Fragment>
        )}
      </StatusDropdown>
    );
    expect(
      wrapper
        .render()
        .find(".status")
        .text()
    ).toEqual(Status[Status.PRIVATE]);
  });
  it("calls onChange when the status changes", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>{() => <div />}</StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    dropdownContent.find(Content).prop("onClick")("boogers");
    expect(defaultProps.onChange).toHaveBeenCalledWith("boogers");
  });
  it("does not set isPending if onChange does not return a promise", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {dropdown => (
          <div className="pending">
            {dropdown.props.isPending ? "true" : "false"}
          </div>
        )}
      </StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    dropdownContent.find(Content).prop("onClick")("boogers");
    expect(
      wrapper
        .render()
        .find(".pending")
        .text()
    ).toEqual("false");
  });
  it("sets isPending if onChange returns a promise", () => {
    expect.assertions(1);
    defaultProps.onChange.mockResolvedValue();
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {dropdown => (
          <div className="pending">
            {dropdown.props.isPending ? "true" : "false"}
          </div>
        )}
      </StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    dropdownContent.find(Content).prop("onClick")("boogers");
    expect(
      wrapper
        .render()
        .find(".pending")
        .text()
    ).toEqual("true");
  });
  it("restores isPending when onChange resolves", () => {
    expect.assertions(1);
    defaultProps.onChange.mockResolvedValue();
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {dropdown => (
          <div className="pending">
            {dropdown.props.isPending ? "true" : "false"}
          </div>
        )}
      </StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    return dropdownContent
      .find(Content)
      .prop("onClick")("boogers")
      .then(() => {
        expect(
          wrapper
            .render()
            .find(".pending")
            .text()
        ).toEqual("false");
      });
  });
  it("restores isPending when onChange rejects", () => {
    expect.assertions(1);
    defaultProps.onChange.mockRejectedValue();
    const wrapper = shallow(
      <StatusDropdown {...defaultProps}>
        {dropdown => (
          <div className="pending">
            {dropdown.props.isPending ? "true" : "false"}
          </div>
        )}
      </StatusDropdown>
    );
    const dropdownContent = shallow(
      <div>
        {wrapper.find(Dropdown).prop("dropdownContent")(dropdownContentData)}
      </div>
    );
    return dropdownContent
      .find(Content)
      .prop("onClick")("boogers")
      .catch(() => {
        expect(
          wrapper
            .render()
            .find(".pending")
            .text()
        ).toEqual("false");
      });
  });
});
