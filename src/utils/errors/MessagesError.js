export const generatorUserError = (user) => {
    return `One or more of the following fields are invalid or incomplete.
    List of required fields:
      - firstName : ${user.firstName}
      - lastName  : ${user.lastName}
      - email     : ${user.email}
      - phone     : ${user.phone}
      - age       : ${user.age}
      `
}