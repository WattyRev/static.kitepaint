import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faEdit,
  faEraser,
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faHome,
  faImage,
  faInfo,
  faMagic,
  faPalette,
  faSave,
  faShare,
  faSignOutAlt,
  faUndo,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function setupFontAwesome() {
  library.add(
    faAngleDown,
    faEdit,
    faEraser,
    faExclamationCircle,
    faEye,
    faEyeSlash,
    faHome,
    faImage,
    faInfo,
    faMagic,
    faPalette,
    faSave,
    faShare,
    faSignOutAlt,
    faUndo,
    faTrash
  );
}

export default FontAwesomeIcon;
