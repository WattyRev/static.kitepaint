export const undoEvent = (attr = {}) => gtag("event", "kp_undo_click", attr);

export const redoEvent = (attr = {}) => gtag("event", "kp_redo_click", attr);

export const backgroundChangeEvent = (attr = {}) =>
  gtag("event", "kp_background_change", attr);

export const hideOutlinesEvent = (attr = {}) =>
  gtag("event", "kp_hide_outlines_click", attr);

export const autofillEvent = (attr = {}) =>
  gtag("event", "kp_autofill_click", attr);

export const resetEvent = (attr = {}) => gtag("event", "kp_reset_click", attr);

export const saveEvent = (attr = {}) =>
  gtag("event", "kp_save_new_click", attr);

export const updateEvent = (attr = {}) =>
  gtag("event", "kp_update_click", attr);

export const applyColorEvent = (attr = {}) =>
  gtag("event", "kp_apply_color_click", attr);
