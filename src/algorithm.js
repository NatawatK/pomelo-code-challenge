export const placeChildrenInParent = (input) => {
  const idDataMapper = {}
  const levels = []
  for (var level in input) {
    if (input.hasOwnProperty(level)) {
      levels.push(level)
    }
  }

  const reversedLevels = levels.reverse()
  reversedLevels.forEach((lvl) => {
    const elementInLevel = input[lvl]
    elementInLevel.forEach((e) => {
      idDataMapper[e.id] = e
    })
    const nextLvl = String(Number(lvl) + 1)
    if (!input[nextLvl]) return

    const elementInNextLevel = input[nextLvl]
    elementInNextLevel.forEach((e) => {
      const { parent_id } = e
      idDataMapper[parent_id].children.push(e)
    })
  })

  const rootsId = input['0'].map((e) => e.id)
  return rootsId.map((rid) => idDataMapper[rid])
}
