import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { QuestionStoreModel } from "app/models/QuestionStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    questionStore: types.optional(QuestionStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
