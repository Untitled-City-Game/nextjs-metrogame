
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ClaimText(){
	const searchParams = useSearchParams()
	const claimRegion = searchParams.get('region')

	return(
			<div>
				<h1>Claim {claimRegion}</h1>
			</div>
	)
}

export default function ClaimPage(){
	return(
		<Suspense fallback={<div>Loading...</div>}>
			<ClaimText/>
		</Suspense>
	)
}