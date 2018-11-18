import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faEraser,
  faExclamationCircle,
  faEyeSlash,
  faHome,
  faImage,
  faInfo,
  faMagic,
  faPalette,
  faSave,
  faShare,
  faSignOutAlt,
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function setupFontAwesome() {
  library.add(
    faAngleDown,
    faEraser,
    faExclamationCircle,
    faEyeSlash,
    faHome,
    faImage,
    faInfo,
    faMagic,
    faPalette,
    faSave,
    faShare,
    faSignOutAlt,
    faUndo
  );
}

export default FontAwesomeIcon;
