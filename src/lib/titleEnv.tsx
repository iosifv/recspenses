export function titleEnv() {
  // Helper to show the environment in the title
  let titleEnv = ""
  if (process.env.APPLICATION_ENV == "production") {
    titleEnv += "<<prod>>"
  } else {
    titleEnv += "{dev}"
  }

  return titleEnv
}
