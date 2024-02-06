const DEFAULT_THEME_NAME = 'generic.light';

export const getThemePostfix = (theme) => {
  const themeName = theme === DEFAULT_THEME_NAME ? '' : ` (${theme})`;

  return themeName;
};

export async function testScreenshot(
  t,
  takeScreenshot,
  screenshotName,
  element,
) {
  await t
    .expect(await takeScreenshot(screenshotName.replace('.png', `${getThemePostfix(process.env.THEME || DEFAULT_THEME_NAME)}.png`), element))
    .ok();
}
