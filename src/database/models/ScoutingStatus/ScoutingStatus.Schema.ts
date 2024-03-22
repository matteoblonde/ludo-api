import { buildSchema } from '@typegoose/typegoose';
import { ScoutingStatus } from './ScoutingStatus';


const ScoutingStatusSchema = buildSchema(ScoutingStatus);

export default ScoutingStatusSchema;
