import {Server, Origins} from 'boardgame.io/server';
import {MetroMayhem} from './scripts/Game';

const server = Server({
	games: [MetroMayhem],
 	origins: [Origins.LOCALHOST],
});

server.run(8000);