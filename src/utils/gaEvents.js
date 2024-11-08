export const undoEvent = (attr = {}) => gtag("event", "undo_click", attr);

export const redoEvent = (attr = {}) => gtag("event", "redo_click", attr);

export const backgroundChangeEvent = (attr = {}) =>
  gtag("event", "background_change", attr);

export const hideOutlinesEvent = (attr = {}) =>
  gtag("event", "hide_outlines_click", attr);

export const autofillEvent = (attr = {}) =>
  gtag("event", "autofill_click", attr);

export const resetEvent = (attr = {}) => gtag("event", "reset_click", attr);
