// Function to generate a unique ID based on a name and a random string
export function generateUniqueId(baseName: string): string {
  const baseNameString = baseName.toLocaleLowerCase().replace(/\s+/g, "-")
  const randomString = Math.random().toString(36).slice(2, 6)

  return `${baseNameString}-${randomString}`
}

// Function to generate a random color in hex format
export function getRandomColour() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return `#${randomColor}`
}
