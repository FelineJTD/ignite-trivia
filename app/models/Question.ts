// ---
// patches:
//   - path: "app/models/RootStore.ts"
//     after: "from \"mobx-state-tree\"\n"
//     insert: "import { QuestionModel } from \"./Question\"\n"
//     skip: true
//   - path: "app/models/RootStore.ts"
//     after: "types.model(\"RootStore\").props({\n"
//     insert: "  question: types.optional(QuestionModel, {} as any),\n"
//     skip: true
//   - path: "app/models/index.ts"
//     append: "export * from \"./Question\"\n" 
//     skip: 
// ---
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier,
    category: types.maybe(types.string),
    type: types.enumeration(["multiple", "boolean"]),
    difficulty: types.enumeration(["easy", "medium", "hard"]),
    question: types.maybe(types.string),
    correctAnswer: types.maybe(types.string),
    incorrectAnswers: types.optional(types.array(types.string), []),
    guess: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get allAnswers() {
      return [...self.incorrectAnswers, self.correctAnswer]
    },
    get isCorrect() {
      return self.guess === self.correctAnswer
    }
  }))
  .actions((self) => ({
    setGuess(guess: string) {
      self.setProp("guess", guess)
    }
  }))

export interface Question extends Instance<typeof QuestionModel> {}
export interface QuestionSnapshotOut extends SnapshotOut<typeof QuestionModel> {}
export interface QuestionSnapshotIn extends SnapshotIn<typeof QuestionModel> {}
export const createQuestionDefaultModel = () => types.optional(QuestionModel, {})
