import { os } from '@orpc/server';

const ping = os.handler(async () => 'ping');
const pong = os.handler(async () => 'pong');

const router = {
	ping,
	pong,
	nested: { ping, pong },
};

export default router;
