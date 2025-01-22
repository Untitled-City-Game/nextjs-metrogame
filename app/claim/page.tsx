
'use client'

import { useSearchParams } from 'next/navigation'

export default function Claim(){
	const searchParams = useSearchParams()
	const claimRegion = searchParams.get('region')

	return(
		<div>
			<h1>Claim {claimRegion}</h1>
		</div>
	)
}