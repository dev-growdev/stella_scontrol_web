import { useMsal } from '@azure/msal-react';
import { Button, Typography } from '@mui/material';
import { graphConfig, loginRequest } from 'app/configs/authConfig';
import axios from 'axios';
import { useEffect, useState } from 'react';


function Example() {
	const { instance, accounts } = useMsal();
	const [graphData, setGraphData] = useState<any>(null);

	useEffect(() => {
		console.log(graphData, '=== graph data')
	}, [graphData])


	//faz o request do user para ver se o user ainda é válido, se for segue o fluxo,
	//se nao for, precisamos descobrir o que acontece

	//retorna 401 se não tem acesso
	function RequestProfileData() {
		instance
			.acquireTokenSilent({
				...loginRequest,
				account: accounts[0]
			})
			.then((response) => {
				axios.get(graphConfig.graphMeEndpoint, { headers: { Authorization: `Bearer ${response.accessToken}` } })
					.then((response) => {
						setGraphData(response)
					})
			})
	}


	return (
		<>
			<Typography variant="h1">Solicitações</Typography>
			<Button onClick={RequestProfileData} variant='contained'>RequestProfileData</Button>
		</>
	);
}

export default Example;
