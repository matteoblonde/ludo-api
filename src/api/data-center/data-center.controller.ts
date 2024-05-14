import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import user from '../../database/models/User/User';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { DataCenterService } from './data-center.service';


@ApiTags('SettingsConfig')
@Controller('data-center')
@UseInterceptors(HttpCacheInterceptor)
export class DataCenterController {

  constructor(
    private readonly dataCenterService: DataCenterService
  ) {
  }


  /**
   * Retrieves a chart by its type.
   *
   * @param {string} type - The type of the chart.
   * @param optionalParameter
   * @param userData
   * @return {Promise<any>} - A promise that resolves to the chart.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get('/:type')
   */
  @UseGuards(AccessTokenGuard)
  @Get(':type/:optionalParameter')
  public async getChartByType(
    @Param('type') type: string,
    @Param('optionalParameter') optionalParameter: any,
    @UserData() userData: IUserData
  ): Promise<any> {
    return this.dataCenterService.getChartByType(type, userData, optionalParameter);
  }


  /**
   * Retrieves the dashboard charts data for a user.
   *
   * @param {IUserData} userData - The user data containing the user ID.
   * @returns {Promise<any>} - A Promise that resolves with the dashboard charts data.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get('/dashboard')
   */
  @UseGuards(AccessTokenGuard)
  @Get('user/dashboard/favourite')
  public async getDashboardCharts(
    @UserData() userData: IUserData
  ): Promise<any> {
    return this.dataCenterService.getUserDashboardCharts(userData);
  }

}
