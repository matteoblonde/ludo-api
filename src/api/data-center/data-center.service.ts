import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { chartOptions } from '../../database/constants';
import ExerciseModel from '../../database/models/Exercise/Exercise';
import MatchModel from '../../database/models/Match/Match';
import PlayerModel from '../../database/models/Player/Player';
import TrainingModel from '../../database/models/Training/Training';
import user from '../../database/models/User/User';
import UserModel from '../../database/models/User/User';
import { IUserData } from '../auth/interfaces/UserData';


@Injectable()
export class DataCenterService {

  constructor(
    @Inject(UserModel.collection.name)
    private readonly userModel: typeof UserModel,
    @Inject(PlayerModel.collection.name)
    private readonly playerModel: typeof PlayerModel,
    @Inject(MatchModel.collection.name)
    private readonly matchModel: typeof MatchModel,
    @Inject(TrainingModel.collection.name)
    private readonly trainingModel: typeof TrainingModel,
    @Inject(ExerciseModel.collection.name)
    private readonly exerciseModel: typeof ExerciseModel
  ) {
  }


  /** Variables declaration */
  colors: string[] = [
    '#D1FAE5',
    '#A7F3D0',
    '#6EE7B7',
    '#34D399',
    '#10B981',
    '#059669',
    '#047857',
    '#065F46',
    '#064E3B',
    '#022C22'
  ];


  /**
   * Retrieves a chart by its type.
   *
   * @param {string} type - The type of the chart in the format "chartType_dataType".
   * @param userData
   * @param optionalParameter
   * @throws {NotFoundException} If no chart retrieval function is found.
   * @returns The chart data.
   */
  public getChartByType(type: string, userData?: IUserData, optionalParameter?: any) {

    /** Map all possible chartType */
    const chartRetrievalFunctions: any = {
      'bar_players-minutes'        : this.getBarPlayersMinutes,
      'bar_players-goals'          : this.getBarPlayersGoals,
      'doughnut_team-results'      : this.getDoughnutTeamResults.bind(this, userData),
      'doughnut_top-five-exercises': this.getDoughnutTopFiveExercises,
      'bubble_minutes-players'     : this.getBubbleMinutesGoals,
      'bubble_matches-minutes'     : this.getBubbleMatchesMinutes,
      'radar_player-attributes'    : this.getRadarPlayerAttributes.bind(this, optionalParameter),
      'radar_players-compare'      : this.getRadarPlayersCompare.bind(this, optionalParameter)
    };

    /** Get the correct function */
    const chartRetrievalFunction = chartRetrievalFunctions[type];

    /** If not function, throw */
    if (!chartRetrievalFunction) {
      throw new NotFoundException('No chartRetrieval function');
    }

    /** Execute function */
    return chartRetrievalFunction.call(this);
  }


