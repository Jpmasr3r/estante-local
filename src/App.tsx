import { AppHeader } from "./components/layout/AppHeader";
import { HomePage } from "./pages/HomePage";

export function App() {
	return (
		<div className="min-h-screen">
			<AppHeader />
			<main>
				<HomePage />
			</main>
		</div>
	);
}
