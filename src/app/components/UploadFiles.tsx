import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Paper, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from '@mui/material';

interface UploadFilesProps {
	handleFileChange: (arg) => void;
	formData: any;
	handleFileRemove: (index: number) => void;
}

export default function UploadFiles({ handleFileChange, formData, handleFileRemove }: UploadFilesProps) {
	const theme = useTheme();
	return (
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
			{formData.uploadedFiles.length > 0 && (
				<>
					<Typography
						className="mr-10"
						color="GrayText"
					>
						Documentos anexados:
					</Typography>
					s
					<TableContainer component={Paper}>
						<TableBody className="flex flex-col">
							{formData.uploadedFiles.map((file, index) => (
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
	);
}
