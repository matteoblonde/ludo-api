import { BadRequestException, Inject } from '@nestjs/common';
import mongoose from 'mongoose';
import { ROUTE_MODEL } from '../../database/database.providers';
import { Exercise } from '../../database/models/Exercise/Exercise';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class ExercisesService extends AbstractedCrudService<Exercise> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly exerciseModel: mongoose.Model<any>,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
  ) {
    super(exerciseModel);
  }


  /**
   * Update an exercise into Database
   * @param id
   * @param exercise
   */
  public async updateOneExercise(id: string, exercise: any) {

    /* Check if id has been passed */
    if (!id) {
      return null;
    }

    /* Find the recordId */
    await this.exerciseModel.findById(id).exec().then(async (exist: any) => {

      /* If none records found, exit */
      if (exist !== null) {
        await this.exerciseModel.replaceOne({ _id: id }, exercise);
      }
      else {
        return;
      }
    }).catch(() => {
      throw new BadRequestException(
        'Could not update or create record',
        'invalid fields'
      );
    });

    /* Return a JSON with ID and message */
    return {
      id     : id,
      message: 'Record has been successfully updated'
    };

  }


  /**
   * Updates the image URL of an exercise.
   *
   * @param {string} id - The ID of the exercise to update.
   * @param {string} imgUrl - The new image URL.
   * @returns {Promise} - A promise that resolves to the updated exercise document.
   */
  public async updateExerciseImgUrl(id: string, imgUrl: string): Promise<any> {
    return this.exerciseModel.findByIdAndUpdate(id, {
      imgUrl: imgUrl
    });
  }

}
