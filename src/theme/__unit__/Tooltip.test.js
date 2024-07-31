import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
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
      render(
        <ThemeProvider theme={Theme}>
          <StyleWrapper data-testid="target" {...props} />
        </ThemeProvider>
      );
      expect(screen.getByTestId("target")).toBeInTheDocument();
    });
    describe("top", () => {
      it("sets the top styling based on the provided value", () => {
        props.top = 100;
        render(
          <ThemeProvider theme={Theme}>
            <StyleWrapper data-testid="target" {...props} />
          </ThemeProvider>
        );
        expect(screen.getByTestId("target")).toHaveStyleRule("top", "100px");
      });
    });
    describe("left", () => {
      it("sets the left styling based on the provided value", () => {
        props.left = 11;
        render(
          <ThemeProvider theme={Theme}>
            <StyleWrapper data-testid="target" {...props} />
          </ThemeProvider>
        );
        expect(screen.getByTestId("target")).toHaveStyleRule("left", "11px");
      });
    });
    describe("fadeSpeed", () => {
      it("sets the animation speed based on the provied fadeSpeed value", () => {
        props.fadeSpeed = 0.25;
        render(
          <ThemeProvider theme={Theme}>
            <StyleWrapper data-testid="target" {...props} />
          </ThemeProvider>
        );
        expect(screen.getByTestId("target")).toHaveStyleRule(
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
          render(
            <ThemeProvider theme={Theme}>
              <StyleWrapper data-testid="target" {...props} />
            </ThemeProvider>
          );
          expect(screen.getByTestId("target")).toHaveStyleRule("opacity", "0");
        });
        it("makes the tooltip fade out", () => {
          render(
            <ThemeProvider theme={Theme}>
              <StyleWrapper data-testid="target" {...props} />
            </ThemeProvider>
          );
          expect(screen.getByTestId("target")).toHaveStyleRule(
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
          render(
            <ThemeProvider theme={Theme}>
              <StyleWrapper data-testid="target" {...props} />
            </ThemeProvider>
          );
          expect(screen.getByTestId("target")).toHaveStyleRule("opacity", "1");
        });
        it("makes the tooltip fade in", () => {
          render(
            <ThemeProvider theme={Theme}>
              <StyleWrapper data-testid="target" {...props} />
            </ThemeProvider>
          );
          expect(screen.getByTestId("target")).toHaveStyleRule(
            "animation",
            expect.stringContaining(fadeIn.getName())
          );
        });
      });
    });
  });
  describe("TooltipIcon", () => {
    it("renders", () => {
      render(<TooltipIcon data-testid="target" theme={Theme} icon="info" />);
      expect(screen.getByTestId("target")).toBeInTheDocument();
    });
  });

  it("renders", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Tooltip data-testid="target">
          <div>hello</div>
        </Tooltip>
      </ThemeProvider>
    );
    expect(screen.getByTestId("target")).toBeInTheDocument();
  });

  it("displays the tooltip when hovering over the icon", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Tooltip>hello</Tooltip>
      </ThemeProvider>
    );
    await userEvent.hover(screen.getByTestId("tooltip-icon"));
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });
  it("removes the tooltip when the mouse leaves the icon", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Tooltip fadeSpeedMs={1}>hello</Tooltip>
      </ThemeProvider>
    );
    await userEvent.hover(screen.getByTestId("tooltip-icon"));
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    await userEvent.unhover(screen.getByTestId("tooltip-icon"));
    expect(screen.queryByTestId("tooltip")).toBeNull();
  });
});
