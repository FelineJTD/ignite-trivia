// ---
// patches:
// - path: "app/screens/index.ts"
//   append: "export * from \"./QuestionScreen\"\n"
//   skip: 
// - path: "app/navigators/AppNavigator.tsx"
//   replace: "// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST"
//   insert: "Question: undefined\n\t// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST"
// - path: "app/navigators/AppNavigator.tsx"
//   replace: "{/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}"
//   insert: "<Stack.Screen name=\"Question\" component={Screens.QuestionScreen} />\n\t\t\t{/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}"
//   skip: 
// ---
import React, { FC } from "react"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle, FlatList, Alert, TouchableOpacity, Pressable } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import { RadioButtons } from "react-native-radio-buttons"
// import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
import { colors, spacing } from "../theme"
import { Question, useStores } from "app/models"
// import { decodeHTMLEntities } from "../utils/decode-html"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

// @ts-ignore
interface QuestionScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Question">> {}

export const QuestionScreen: FC<QuestionScreenProps> = observer(function QuestionScreen() {
  const { questionStore } = useStores()
  const { questions } = questionStore
  const [refreshing, setRefreshing] = React.useState(false)
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("Correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is ${question.correctAnswer}`)
    }
  }

  const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 18 } : {}
    return (
      <TouchableOpacity key={index} onPress={onSelect} style={$answerWrapper}>
        <Text style={[$answer, style]} text={answer} />
      </TouchableOpacity>
    )
  }

  const QuestionComponent = ({ item }) => {
    const question: Question = item.item
    return (
      <View style={$questionWrapper}>
        <Text style={$question} text={question.question} />
        <RadioButtons
          options={question.allAnswers}
          onSelection={(guess) => onPressAnswer(question, guess)}
          selectedOption={question.guess}
          renderOption={renderAnswer}
        />

        <Pressable onPress={() => checkAnswer(question)}>
          <LinearGradient 
            start={{ x: 0, y: 0 }} // Start point of the gradient
            end={{ x: 1, y: 0 }} // End point of the gradient
            colors={['#4c669f', '#3b5998', '#192f6a']} 
            style={$checkAnswer}
          >
            <Text text="Check Answer!" />
          </LinearGradient>
        </Pressable>
        
      </View>
    )
  }

  const ObservedQuestion = observer(QuestionComponent)

  return (
    <Screen style={$root}>
      <View>
        <Text text="Questions" tx={"questionScreen.title"} style={$headerText} />
        {/* <Text text="Hi, Feli made this!" tx={"questionScreen.subtitle"} /> */}
        <FlatList
          style={$questionList}
          data={questions}
          renderItem={(item) => <ObservedQuestion item={item} />}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={(item) => item.id}
          onRefresh={fetchQuestions}
          refreshing={refreshing}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
}

const $headerText: TextStyle = {
  marginTop: spacing.lg,
  paddingTop: spacing.xxxl,
  marginBottom: spacing.lg,
  fontSize: spacing.xl,
  fontWeight: "bold",
}

const $questionList: ViewStyle = {
  marginBottom: spacing.xxxl,
}

const $questionWrapper: ViewStyle = {
  borderBottomColor: colors.border,
  borderBottomWidth: 1,
  paddingVertical: spacing.lg,
}

const $question: TextStyle = {
  fontWeight: "bold",
  fontSize: spacing.md,
  marginVertical: spacing.md,
}

const $answer: TextStyle = {
  fontSize: spacing.sm,
}

const $answerWrapper: ViewStyle = {
  paddingVertical: spacing.xs,
}

const $checkAnswer: ViewStyle = {
  paddingVertical: spacing.xs,
  marginTop: spacing.xs,
  borderRadius: 5,
  alignItems: "center",
}