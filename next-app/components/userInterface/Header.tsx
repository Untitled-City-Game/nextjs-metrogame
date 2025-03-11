import { theme } from "@/next-app/styles/theme";
import { Container, Group } from "@mantine/core";
import { Text } from '@mantine/core';

export default function Header({ children }: { children: React.ReactNode }) {
	return (
		<Container style={headerStyles} className="header">
			<Group justify="center" align="center">
				<Text size="xs">x neighbourhoods claimed</Text>
				<Text size="xs">time remaining</Text>
			</Group>
			{children}
		</Container>
	);
}

const headerStyles = {
	position: "sticky" as const,
	top: 0,
	backgroundColor: theme.white,
	width: "100%",
	zIndex: 1,
	padding: "1rem",
};