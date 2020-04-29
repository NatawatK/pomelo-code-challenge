export const placeChildrenInParent = (input) => {
  // This function place data into the thier parent

  const idDataMapper = {} //this JSON object keep data using their id as index to access data in constant time
  
  //Get all levels(keys) from input
  const levels = [] 
  for (var level in input) {
    if (input.hasOwnProperty(level)) {
      levels.push(level)
    }
  }

  //compute from last levels inorder to make this function run in a good complexity time
  const reversedLevels = levels.reverse()
  reversedLevels.forEach((lvl) => {
    //store data in current level in idDataMapper
    const elementInLevel = input[lvl]
    elementInLevel.forEach((e) => {
      idDataMapper[e.id] = e
    })
    const nextLvl = String(Number(lvl) + 1)
    if (!input[nextLvl]) return

    //for all data in next level : 
    const elementInNextLevel = input[nextLvl]
    elementInNextLevel.forEach((e) => {
      const { parent_id } = e
      idDataMapper[parent_id].children.push(e) //take data into children arrays of parent (current level)
    })
  })

  //assume that all of element in level 0 is roots of tree
  const rootsId = input['0'].map((e) => e.id)
  return rootsId.map((rid) => idDataMapper[rid]) // Return array of all roots data (already include children data in there)
}
