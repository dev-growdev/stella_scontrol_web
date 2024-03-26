import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

interface IFileDialog {
	base64: string;
	type: string;
	name: string;
}

interface PropsAlertDialog {
	open: boolean;
	setOpen: (arg: boolean) => void;
	file: IFileDialog;
}

export function AlertDialog({ open, file, setOpen }: PropsAlertDialog) {
	const handleClose = () => {
		setOpen(false);
	};

	const documents = [{ uri: file.base64, fileType: file.type, fileName: file.name }];

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogContent id="alert-dialog-description">
				<DocViewer
					documents={documents}
					pluginRenderers={DocViewerRenderers}
					language="pt"
					className="min-w-480"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Fechar</Button>
			</DialogActions>
		</Dialog>
	);
}
