import SwiftUI

struct HomeView: View {
    @State private var path = NavigationPath()
    @State private var showingHowToPlay = false

    var body: some View {
        NavigationStack(path: $path) {
            ZStack {
                AppBackground()

                ScrollView {
                    VStack(spacing: 28) {
                        header
                        SampleQuestionPreview()
                        FeatureRow()
                        actions
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 24)
                }
                .scrollBounceBehavior(.basedOnSize)
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .setup: SetupView()
                }
            }
            .sheet(isPresented: $showingHowToPlay) {
                HowToPlayView()
            }
        }
    }

    private enum Route: Hashable {
        case setup
    }

    private var header: some View {
        VStack(spacing: 18) {
            ZStack(alignment: .topTrailing) {
                TitleLogo(size: 60)
                    .padding(.top, 12)
                SparkBurst(spread: 80)
                    .rotationEffect(.degrees(40))
                    .offset(x: 26, y: -10)
            }

            VStack(spacing: 4) {
                Text("Argue first. Find out who's right.")
                    .font(.display(22))
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                    .rotationEffect(.degrees(-2))
                Squiggle()
                    .stroke(Theme.yellow, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .frame(width: 220, height: 8)
            }

            Text("A party game for people who love being right about \(Text("ridiculous").foregroundStyle(Theme.yellow).bold()) things.")
                .font(.rounded(16, weight: .medium))
                .foregroundStyle(.white.opacity(0.85))
                .multilineTextAlignment(.center)
        }
    }

    private var actions: some View {
        VStack(spacing: 14) {
            Button {
                path.append(Route.setup)
            } label: {
                Text("Play Now")
            }
            .buttonStyle(PrimaryButtonStyle())

            Button("How to Play") {
                showingHowToPlay = true
            }
            .buttonStyle(SecondaryButtonStyle())

            VStack(spacing: 4) {
                Text("Smart. Silly. Seriously Fun.")
                    .font(.display(18))
                    .foregroundStyle(.white)
                Squiggle()
                    .stroke(Theme.yellow, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .frame(width: 180, height: 6)
            }
            .padding(.top, 10)
        }
    }
}

/// A tilted mini "phone screen" teasing the crab question from the ad.
private struct SampleQuestionPreview: View {
    @State private var revealed = false
    private let question = QuestionBank.animals[0]

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "stopwatch")
                    .font(.system(size: 16, weight: .bold))
                Capsule()
                    .fill(Theme.navy.opacity(0.15))
                    .frame(height: 8)
                    .overlay(alignment: .leading) {
                        Capsule().fill(Theme.yellow).frame(width: 90)
                    }
            }
            .foregroundStyle(Theme.navyDeep)

            Text(question.prompt)
                .font(.display(19))
                .foregroundStyle(Theme.navyDeep)
                .multilineTextAlignment(.center)

            Text(question.emoji)
                .font(.system(size: 60))
                .accessibilityHidden(true)

            HStack(spacing: 10) {
                previewAnswer(revealed ? question.wrong : "?", color: Theme.blue)
                previewAnswer(revealed ? question.correct : "?", color: Theme.purple)
            }

            Text(revealed ? "Technically, the claws are legs too!" : "Tap to peek")
                .font(.rounded(13, weight: .bold))
                .foregroundStyle(Theme.navy.opacity(0.6))
        }
        .padding(18)
        .frame(maxWidth: 280)
        .background(RoundedRectangle(cornerRadius: 30, style: .continuous).fill(Theme.card))
        .overlay(
            RoundedRectangle(cornerRadius: 30, style: .continuous)
                .strokeBorder(Color.black.opacity(0.8), lineWidth: 6)
        )
        .shadow(color: .black.opacity(0.4), radius: 24, y: 12)
        .rotationEffect(.degrees(4))
        .onTapGesture {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) { revealed.toggle() }
        }
        .sensoryFeedback(.selection, trigger: revealed)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isButton)
        .accessibilityHint("Shows the answer")
    }

    private func previewAnswer(_ text: String, color: Color) -> some View {
        Text(text)
            .font(.display(26))
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, minHeight: 56)
            .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(color))
            .contentTransition(.numericText())
    }
}

private struct FeatureRow: View {
    private struct Feature: Identifiable {
        let icon: String
        let color: Color
        let title: String
        var id: String { title }
    }

    private let features = [
        Feature(icon: "bubble.left.and.bubble.right.fill", color: Theme.yellow, title: "Debate\nYour Take"),
        Feature(icon: "stopwatch.fill", color: .white, title: "Beat\nthe Timer"),
        Feature(icon: "trophy.fill", color: Theme.yellow, title: "See the\nReal Answer"),
        Feature(icon: "brain.head.profile", color: Theme.pink, title: "Learn\nFun Facts"),
    ]

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            ForEach(features) { feature in
                VStack(spacing: 8) {
                    Image(systemName: feature.icon)
                        .font(.system(size: 26, weight: .bold))
                        .foregroundStyle(feature.color)
                        .frame(width: 64, height: 64)
                        .background(Circle().fill(Theme.surface))
                        .overlay(Circle().strokeBorder(Theme.stroke, lineWidth: 1.5))
                    Text(feature.title)
                        .font(.rounded(13, weight: .heavy))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .minimumScaleFactor(0.8)
                }
                .frame(maxWidth: .infinity)
                .accessibilityElement(children: .combine)
            }
        }
    }
}

#Preview {
    HomeView()
        .preferredColorScheme(.dark)
}
