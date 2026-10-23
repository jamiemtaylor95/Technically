import SwiftUI

enum Theme {
    static let navy = Color(red: 0.08, green: 0.13, blue: 0.33)
    static let navyDeep = Color(red: 0.04, green: 0.06, blue: 0.19)
    static let card = Color(red: 0.93, green: 0.94, blue: 0.99)
    static let surface = Color.white.opacity(0.08)
    static let stroke = Color.white.opacity(0.14)

    static let yellow = Color(red: 1.0, green: 0.84, blue: 0.23)
    static let blue = Color(red: 0.18, green: 0.50, blue: 0.98)
    static let purple = Color(red: 0.61, green: 0.37, blue: 0.90)
    static let green = Color(red: 0.20, green: 0.80, blue: 0.48)
    static let red = Color(red: 0.98, green: 0.36, blue: 0.40)
    static let pink = Color(red: 0.96, green: 0.45, blue: 0.80)

    static let playerColors: [Color] = [
        Color(red: 1.0, green: 0.55, blue: 0.26),
        Color(red: 0.25, green: 0.78, blue: 0.85),
        pink,
        green,
        yellow,
        Color(red: 0.55, green: 0.62, blue: 1.0),
        red,
        Color(red: 0.75, green: 0.90, blue: 0.35),
    ]

    static func playerColor(_ index: Int) -> Color {
        playerColors[((index % playerColors.count) + playerColors.count) % playerColors.count]
    }

    static func color(for side: Side) -> Color {
        side == .a ? blue : purple
    }
}

extension Font {
    /// Chunky, rounded type for headlines.
    static func display(_ size: CGFloat) -> Font {
        .system(size: size, weight: .black, design: .rounded)
    }

    static func rounded(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}

struct AppBackground: View {
    var body: some View {
        ZStack {
            LinearGradient(colors: [Theme.navy, Theme.navyDeep], startPoint: .top, endPoint: .bottom)
            Circle()
                .fill(Theme.blue.opacity(0.28))
                .frame(width: 380, height: 380)
                .blur(radius: 120)
                .offset(x: -150, y: -320)
            Circle()
                .fill(Theme.purple.opacity(0.22))
                .frame(width: 340, height: 340)
                .blur(radius: 120)
                .offset(x: 170, y: 340)
        }
        .ignoresSafeArea()
    }
}

// MARK: - Buttons

struct PrimaryButtonStyle: ButtonStyle {
    var color: Color = Theme.yellow
    var foreground: Color = Theme.navyDeep

    func makeBody(configuration: Configuration) -> some View {
        StyledButton(configuration: configuration, color: color, foreground: foreground, filled: true)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        StyledButton(configuration: configuration, color: .white, foreground: .white, filled: false)
    }
}

private struct StyledButton: View {
    let configuration: ButtonStyleConfiguration
    let color: Color
    let foreground: Color
    let filled: Bool

    @Environment(\.isEnabled) private var isEnabled

    var body: some View {
        configuration.label
            .font(.display(filled ? 22 : 18))
            .foregroundStyle(foreground)
            .frame(maxWidth: .infinity)
            .padding(.vertical, filled ? 18 : 14)
            .background {
                if filled {
                    Capsule().fill(color)
                        .shadow(color: color.opacity(isEnabled ? 0.45 : 0), radius: 16, y: 6)
                } else {
                    Capsule().strokeBorder(color.opacity(0.5), lineWidth: 2)
                }
            }
            .opacity(isEnabled ? 1 : 0.4)
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.6), value: configuration.isPressed)
    }
}

/// Small press-to-shrink style for icon buttons and chips.
struct BouncyButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.92 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.6), value: configuration.isPressed)
    }
}
