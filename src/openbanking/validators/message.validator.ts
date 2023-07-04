import * as Joi from 'joi';
import { IMessagePayload } from '../interfaces';

export const MessageValidator = Joi.object<IMessagePayload>({
  accessToken: Joi.string(),
}).required();
