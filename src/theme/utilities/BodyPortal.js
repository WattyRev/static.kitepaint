import ReactDOM from "react-dom";

/**
 * Body portal creates a ReactDOM portal to send the provided content to the end of the <body>
 * element.
 */
const BodyPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.querySelector("body"));
};

export default BodyPortal;
