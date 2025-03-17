'use client'
import ClientContainer from "@/components/ClientContainer";

export default function MatchLayout({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) 
  {
	 return <ClientContainer>{children}</ClientContainer>
  }