import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCog,
  faEdit,
  faEllipsisH,
  faEraser,
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faHome,
  faImage,
  faInfo,
  faMagic,
  faPalette,
  faPlus,
  faRedo,
  faSave,
  faShare,
  faSignOutAlt,
  faSpinner,
  faUndo,
  faTimes,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function setupFontAwesome() {
  library.add(
    faAngleDown,
    faCog,
    faEdit,
    faEllipsisH,
    faEraser,
    faExclamationCircle,
    faEye,
    faEyeSlash,
    faHome,
    faImage,
    faInfo,
    faMagic,
    faPalette,
    faPlus,
    faRedo,
    faSave,
    faShare,
    faSignOutAlt,
    faSpinner,
    faUndo,
    faTimes,
    faTrash
  );
}

export default FontAwesomeIcon;
