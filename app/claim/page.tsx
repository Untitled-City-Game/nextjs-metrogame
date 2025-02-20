
'use client'

import { GameContext } from '@/components/ClientContainer';
import { Button } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import { Suspense, useContext } from 'react'
import { GameData } from '../types';
import { useRouter } from 'next/navigation';

export default function ClaimPage(){
	const router = useRouter()
	const props : GameData = useContext(GameContext);
	const searchParams = useSearchParams()
	const claimRegion = searchParams.get('zone')
	return(
		<Suspense fallback={<div>Loading...</div>}>
			<h1>Claim {props.G.zones[Number(claimRegion)].name}</h1>
			<Button onClick ={(event) => {
					props.moves.claimZone(claimRegion, "team1")
					router.push('/game')
				}}>Claim</Button>
		</Suspense>
	)
}