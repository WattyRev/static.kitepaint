import React from "react";
import { mount } from "enzyme";
import Theme from "../../theme";
import { setupFontAwesome } from "../Icon";
import Error from "../Error";

describe("Error", () => {
  beforeEach(() => {
    setupFontAwesome();
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(
      <Error className="some-error" theme={Theme}>
        error
      </Error>
    );
    expect(wrapper.find("div.some-error")).toHaveLength(1);
  });
});
