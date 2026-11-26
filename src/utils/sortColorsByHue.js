// Colors with less saturation than this, or that are nearly black or white, have no hue that the
// eye can tell apart, so they are treated as neutrals.
const NEUTRAL_MAX_SATURATION = 0.12;
const NEUTRAL_MIN_LIGHTNESS = 0.08;
const NEUTRAL_MAX_LIGHTNESS = 0.95;

// Hues are grouped into bands so that shades of the same color sit together (ordered by
// lightness) instead of interleaving because of tiny hue differences. The bands are centered on
// the primary and secondary colors, so reds on both sides of 0 degrees share a band.
const HUE_BAND_COUNT = 12;
const HUE_BAND_SIZE = 360 / HUE_BAND_COUNT;

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

/**
 * Converts a "#rrggbb" color to hue (0-360), saturation (0-1) and lightness (0-1).
 * @param  {String} hex
 * @return {{h: Number, s: Number, l: Number}|null} null when the color is not "#rrggbb".
 */
export const hexToHsl = hex => {
  const match = HEX_COLOR.exec(hex);
  if (!match) {
    return null;
  }
  const [r, g, b] = match.slice(1).map(part => parseInt(part, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) {
    return { h: 0, s: 0, l };
  }
  const s = delta / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  h *= 60;
  if (h < 0) {
    h += 360;
  }
  return { h, s, l };
};

// Neutrals come first, then colors by hue band, then anything that is not a "#rrggbb" color.
const getSortKey = hex => {
  const hsl = hexToHsl(hex);
  if (!hsl) {
    return { group: 2, band: 0, lightness: 0 };
  }
  const { h, s, l } = hsl;
  if (
    s < NEUTRAL_MAX_SATURATION ||
    l < NEUTRAL_MIN_LIGHTNESS ||
    l > NEUTRAL_MAX_LIGHTNESS
  ) {
    return { group: 0, band: 0, lightness: l };
  }
  const band = Math.floor(((h + HUE_BAND_SIZE / 2) % 360) / HUE_BAND_SIZE);
  return { group: 1, band, lightness: l };
};

/**
 * Orders "#rrggbb" colors for display as a palette: neutrals first (white to black), then colors
 * by hue (red, orange, yellow, green, blue, purple, pink), lightest to darkest within a hue.
 * Does not change the array it is given.
 * @param  {String[]} colors
 * @return {String[]}
 */
export default function sortColorsByHue(colors) {
  return colors
    .map(hex => ({ hex, key: getSortKey(hex) }))
    .sort((a, b) => {
      if (a.key.group !== b.key.group) {
        return a.key.group - b.key.group;
      }
      if (a.key.band !== b.key.band) {
        return a.key.band - b.key.band;
      }
      if (a.key.lightness !== b.key.lightness) {
        return b.key.lightness - a.key.lightness;
      }
      return a.hex < b.hex ? -1 : a.hex > b.hex ? 1 : 0;
    })
    .map(item => item.hex);
}
