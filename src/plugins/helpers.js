// Return a new object with selected keys from a source object
Object.pick = (source, keys) => {
  const result = {}
  for (const key of keys) {
    result[key] = source[key]
  }
  return result
}
