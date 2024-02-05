import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../../utils/interceptors/http-cache.interceptor';
import { UserData } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces/UserData';
import { SettingsConfigService } from './settings-config.service';


@ApiTags('SettingsConfig')
@Controller('config')
@UseInterceptors(HttpCacheInterceptor)
export class SettingsConfigController {

  constructor(
    private readonly settingsConfigService: SettingsConfigService
  ) {
  }


  /**
   * Retrieves the settings configuration data.
   *
   * @returns A Promise that resolves with the settings configuration data.
   * @throws Will throw an error if an unauthorized access attempt is made.
   */
  @UseGuards(AccessTokenGuard)
  @Get('standard')
  public async getSettingsConfig(): Promise<any> {
    return this.settingsConfigService.getStandardSettingsConfig();
  }


  /**
   * Creates a configuration by specified ID.
   *
   * @param {string} configId - The ID of the configuration.
   *
   * @param userData
   * @returns {Promise<any>} - A Promise that resolves to the created configuration.
   *
   * @UseGuards(AccessTokenGuard)
   * @Get('create/:configId')
   */
  @UseGuards(AccessTokenGuard)
  @Get('create/:configId')
  public async createConfigById(
    @Param('configId') configId: string,
    @UserData() userData: IUserData
  ): Promise<any> {
    return this.settingsConfigService.createConfigById(configId, userData.company);
  }

}
