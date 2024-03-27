import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Paper, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { useState } from 'react';
import { IFiles } from '../../../types/request';
import { AlertDialog } from './files/AlertDialog';

interface UploadFilesProps {
	handleFileChange: (arg) => void;
	uploadedFiles: File[];
	handleFileRemove: (index: number) => void;
	getFiles: IFiles[];
	readMode: boolean;
}

export function UploadFiles({
	handleFileChange,
	uploadedFiles,
	handleFileRemove,
	getFiles,
	readMode
}: UploadFilesProps) {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [fileUploaded, setFileUploaded] = useState({ base64: '', type: '', name: '' });
	const dispatch = useAppDispatch();

	async function handleFileView(fileKey: string, fileName: string) {
		try {
			const res = await axios.get<{ base64: string; type: string }>(
				`${process.env.REACT_APP_API_URL}/payment-request-general/file/${fileKey}`
			);

			const { base64, type } = res.data;
			setOpen(true);
			setFileUploaded({ base64, type, name: fileName });
		} catch (error) {
			dispatch(
				showMessage({
					message: 'Não foi possível localizar este arquivo.',
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				})
			);
		}
	}

	function showUploadedFiles() {
		return uploadedFiles.map((file, index) => (
			<TableRow key={index}>
				<TableCell>{file.name}</TableCell>
				<TableCell>
					{!readMode && (
						<FuseSvgIcon
							onClick={() => handleFileRemove(index)}
							aria-label="view"
							color="primary"
							className="cursor-pointer"
						>
							heroicons-outline:trash
						</FuseSvgIcon>
					)}
				</TableCell>
			</TableRow>
		));
	}

	function showGetFiles() {
		return getFiles
			? getFiles.map((file, index) => (
					<TableRow key={index}>
						<TableCell>{file.name}</TableCell>

						<TableCell>
							<FuseSvgIcon
								onClick={() => handleFileView(file.key, file.name)}
								aria-label="view"
								className="cursor-pointer"
								color="primary"
							>
								heroicons-outline:eye
							</FuseSvgIcon>
						</TableCell>
						<TableCell>
							{!readMode && (
								<FuseSvgIcon
									onClick={() => handleFileRemove(index)}
									aria-label="view"
									color="primary"
									className="cursor-pointer"
								>
									heroicons-outline:trash
								</FuseSvgIcon>
							)}
						</TableCell>
					</TableRow>
			  ))
			: [];
	}

	return (
		<>
			{!readMode && (
				<div className="flex flex-row items-center">
					<Typography
						className="mr-10"
						color="GrayText"
					>
						Anexar documentos
					</Typography>
					<div>
						<Button
							component="label"
							role="button"
							variant="outlined"
							sx={{
								borderColor: theme.palette.primary.main,
								color: theme.palette.primary.main
							}}
							className="border-solid border-2 rounded-4 min-h-[33px] max-h-[33px] pr-0 pl-7"
							tabIndex={-1}
							endIcon={
								<FuseSvgIcon
									sx={{
										borderColor: theme.palette.primary.main,
										backgroundColor: theme.palette.primary.main
									}}
									className="border-solid border-2 rounded-r-4 text-gray-50 m-0 h-[33px]"
								>
									heroicons-outline:upload
								</FuseSvgIcon>
							}
						>
							ANEXAR DOCUMENTO
							<input
								multiple
								type="file"
								onChange={handleFileChange}
								className="absolute hidden"
							/>
						</Button>
					</div>
				</div>
			)}
			<>
				<Typography
					className="mr-10"
					color="GrayText"
				>
					Documentos anexados:
				</Typography>
				<TableContainer component={Paper}>
					<TableBody className="flex flex-col" />
					{showGetFiles()}
					{showUploadedFiles()}
				</TableContainer>
			</>
			<AlertDialog
				file={fileUploaded}
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
}
