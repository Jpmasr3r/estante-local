import { Navigate } from "react-router-dom";

import { librarySession } from "../../config/library";
import { LibraryAccessPolicy } from "../../domain/library/LibraryAccessPolicy";
import { LibraryPage } from "../../pages/LibraryPage";

const libraryAccessPolicy = new LibraryAccessPolicy(librarySession);

export function LibraryRoute() {
	const library = libraryAccessPolicy.getAccessibleLibrary();

	if (!library) {
		return <Navigate to="/" replace />;
	}

	return <LibraryPage library={library} />;
}
