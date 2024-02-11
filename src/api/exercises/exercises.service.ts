import { BadRequestException, Inject } from '@nestjs/common';
import mongoose from 'mongoose';
import { S3Service } from '../../aws';
import { ROUTE_MODEL } from '../../database/database.providers';
import { Exercise } from '../../database/models/Exercise/Exercise';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class ExercisesService extends AbstractedCrudService<Exercise> {

  constructor(
    @Inject(ROUTE_MODEL)
    private readonly exerciseModel: mongoose.Model<any>,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel,
    private s3Service: S3Service
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


  /**
   * Deletes the image associated with an exercise.
   *
   * @param {string} id - The ID of the exercise.
   * @param {string} company - The company name.
   * @return {Promise<void>} - A Promise that resolves when the image is deleted and the record is updated.
   */
  public async deleteExerciseImg(id: string, company: string) {

    /** Get the exercise */
    const exercise = await this.exerciseModel.findById(id);

    /** If no imgUrl return */
    if (!exercise.imgUrl) {
      return;
    }
    
    /** Delete file from S3 */
    await this.s3Service.deleteFile(id, company);

    /** Update the record */
    await this.exerciseModel.findByIdAndUpdate(id, {
      imgUrl: null
    });

  }

}
