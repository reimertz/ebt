export const parseDHTData = ([_, PIN, temp_lsb, temp_msb, humidity_lsb, humidity_msb]) => {
  const temperature = ((temp_msb << 7) | temp_lsb) / 10.0
  const humidity = ((humidity_msb << 7) | humidity_lsb) / 10.0

  return {
    temperature,
    humidity,
  }
}
