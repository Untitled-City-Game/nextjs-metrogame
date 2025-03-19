export default function GameLayout({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) 
  {
	console.log("rendering gamelayout")
	 return (
		<>
	  {children}
	  </>
	)
  }