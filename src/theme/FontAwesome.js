import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignOutAlt,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

export default function setupFontAwesome() {
  library.add(faSignOutAlt, faExclamationCircle);
}
