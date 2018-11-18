import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-styled-components";
import "jest-enzyme";

configure({ adapter: new Adapter() });

// eslint-disable-next-line no-console
const originalConsoleError = console.error;

// eslint-disable-next-line no-console
console.error = message => {
  if (/(Failed prop type)/.test(message)) {
    throw new Error(message);
  }

  originalConsoleError(message);
};
