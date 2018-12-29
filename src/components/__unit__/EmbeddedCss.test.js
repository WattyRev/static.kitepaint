import React from "react";
import { shallow } from "enzyme";
import ReactDOM from "react-dom";
import EmbeddedCss from "../EmbeddedCss";

jest.mock("react-dom");

describe("EmbeddedCss", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("renders a stylesheet if we are embedded and have external css", () => {
    expect.assertions(1);
    shallow(
      <EmbeddedCss _isEmbedded _externalCss="http://stuff.com/fuckyou.css" />
    );
    expect(ReactDOM.createPortal).toHaveBeenCalled();
  });
  it("Does not render a stylesheet if we are not embedded but have external css", () => {
    expect.assertions(1);
    shallow(
      <EmbeddedCss
        _isEmbedded={false}
        _externalCss="http://stuff.com/fuckyou.css"
      />
    );
    expect(ReactDOM.createPortal).not.toHaveBeenCalled();
  });
  it("Does not render a stylesheet if we are embedded but have no external css", () => {
    expect.assertions(1);
    shallow(<EmbeddedCss _isEmbedded={false} _externalCss="" />);
    expect(ReactDOM.createPortal).not.toHaveBeenCalled();
  });
});
