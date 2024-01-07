import { buildSchema } from '@typegoose/typegoose';
import { AttributeStory } from './AttributeStory';


const AttributeStorySchema = buildSchema(AttributeStory);

export default AttributeStorySchema;
