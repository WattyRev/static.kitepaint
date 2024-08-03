import React from "react";
import { render } from "@testing-library/react";
import { LegacyRedirect } from "../LegacyRedirect";

describe("LegacyRedirect", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      history: {
        push: jest.fn(),
        location: {
          hash: ""
        }
      }
    };
  });
  it("renders", () => {
    render(<LegacyRedirect {...defaultProps} />);
  });
  it("does nothing if there is no hash", () => {
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).not.toHaveBeenCalled();
  });
  it("redirects simple pages", () => {
    const options = [
      {
        from: "#!/about",
        to: "/about"
      },
      {
        from: "#!/account",
        to: "/my-designs"
      },
      {
        from: "#!/create",
        to: "/create"
      },
      {
        from: "#!/designs",
        to: "/designs"
      }
    ];
    expect.assertions(options.length);
    options.forEach(option => {
      defaultProps.history.location.hash = option.from;
      render(<LegacyRedirect {...defaultProps} />);
      expect(defaultProps.history.push).toHaveBeenCalledWith(option.to);
    });
  });
  it("redirects the activate page", () => {
    defaultProps.history.location.hash = "#!/activate?uid=abc&actcode=def";
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).toHaveBeenCalledWith("/activate/abc/def");
  });
  it("redirects the edit/new page", () => {
    defaultProps.history.location.hash = "#!/edit/new?id=abc";
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).toHaveBeenCalledWith("/create/abc");
  });
  it("redirects the edit/saved page", () => {
    defaultProps.history.location.hash = "#!/edit/saved?id=abc";
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).toHaveBeenCalledWith("/edit/abc");
  });
  it("redirects the view page", () => {
    defaultProps.history.location.hash = "#!/view?id=abc";
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).toHaveBeenCalledWith("/view/abc");
  });
  it("redirects unsupported urls to an error page", () => {
    defaultProps.history.location.hash = "#!/boogers";
    render(<LegacyRedirect {...defaultProps} />);
    expect(defaultProps.history.push).toHaveBeenCalledWith("/error");
  });
});
