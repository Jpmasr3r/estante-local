import { Navigate, useParams } from "react-router-dom";

import { libraryManager } from "../../config/library";
import { ReaderPage } from "../../pages/ReaderPage";

export function ReaderRoute() {
	const { bookId } = useParams();
	const library = libraryManager.getLibrary();
	const book = library?.books.find((currentBook) => currentBook.id === bookId);

	if (book?.format !== "PDF") {
		return <Navigate to="/biblioteca" replace />;
	}

	return <ReaderPage book={book} />;
}
