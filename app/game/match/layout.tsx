import ClientContainer from "@/components/ClientContainer";
import { Suspense } from "react";

export default function MatchLayout({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) 
  {
	 return (
    <ClientContainer>
      <Suspense>
      {children}
      </Suspense>
    </ClientContainer>
    )
  }