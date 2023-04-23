import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from './wordList.json';

function App() {
  const [wordtoguess, setwordtoguess] = useState(() => {
    return words[Math.floor(Math.random()*words.length)];
  }); //get a random word from list

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])


  const incorrectLetters = guessedLetters.filter(letter => !wordtoguess.includes(letter))
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordtoguess
    .split("")
    .every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return

      setGuessedLetters(currentLetters => [...currentLetters, letter])
    },
    [guessedLetters, isWinner, isLoser]
  )


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setwordtoguess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])



  return <div style={{maxWidth: "800px",display: "flex",flexDirection: "column", gap: "2rem",margin: "0 auto",alignItems: "center"}}>    
    <div style={{fontSize: "1.5rem", textAlign: "center", color: "#f00", fontFamily: "monospace"}}>
      {isWinner && "Winner! - Refresh to try again"}
      {isLoser && "Word was '"+wordtoguess+"', Nice Try - Refresh to try again"}
    </div>
    <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
    <HangmanWord  guessedLetters={guessedLetters} wordToGuess = {wordtoguess} />
    <div style={{alignSelf: "stretch"}}>
    <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordtoguess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
    </div>
  </div>
}

export default App;
function getWord(): import("react").SetStateAction<string> {
  throw new Error("Function not implemented.");
}

