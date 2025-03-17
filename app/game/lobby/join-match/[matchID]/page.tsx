import JoinGame from "@/components/lobby/JoinGame"

export default async function JoinMatchPage({
	params,
  }: {
	params: Promise<{ matchID: string }>
  }) {
	const { matchID } = await params
	console.log(matchID)
	return <JoinGame matchID={matchID} />
  }