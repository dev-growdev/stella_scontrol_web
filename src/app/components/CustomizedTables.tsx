import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export interface CutomizedTableProps {
	tableHead: string[];
	tableData?: { [key: string]: any }[];
}

export default function CustomizedTables({ tableData, tableHead }: CutomizedTableProps) {
	return (
		<TableContainer
			component={Paper}
			elevation={3}
		>
			<Table
				sx={{ minWidth: 700 }}
				aria-label="customized table"
			>
				<TableHead>
					<TableRow>
						{tableHead.map((header, index) => (
							<TableCell
								key={index}
								sx={{ backgroundColor: '#ffffff' }}
							>
								{header}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{tableData?.map((row, index) => (
						<TableRow
							key={index}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							{tableHead.map((header, cellIndex) => (
								<TableCell key={cellIndex}>
									{typeof row === 'object' && row !== null && header.toLowerCase() in row
										? row[header.toLowerCase()]
										: '-'}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
