import { buildSchema } from '@typegoose/typegoose';
import { Notification } from './Notification';


const NotificationSchema = buildSchema(Notification);

export default NotificationSchema;
