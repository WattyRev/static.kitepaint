import React from "react";
import { render, screen } from "@testing-library/react";
import { getMockDesign } from "../../models/Design";
import { RecentDesignsContainer } from "../RecentDesignsContainer";

describe("RecentDesignsContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [],
      manufacturers: {},
      products: {},
      getDesigns: jest.fn(),
      getManufacturers: jest.fn(),
      getProducts: jest.fn()
    };
  });
  it("renders", () => {
    render(
      <RecentDesignsContainer {...props}>
        {() => <div data-testid="target">test</div>}
      </RecentDesignsContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  it("triggers getDesigns when mounting", () => {
    render(
      <RecentDesignsContainer {...props}>
        {() => <div>test</div>}
      </RecentDesignsContainer>
    );
    expect(props.getDesigns).toHaveBeenCalledWith({ limit: 6 });
  });
  it("provides the designs in the render", () => {
    const design = getMockDesign({
      name: "my-design"
    });
    props.designs = [design];
    render(
      <RecentDesignsContainer {...props}>
        {data => (
          <div data-testid="testing_target">
            {data.props.designs.map(design => design.get("name"))}
          </div>
        )}
      </RecentDesignsContainer>
    );
    expect(screen.getByTestId("testing_target").textContent).toEqual(
      "my-design"
    );
  });
});
