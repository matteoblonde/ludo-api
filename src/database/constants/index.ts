/**
 * A mapping of collections to their respective models.
 *
 * @type {Object}
 * @property {string} companies - The company model name.
 * @property {string} exercises - The exercise model name.
 * @property {string} labels - The label model name.
 * @property {string} matches - The match model name.
 * @property {string} notifications - The notification model name.
 * @property {string} players - The player model name.
 * @property {string} playerRoles - The player role model name.
 * @property {string} roles - The role model name.
 * @property {string} teams - The team model name.
 * @property {string} trainings - The training model name.
 * @property {string} users - The user model name.
 */
export const collectionToModelMap: any = {

  'companies'            : 'Company',
  'exercises'            : 'Exercise',
  'exercise-types'       : 'ExerciseType',
  'labels'               : 'Label',
  'label-types'          : 'LabelType',
  'matches'              : 'Match',
  'notifications'        : 'Notification',
  'players'              : 'Player',
  'player-roles'         : 'PlayerRole',
  'player-attributes'    : 'PlayerAttribute',
  'player-sub-attributes': 'PlayerSubAttribute',
  'roles'                : 'Role',
  'teams'                : 'Team',
  'trainings'            : 'Training',
  'training-absences'    : 'TrainingAbsence',
  'training-types'       : 'TrainingType',
  'users'                : 'User',
  'maybe-user'           : 'MaybeUser',
  'document-types'       : 'DocumentType',
  'document'             : 'Document',
  'seasons'              : 'Season',
  'attributes-story'     : 'AttributeStory',
  'targets'              : 'Target',
  'scouted-players'      : 'ScoutedPlayer',
  'scouting-status'      : 'ScoutingStatus',
  'contacts'             : 'Contact',
  'contact-types'        : 'ContactType'
};

/**
 * chartOptions by type
 */
export const chartOptions: any = {
  'bar'                    : {
    responsive: true,
    plugins   : {
      legend: {
        labels : {
          color: '#D1D5DB'
        },
        display: false
      }
    },
    scales    : {
      y: {
        beginAtZero: true,
        ticks      : {
          color: '#D1D5DB'
        },
        grid       : {
          color: '#4B5563'
        }
      },
      x: {
        ticks: {
          color: '#D1D5DB'
        },
        grid : {
          color: '#4B5563'
        }
      }
    }
  },
  'doughnut'               : {
    responsive         : true,
    maintainAspectRatio: false,
    plugins            : {
      legend: {
        position: 'top'
      }
    }
  },
  'bubble_minutes-goals'   : {
    responsive: true,
    plugins   : {
      legend: {
        labels  : {
          color: '#D1D5DB'
        },
        position: 'left'
      }
    },
    scales    : {
      y: {
        title: {
          display: true,
          text   : 'Goals',
          color  : '#D1D5DB'
        },
        ticks: {
          color   : '#D1D5DB',
          stepSize: 2
        },
        grid : {
          color: '#4B5563'
        }
      },
      x: {
        title: {
          display: true,
          text   : 'Minuti',
          color  : '#D1D5DB'
        },
        ticks: {
          color: '#D1D5DB'
        },
        grid : {
          color: '#4B5563'
        }
      }
    }
  },
  'bubble_matches-minutes' : {
    responsive: true,
    plugins   : {
      legend: {
        labels  : {
          color: '#D1D5DB'
        },
        position: 'left'
      }
    },
    scales    : {
      y: {
        title: {
          display: true,
          text   : 'Minuti',
          color  : '#D1D5DB'
        },
        ticks: {
          color: '#D1D5DB'
        },
        grid : {
          color: '#4B5563'
        }
      },
      x: {
        title: {
          display: true,
          text   : 'Partite',
          color  : '#D1D5DB'
        },
        ticks: {
          color   : '#D1D5DB',
          stepSize: 1
        },
        grid : {
          color: '#4B5563'
        }
      }
    }
  },
  'radar_player-attributes': {
    plugins            : {
      legend: {
        display: false
      }
    },
    scales             : {
      r: {
        grid       : {
          color: '#6B7280'
        },
        min        : 0,
        max        : 10,
        ticks      : {
          display : false,
          stepSize: 2
        },
        pointLabels: {
          color: '#F9FAFB',
          font : {
            size: 12
          }
        }
      }
    },
    responsive         : true,
    maintainAspectRatio: false,
    aspectRatio        : 1,
    elements           : {
      line : {
        borderJoinStyle: 'round',
        borderWidth    : 5,
        borderCapStyle : 'round',
        tension        : 0.02
      },
      point: {
        radius: 5
      }
    }
  },
  'radar_players-compare'  : {
    plugins            : {
      legend: {
        display : true,
        position: 'left',
        labels  : {
          color: '#D1D5DB'
        }
      }
    },
    scales             : {
      r: {
        grid       : {
          color: '#6B7280'
        },
        min        : 0,
        max        : 10,
        ticks      : {
          display : false,
          stepSize: 2
        },
        pointLabels: {
          color: '#F9FAFB',
          font : {
            size: 12
          }
        }
      }
    },
    responsive         : true,
    maintainAspectRatio: false,
    aspectRatio        : 1,
    elements           : {
      line : {
        borderJoinStyle: 'round',
        borderWidth    : 3,
        borderCapStyle : 'round',
        tension        : 0.02
      },
      point: {
        radius: 3
      }
    }
  }
};
