import { DataSource } from 'typeorm';

import { configFactory } from './config';

export default new DataSource(configFactory().typeorm);
