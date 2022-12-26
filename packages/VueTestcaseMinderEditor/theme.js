
export const ORIGIN_COLOR = '#2c2a48'
export const ORIGIN_COLOR_SHALLOW = '#595591'
export const COUNT_NUMBER = '#6C317C'
export const COUNT_NUMBER_SHALLOW = '#CDB9D2'
export const PRIMARY_COLOR = '#783887'

export function setColor (a, b, c, d, e) {
  // 顶部菜单背景色
  document.body.style.setProperty('--color', a);
  document.body.style.setProperty('--color_shallow', b);
  // 首页颜色
  document.body.style.setProperty('--count_number', c);
  document.body.style.setProperty('--count_number_shallow', d);
  // 主颜色
  document.body.style.setProperty('--primary_color', e);
}

export function setDefaultTheme () {
  setColor(ORIGIN_COLOR, ORIGIN_COLOR_SHALLOW, COUNT_NUMBER, COUNT_NUMBER_SHALLOW, PRIMARY_COLOR);
}
