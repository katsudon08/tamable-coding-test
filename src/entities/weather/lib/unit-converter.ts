/**
 * convertTemp
 * 摂氏(°C)を華氏(°F)に変換する
 *
 * @param celsius - 摂氏(°C)
 * @param toFahrenheit - 華氏(°F)に変換するかどうかのフラグ
 * @returns 変換後の温度（小数第1位で四捨五入）
 */
export const convertTemp = (celsius: number, toFahrenheit: boolean): number => {
  if (!toFahrenheit) {
    return celsius
  }
  // F = C * 1.8 + 32 (Math.roundで小数第一位までを残す)
  return Math.round((celsius * 1.8 + 32) * 10) / 10
}

/**
 * convertWindSpeed
 * 秒速(m/s)を時速(km/h)に変換する
 *
 * @param ms - 秒速(m/s)
 * @param toKmh - 時速(km/h)に変換するかどうかのフラグ
 * @returns 変換後の風速（小数第1位で四捨五入）
 */
export const convertWindSpeed = (ms: number, toKmh: boolean): number => {
  if (!toKmh) {
    return ms
  }
  // km/h = m/s * 3.6 (Math.roundで小数第一位までを残す)
  return Math.round((ms * 3.6) * 10) / 10
}
