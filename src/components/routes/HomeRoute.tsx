import { Navigate } from "react-router-dom";

import { libraryManager } from "../../config/library";
import { HomePage } from "../../pages/HomePage";

export function HomeRoute() {
	const library = libraryManager.getLibrary();

	if (library && library.folders.length > 0) {
		return <Navigate to="/biblioteca" replace />;
	}

	return <HomePage />;
}
