# Technically!

**Argue first. Find out who's right.**

A pass-and-play party game for people who love being right about ridiculous things. Built with Expo (React Native) and played on iPhone through Expo Go, so no Mac is needed.

## How it plays

1. **Debate your take.** Each question has two answers: the one everyone assumes and the one that's *technically* true.
2. **Beat the timer.** The group argues until the countdown runs out.
3. **Lock in.** Pass the phone around; everyone picks A or B.
4. **See the real answer.** Right answers score 100. If you're right while most of the group is wrong, you get a +50 underdog bonus.
5. **Learn fun facts.** Every answer explains the story behind it.

## Playing it on your phone

Every push to `master` runs `.eas/workflows/publish-update.yml` on Expo's servers, which publishes a new version. Open Expo Go on your iPhone, sign in with your Expo account, and open the **Technically!** project to load the newest version.

## Developing

```bash
npm install
npm test            # game logic tests (Vitest)
npm run typecheck   # TypeScript
npx expo start      # local dev server, if you have a computer handy
```

## Project layout

```
App.tsx                     Screen switching and font loading
src/game/                   Game rules, question picker, storage, questions
src/game/questions.ts       All questions and fun facts
src/screens/                Home, setup, how-to-play
src/screens/game/           Debate → Vote → Reveal → Results
src/components/             Buttons, cards, decorations, background
src/theme.ts                Colors and fonts
```

### Adding questions

Add an entry to `src/game/questions.ts`:

```ts
{
  category: 'animals',
  emoji: '🦀',
  prompt: 'How many legs does a crab have?',
  correct: '10',
  wrong: '8',
  fact: 'Crabs are decapods, which literally means "ten feet."',
},
```

Which side (A or B) the right answer appears on is randomized every game.