  /**
   * Retrieves user dashboard charts based on the provided user data.
   *
   * @param {IUserData} userData - The user data object containing the userId.
   * @returns {Promise<any[]>} A promise that resolves to an array of user dashboard charts.
   * @throws {NotFoundException} If the user is not found.
   */
  public async getUserDashboardCharts(userData: IUserData) {

    /** Get user charts settings */
    const userChartsSettings = await this.userModel.findById(userData.userId, {
      'chartsSettings': 1
    }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    /** If no chartsSettings return empty array */
    if (!userChartsSettings?.chartsSettings || userChartsSettings?.chartsSettings.length === 0) {
      return userChartsSettings?.chartsSettings;
    }

    /** For each chart call the function to retrieve chart data */
    return await Promise.all(userChartsSettings.chartsSettings.map(async (chart: any) => {
      const chartByType = await this.getChartByType(chart.typeName, userData, chart?.optionalParameter);
      return {
        isFavourite: chart.isFavourite,
        ...chartByType
      };
    }));

  }


  /**
   * Private functions to retrieve correct ChartJS data and options Object
   */
  private async getBarPlayersMinutes(limit?: number): Promise<any> {

    /** Get players sorted by totalMinutes and limited by parameter */
    const players = await this.playerModel.find({}, {
      'lastName'    : 1,
      'totalMinutes': 1
    }, {
      limit: limit || 10,
      sort : '-totalMinutes'
    });

    /** Build data object for ChartJS */
    const data = {
      labels  : players.map(player => player.lastName),
      datasets: [
        {
          data           : players.map(player => player.totalMinutes),
          backgroundColor: '#10B981C9',
          borderColor    : '#34D399'
        }
      ]
    };

    return {
      type             : 'bar',
      typeName         : 'bar_players-minutes',
      title            : 'Minuti Giocati',
      subtitle         : 'Grafico che rappresenta i primi 10 giocatori per minuti giocati',
      col              : '6',
      data             : data,
      options          : chartOptions.bar,
      optionalParameter: ''
    };
  }


  private async getBarPlayersGoals(limit?: number): Promise<any> {
    /** Get players sorted by totalMinutes and limited by parameter */
    const players = await this.playerModel.find({}, {
      'lastName'  : 1,
      'totalGoals': 1
    }, {
      limit: limit || 10,
      sort : '-totalGoals'
    });

    /** Build data object for ChartJS */
    const data = {
      labels  : players.map(player => player.lastName),
      datasets: [
        {
          data           : players.map(player => player.totalGoals),
          backgroundColor: '#10B981C9',
          borderColor    : '#34D399'
        }
      ]
    };

    return {
      type             : 'bar',
      typeName         : 'bar_players-minutes',
      title            : 'Gol Totali',
      subtitle         : 'Grafico che rappresenta i primi 10 giocatori per gol segnati',
      col              : '6',
      data             : data,
      options          : chartOptions.bar,
      optionalParameter: ''
    };
  }


  private async getDoughnutTeamResults(userData: any) {

    /** Aggregate data to retrieve Wins, Draw and Defeats object */
    const aggregate = await this.matchModel.aggregate([
      {
        $match: {
          'team._id': { $in: userData.teams.map((id: any) => id.toString()) }
        }
      },
      {
        $project: {
          isHome     : 1,
          homeGoals  : 1,
          awayGoals  : 1,
          matchResult: {
            $switch: {
              branches: [
                {
                  case: { $eq: [ '$isHome', true ] },
                  then: {
                    $cond: {
                      if  : { $gt: [ '$homeGoals', '$awayGoals' ] },
                      then: 'victory',
                      else: { $cond: { if: { $eq: [ '$homeGoals', '$awayGoals' ] }, then: 'draw', else: 'defeat' } }
                    }
                  }
                },
                {
                  case: { $eq: [ '$isHome', false ] },
                  then: {
                    $cond: {
                      if  : { $gt: [ '$awayGoals', '$homeGoals' ] },
                      then: 'victory',
                      else: { $cond: { if: { $eq: [ '$awayGoals', '$homeGoals' ] }, then: 'draw', else: 'defeat' } }
                    }
                  }
                }
              ]
            }
          }
        }
      },
      {
        $group: {
          _id  : '$matchResult',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id   : 0,
          result: '$_id',
          count : 1
        }
      }
    ]);

    /** Get variables */
    const wins = aggregate.find(item => item.result === 'victory')?.count || 0;
    const draws = aggregate.find(item => item.result === 'draw')?.count || 0;
    const defeats = aggregate.find(item => item.result === 'defeat')?.count || 0;


    /** Build data object for ChartJS */
    const data = {
      labels  : [ 'Vittorie', 'Pareggi', 'Sconfitte' ],
      datasets: [
        {
          data           : [ wins, draws, defeats ],
          backgroundColor: [ '#10B981C9', '#94A3B8', '#F87171' ],
          hoverOffset    : 30,
          borderWidth    : 1
        }
      ]
    };

    /** return chartJS object */
    return {
      type             : 'doughnut',
      typeName         : 'doughnut_team-results',
      title            : 'Prestazione',
      subtitle         : 'Grafico che rappresenta le vittorie, sconfitte e pareggi della squadra',
      col              : '6',
      data             : data,
      options          : chartOptions.doughnut,
      optionalParameter: ''
    };


  }


  private async getDoughnutTopFiveExercises() {

    /** aggregate to retrieve top 5 exercises in trainings */
    const exercises = await this.trainingModel.aggregate([
      { $unwind: '$exercises' },
      { $group: { _id: '$exercises._id', exerciseName: { $first: '$exercises.exerciseName' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    /** Build data object for chartJS */
    const data = {
      labels  : exercises.map(exercise => exercise.exerciseName),
      datasets: [
        {
          label          : '',
          data           : exercises.map(exercise => exercise.count),
          backgroundColor: [ '#10B981', '#38BDF8', '#FB923C', '#FACC15', '#E11D48' ],
          hoverOffset    : 50,
          borderWidth    : 1
        }
      ]
    };

    /** return chartJS object */
    return {
      type             : 'doughnut',
      typeName         : 'doughnut_top-five-exercises',
      title            : 'Top 5 Esercizi',
      subtitle         : 'Grafico che rappresenta i 5 esercizi più utilizzati in tutti gli allenamenti',
      col              : '6',
      data             : data,
      options          : chartOptions.doughnut,
      optionalParameter: ''
    };

  }


  private async getBubbleMinutesGoals(limit?: number) {

    /** Get players sorted by totalMinutes and limited by parameter */
    const players = await this.playerModel.find({}, {
      'lastName'    : 1,
      'totalGoals'  : 1,
      'totalMinutes': 1
    }, {
      limit: limit || 10,
      sort : '-totalGoals'
    });

    /** Build data object for ChartJS */
    const data = {
      datasets:
        players.map((player, index) => {
          return {
            label          : player.lastName,
            data           : [
              {
                x: player.totalMinutes,
                y: player.totalGoals,
                r: 10
              }
            ],
            backgroundColor: this.colors[index]
          };
        })
    };

    return {
      type             : 'bubble',
      typeName         : 'bubble_minutes-players',
      title            : 'Gol per minuti giocati',
      subtitle         : 'Grafico che rappresenta i primi 10 giocatori per gol su minuti giocati',
      col              : '6',
      data             : data,
      options          : chartOptions['bubble_minutes-goals'],
      optionalParameter: ''
    };

  }


  private async getBubbleMatchesMinutes(limit?: number) {

    /** Get players sorted by totalMinutes and limited by parameter */
    const players = await this.playerModel.find({}, {
      'lastName'    : 1,
      'totalMatches': 1,
      'totalMinutes': 1
    }, {
      limit: limit || 10,
      sort : '-totalMinutes'
    });

    /** Build data object for ChartJS */
    const data = {
      datasets:
        players.map((player, index) => {
          return {
            label          : player.lastName,
            data           : [
              {
                x: player.totalMatches,
                y: player.totalMinutes,
                r: 10
              }
            ],
            backgroundColor: this.colors[index]
          };
        })
    };

    return {
      type             : 'bubble',
      typeName         : 'bubble_matches-minutes',
      title            : 'Minuti giocati per partite',
      subtitle         : 'Grafico che rappresenta i primi 10 giocatori per minuti giocati per partite',
      col              : '6',
      data             : data,
      options          : chartOptions['bubble_matches-minutes'],
      optionalParameter: ''
    };

  }


  private async getRadarPlayerAttributes(playerId: string) {

    /** Get the player */
    const player: any = await this.playerModel.findById(playerId, { 'lastName': 1, 'attributes': 1 });

    /** If no player exit with error */
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    /** Build data for the chart */
    const attributeForChart = player.attributes.filter((attribute: any) => !attribute.isText);

    const labels = attributeForChart.map((attribute: any) => `${attribute.attributeName
      ? attribute.attributeName
      : attribute.statName} - ${attribute.value}`);
    const attributeValues = attributeForChart.map((attribute: any) => attribute.value);

    const data = {
      labels  : labels,
      datasets: [
        {
          label          : player.lastName,
          backgroundColor: '#10B981C9',
          borderColor    : '#10B981',
          data           : attributeValues
        }
      ]
    };

    return {
      type             : 'radar',
      typeName         : 'radar_player-attributes',
      title            : 'Attributi Giocatore',
      subtitle         : 'Grafico che rappresenta l\'abilità del giocatore attraverso i suoi attributi',
      col              : '6',
      data             : data,
      options          : chartOptions['radar_player-attributes'],
      optionalParameter: ''
    };

  }


  private async getRadarPlayersCompare(players: string) {

    /** Split parameter to get string array */
    const playersId = players.split(',');

    /** Get the two players */
    const player1: any = await this.playerModel.findById(playersId[0], { 'lastName': 1, 'attributes': 1 });
    const player2: any = await this.playerModel.findById(playersId[1], { 'lastName': 1, 'attributes': 1 });

    /** Build data for the chart */
    const attribute1ForChart = player1.attributes.filter((attribute: any) => !attribute.isText);
    const attribute2ForChart = player2.attributes.filter((attribute: any) => !attribute.isText);

    const labels = attribute1ForChart.map((attribute: any) => `${attribute.attributeName
      ? attribute.attributeName
      : attribute.statName} - ${attribute.value}`);
    const attribute1Values = attribute1ForChart.map((attribute: any) => attribute.value);
    const attribute2Values = attribute2ForChart.map((attribute: any) => attribute.value);

    const data = {
      labels  : labels,
      datasets: [
        {
          label          : player1.lastName,
          backgroundColor: '#047857C9',
          borderColor    : '#047857',
          data           : attribute1Values
        },
        {
          label          : player2.lastName,
          backgroundColor: '#6EE7B7C9',
          borderColor    : '#6EE7B7',
          data           : attribute2Values
        }
      ]
    };

    return {
      type             : 'radar',
      typeName         : 'radar_players-compare',
      title            : 'Confronto Giocatori',
      subtitle         : 'Grafico che mette a confronto gli attributi di due giocatori',
      col              : '6',
      data             : data,
      options          : chartOptions['radar_players-compare'],
      optionalParameter: players
    };

  }


}
