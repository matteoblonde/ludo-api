import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';


@ApiTags('Notifications')
@Controller(':collection')
@UseInterceptors(HttpCacheInterceptor)
export class NotificationsController {

  constructor() {
  }


}
