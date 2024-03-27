import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Paper, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { AlertDialog } from './files/AlertDialog';
import { IFiles } from '../../../types/request';

interface UploadFilesProps {
	handleFileChange: (arg) => void;
	uploadedFiles: File[];
	handleFileRemove: (index: number) => void;
	getFiles: IFiles[];
	requestUid: string;
	readMode: boolean;
}

export function UploadFiles({
	handleFileChange,
	uploadedFiles,
	handleFileRemove,
	requestUid,
	getFiles,
	readMode
}: UploadFilesProps) {
	const theme = useTheme();

	const [open, setOpen] = useState(false);
	const [fileUploaded, setFileUploaded] = useState({ base64: '', type: '', name: '' });

	async function handleFileView(fileKey: string, fileName: string) {
		const res = await axios.get<{ base64: string; type: string }>(
			`${process.env.REACT_APP_API_URL}/payment-request-general/file/${fileKey}`
		);
		const { base64, type } = res.data;
		setOpen(true);
		setFileUploaded({ base64, type, name: fileName });
	}

	return (
		<>
			{!readMode && (
				<>
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
					{uploadedFiles.length > 0 && (
						<>
							<Typography
								className="mr-10"
								color="GrayText"
							>
								Documentos anexados:
							</Typography>
							<TableContainer component={Paper}>
								<TableBody className="flex flex-col">
									{uploadedFiles.map((file, index) => (
										<TableRow key={index}>
											<TableCell>{file.name}</TableCell>
											<TableCell>
												<FuseSvgIcon
													onClick={() => handleFileRemove(index)}
													aria-label="delete"
													className="cursor-pointer text-gray-300"
												>
													heroicons-outline:trash
												</FuseSvgIcon>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</TableContainer>
						</>
					)}
				</>
			)}
			{getFiles && getFiles.length > 0 && (
				<>
					<Typography
						className="mr-10"
						color="GrayText"
					>
						Documentos anexados:
					</Typography>
					<TableContainer component={Paper}>
						<TableBody className="flex flex-col">
							{getFiles.map((file, index) => (
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
								</TableRow>
							))}
						</TableBody>
					</TableContainer>
					<AlertDialog
						file={fileUploaded}
						open={open}
						setOpen={setOpen}
					/>
				</>
			)}
		</>
	);
}
