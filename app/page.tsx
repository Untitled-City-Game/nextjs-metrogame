import { Button, Title, Flex} from '@mantine/core';
import MapContainer from '@components/mapcontainer';
import Link from 'next/link';

export default function Home() {
  return (
    <Flex direction="column" align="center" justify="center" style={{height: "100vh"}}>
      <Title>Metro Game</Title>
      <Button component={Link} href="/game">Start Game</Button>
      <MapContainer />

    </Flex>
  );
}
