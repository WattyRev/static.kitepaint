import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignOutAlt,
  faExclamationCircle,
  faInfo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function setupFontAwesome() {
  library.add(faSignOutAlt, faExclamationCircle, faInfo);
}

export default FontAwesomeIcon;
