import SwiftUI

struct SetupView: View {
    private let storage = Storage()
    private let picker = QuestionPicker(bank: QuestionBank.all)

    @State private var players: [Player] = []
    @State private var settings = GameSettings()
    @State private var newName = ""
    @State private var activeGame: GameSession?
    @FocusState private var nameFieldFocused: Bool

    private var trimmedName: String { newName.trimmingCharacters(in: .whitespacesAndNewlines) }
    private var canAddPlayer: Bool { !trimmedName.isEmpty && players.count < GameSettings.maxPlayers }

    var body: some View {
        ZStack {
            AppBackground()

            ScrollView {
                VStack(spacing: 22) {
                    playersSection
                    roundsSection
                    timerSection
                    categoriesSection
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
                .padding(.bottom, 120)
            }
            .scrollDismissesKeyboard(.interactively)
        }
        .safeAreaInset(edge: .bottom) {
            Button("Start Game", action: startGame)
                .buttonStyle(PrimaryButtonStyle())
                .disabled(players.isEmpty)
                .padding(.horizontal, 20)
                .padding(.bottom, 8)
        }
        .navigationTitle("Game Setup")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
        .onAppear(perform: load)
        .onChange(of: players) { _, newValue in storage.players = newValue }
        .onChange(of: settings) { _, newValue in storage.settings = newValue }
        .fullScreenCover(item: $activeGame) { game in
            GameView(session: game, makeRematch: makeSession)
        }
    }

    // MARK: - Sections

    private var playersSection: some View {
        SetupSection(title: "Who's arguing?", subtitle: "\(players.count) of \(GameSettings.maxPlayers) players") {
            HStack(spacing: 10) {
                TextField("", text: $newName, prompt: Text("Add a player").foregroundStyle(.white.opacity(0.4)))
                    .font(.rounded(17))
                    .foregroundStyle(.white)
                    .textInputAutocapitalization(.words)
                    .autocorrectionDisabled()
                    .submitLabel(.done)
                    .focused($nameFieldFocused)
                    .onSubmit(addPlayer)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 14)
                    .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Theme.surface))

                Button(action: addPlayer) {
                    Image(systemName: "plus")
                        .font(.system(size: 20, weight: .black))
                        .foregroundStyle(Theme.navyDeep)
                        .frame(width: 50, height: 50)
                        .background(Circle().fill(Theme.yellow))
                }
                .buttonStyle(BouncyButtonStyle())
                .disabled(!canAddPlayer)
                .opacity(canAddPlayer ? 1 : 0.4)
                .accessibilityLabel("Add player")
            }

            if players.isEmpty {
                Text("Add at least one player. More is better: someone has to be wrong.")
                    .font(.rounded(14, weight: .medium))
                    .foregroundStyle(.white.opacity(0.6))
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                VStack(spacing: 8) {
                    ForEach(players) { player in
                        HStack(spacing: 12) {
                            PlayerAvatar(player: player, size: 34)
                            Text(player.name)
                                .font(.rounded(17, weight: .bold))
                                .foregroundStyle(.white)
                            Spacer()
                            Button {
                                remove(player)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.system(size: 22))
                                    .foregroundStyle(.white.opacity(0.4))
                            }
                            .buttonStyle(BouncyButtonStyle())
                            .accessibilityLabel("Remove \(player.name)")
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Theme.surface))
                        .transition(.asymmetric(insertion: .scale.combined(with: .opacity), removal: .opacity))
                    }
                }
            }
        }
    }

    private var roundsSection: some View {
        SetupSection(title: "Questions", subtitle: "How many rounds to play") {
            OptionPicker(options: GameSettings.roundOptions, selection: $settings.rounds) { "\($0)" }
        }
    }

    private var timerSection: some View {
        SetupSection(title: "Debate timer", subtitle: "Time to argue before voting") {
            OptionPicker(options: GameSettings.timerOptions, selection: $settings.timerSeconds) { "\($0)s" }
        }
    }

    private var categoriesSection: some View {
        SetupSection(title: "Categories", subtitle: "Pick what to argue about") {
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                ForEach(Category.allCases) { category in
                    let isOn = settings.categories.contains(category)
                    Button {
                        toggle(category)
                    } label: {
                        HStack(spacing: 8) {
                            Text(category.emoji)
                            Text(category.title)
                                .font(.rounded(16, weight: .bold))
                            Spacer(minLength: 0)
                            Image(systemName: isOn ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(isOn ? Theme.yellow : .white.opacity(0.3))
                        }
                        .foregroundStyle(.white)
                        .padding(14)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(isOn ? Theme.yellow.opacity(0.15) : Theme.surface)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(isOn ? Theme.yellow.opacity(0.7) : .clear, lineWidth: 1.5)
                        )
                    }
                    .buttonStyle(BouncyButtonStyle())
                    .accessibilityAddTraits(isOn ? .isSelected : [])
                }
            }
            Text("\(picker.pool(for: settings.categories).count) questions available")
                .font(.rounded(13, weight: .medium))
                .foregroundStyle(.white.opacity(0.5))
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    // MARK: - Actions

    private func load() {
        guard players.isEmpty else { return }
        players = storage.players
        settings = storage.settings
    }

    private func addPlayer() {
        guard canAddPlayer else { return }
        let usedColors = Set(players.map(\.colorIndex))
        let color = Theme.playerColors.indices.first { !usedColors.contains($0) } ?? players.count
        withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
            players.append(Player(name: trimmedName, colorIndex: color))
        }
        newName = ""
        nameFieldFocused = players.count < GameSettings.maxPlayers
    }

    private func remove(_ player: Player) {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
            players.removeAll { $0.id == player.id }
        }
    }

    private func toggle(_ category: Category) {
        // Keep at least one category selected.
        if settings.categories.contains(category) {
            guard settings.categories.count > 1 else { return }
            settings.categories.remove(category)
        } else {
            settings.categories.insert(category)
        }
    }

    private func startGame() {
        nameFieldFocused = false
        activeGame = makeSession()
    }

    private func makeSession() -> GameSession {
        let rounds = picker.pick(
            count: settings.rounds,
            categories: settings.categories,
            seen: storage.seenQuestionIDs
        )
        storage.markSeen(rounds.map(\.id), pool: picker.pool(for: settings.categories))
        return GameSession(players: players, rounds: rounds, timerSeconds: settings.timerSeconds)
    }
}

private struct SetupSection<Content: View>: View {
    let title: String
    let subtitle: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.display(22))
                    .foregroundStyle(.white)
                Text(subtitle)
                    .font(.rounded(14, weight: .medium))
                    .foregroundStyle(.white.opacity(0.6))
            }
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// A row of chunky pill buttons for picking one value.
private struct OptionPicker: View {
    let options: [Int]
    @Binding var selection: Int
    let label: (Int) -> String

    var body: some View {
        HStack(spacing: 10) {
            ForEach(options, id: \.self) { option in
                let isSelected = option == selection
                Button {
                    selection = option
                } label: {
                    Text(label(option))
                        .font(.display(18))
                        .foregroundStyle(isSelected ? Theme.navyDeep : .white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Capsule().fill(isSelected ? Theme.yellow : Theme.surface))
                }
                .buttonStyle(BouncyButtonStyle())
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .sensoryFeedback(.selection, trigger: selection)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: selection)
    }
}

#Preview {
    NavigationStack { SetupView() }
        .preferredColorScheme(.dark)
}
