import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../theme";
import { setupFontAwesome } from "../Icon";
import Tooltip, {
  StyleWrapper,
  TooltipIcon,
  fadeIn,
  fadeOut
} from "../Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    setupFontAwesome();
  });
  describe("StyleWrapper", () => {
    let props;
    beforeEach(() => {
      props = {
        theme: Theme,
        top: 10,
        left: 10,
        removing: false,
        fadeSpeed: 0.2
      };
    });
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper {...props} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
    describe("top", () => {
      it("sets the top styling based on the provided value", () => {
        props.top = 100;
        const wrapper = mount(<StyleWrapper {...props} />);
        expect(wrapper).toHaveStyleRule("top", "100px");
      });
    });
    describe("left", () => {
      it("sets the left styling based on the provided value", () => {
        props.left = 11;
        const wrapper = mount(<StyleWrapper {...props} />);
        expect(wrapper).toHaveStyleRule("left", "11px");
      });
    });
    describe("fadeSpeed", () => {
      it("sets the animation speed based on the provied fadeSpeed value", () => {
        props.fadeSpeed = 0.25;
        const wrapper = mount(<StyleWrapper {...props} />);
        expect(wrapper).toHaveStyleRule(
          "animation",
          expect.stringContaining(".25s")
        );
      });
    });
    describe("removing", () => {
      describe("if true", () => {
        beforeEach(() => {
          props.removing = true;
        });
        it("makes the tooltip transparent", () => {
          const wrapper = mount(<StyleWrapper {...props} />);
          expect(wrapper).toHaveStyleRule("opacity", "0");
        });
        it("makes the tooltip fade out", () => {
          const wrapper = mount(<StyleWrapper {...props} />);
          expect(wrapper).toHaveStyleRule(
            "animation",
            expect.stringContaining(fadeOut.getName())
          );
        });
      });
      describe("if false", () => {
        beforeEach(() => {
          props.removing = false;
        });
        it("makes the tooltip opaque", () => {
          const wrapper = mount(<StyleWrapper {...props} />);
          expect(wrapper).toHaveStyleRule("opacity", "1");
        });
        it("makes the tooltip fade in", () => {
          const wrapper = mount(<StyleWrapper {...props} />);
          expect(wrapper).toHaveStyleRule(
            "animation",
            expect.stringContaining(fadeIn.getName())
          );
        });
      });
    });
  });
  describe("TooltipIcon", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<TooltipIcon theme={Theme} icon="info" />);
      expect(wrapper.find("svg")).toHaveLength(1);
    });
  });

  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Tooltip>hello</Tooltip>);
    expect(wrapper).toMatchSnapshot();
  });

  it("displays the tooltip when hovering over the icon", () => {
    expect.assertions(1);
    const wrapper = shallow(<Tooltip>hello</Tooltip>);
    wrapper.find(TooltipIcon).simulate("mouseEnter", {
      target: {
        getBoundingClientRect: jest.fn(() => ({
          x: 10,
          y: 11
        }))
      }
    });
    expect(wrapper.find(".testing_tooltip")).toHaveLength(1);
  });
  it("removes the tooltip when the mouse leaves the icon", () => {
    expect.assertions(3);
    const wrapper = shallow(<Tooltip fadeSpeedMs={1}>hello</Tooltip>);
    const icon = wrapper.find(TooltipIcon);
    icon.simulate("mouseEnter", {
      target: {
        getBoundingClientRect: jest.fn(() => ({
          x: 10,
          y: 11
        }))
      }
    });
    expect(wrapper.find(".testing_tooltip")).toHaveLength(1);
    icon.simulate("mouseLeave", {});
    expect(wrapper.find(".testing_tooltip")).toHaveLength(1);
    return new Promise(resolve => {
      window.setTimeout(() => {
        expect(wrapper.find(".testing_tooltip")).toHaveLength(0);
        resolve();
      }, 10);
    });
  });
});
