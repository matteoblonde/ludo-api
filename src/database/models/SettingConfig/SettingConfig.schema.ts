import { buildSchema } from '@typegoose/typegoose';
import { SettingConfig } from './SettingConfig';


const SettingConfigSchema = buildSchema(SettingConfig);

export default SettingConfigSchema;
