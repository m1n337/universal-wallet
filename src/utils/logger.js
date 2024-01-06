import pino from 'pino';
import pinoPretty from 'pino-pretty';

export const logger = new pino(pinoPretty());
