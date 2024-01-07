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

  'companies'        : 'Company',
  'exercises'        : 'Exercise',
  'exercise-types'   : 'ExerciseType',
  'labels'           : 'Label',
  'label-types'      : 'LabelType',
  'matches'          : 'Match',
  'notifications'    : 'Notification',
  'players'          : 'Player',
  'player-roles'     : 'PlayerRole',
  'player-attributes': 'PlayerAttribute',
  'roles'            : 'Role',
  'teams'            : 'Team',
  'trainings'        : 'Training',
  'training-absences': 'TrainingAbsence',
  'training-types'   : 'TrainingType',
  'users'            : 'User',
  'document-types'   : 'DocumentType',
  'document'         : 'Document',
  'seasons'          : 'Season',
  'attributes-story' : 'AttributeStory'

};
