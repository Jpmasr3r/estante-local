import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/layout/AppHeader";
import { HomeRoute } from "./components/routes/HomeRoute";
import { LibraryRoute } from "./components/routes/LibraryRoute";
import { ReaderRoute } from "./components/routes/ReaderRoute";

export function App() {
	return (
		<div className="min-h-screen">
			<AppHeader />
			<main>
				<Routes>
					<Route path="/" element={<HomeRoute />} />
					<Route path="/biblioteca" element={<LibraryRoute />} />
					<Route path="/leitor/:bookId" element={<ReaderRoute />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</div>
	);
}
