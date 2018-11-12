import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faExclamationCircle,
  faHome,
  faInfo,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function setupFontAwesome() {
  library.add(faAngleDown, faSignOutAlt, faExclamationCircle, faInfo, faHome);
}

export default FontAwesomeIcon;
