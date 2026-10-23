import SwiftUI

@main
struct TechnicallyApp: App {
    var body: some Scene {
        WindowGroup {
            HomeView()
                .preferredColorScheme(.dark)
                .tint(Theme.yellow)
        }
    }
}
