# Technically!

**Argue first. Find out who's right.**

A pass-and-play party game for iPhone, for people who love being right about ridiculous things.

## How it plays

1. **Debate your take.** Each question has two answers: the one everyone assumes and the one that's *technically* true.
2. **Beat the timer.** The group argues until the countdown runs out.
3. **Lock in.** Pass the phone around; everyone picks A or B.
4. **See the real answer.** Right answers score 100. If you're right while most of the group is wrong, you get a +50 underdog bonus.
5. **Learn fun facts.** Every answer explains the story behind it.

## Requirements

- Xcode 16 or later
- iOS 17 or later (iPhone)

## Running

1. Open `Technically.xcodeproj`.
2. Choose an iPhone simulator and press **Run**.
3. To run on a device, choose your team under *Signing & Capabilities* and change the bundle ID (`com.example.technically`) to one you own.

Run the tests with **Product › Test** (⌘U).

## Project layout

```
Technically/
  TechnicallyApp.swift      App entry point
  Models/                   Game rules (GameSession), question picking, persistence
  Data/QuestionBank.swift   All questions and fun facts
  Views/                    Home, setup, how-to-play
  Views/Game/               Debate → Vote → Reveal → Results
  Views/Components/         Theme, buttons, cards, decorations
TechnicallyTests/           Swift Testing unit tests for game logic
```

The project uses Xcode 16's synchronized folders, so new files you add to `Technically/` or `TechnicallyTests/` are included automatically.

### Adding questions

Add a `Question` to the matching category in `Technically/Data/QuestionBank.swift`:

```swift
Question(
    category: .animals, emoji: "🦀",
    prompt: "How many legs does a crab have?",
    correct: "10", wrong: "8",
    fact: "Crabs are decapods, which literally means \"ten feet.\""
)
```

Which side (A or B) the right answer appears on is randomized every game.
