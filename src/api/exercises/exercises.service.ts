import { BadRequestException, Inject } from '@nestjs/common';
import ExerciseModel, { Exercise } from '../../database/models/Exercise/Exercise';
import { Label } from '../../database/models/Label/Label';
import LabelTypeModel from '../../database/models/LabelType/LabelType';
import { AbstractedCrudService } from '../abstractions/abstracted-crud.service';


export class ExercisesService extends AbstractedCrudService<Exercise> {

  constructor(
    @Inject(ExerciseModel.collection.name)
    private readonly exerciseModel: typeof ExerciseModel,
    @Inject(LabelTypeModel.collection.name)
    private readonly labelTypeModel: typeof LabelTypeModel
  ) {
    super(exerciseModel);
  }


  /**
   * Insert new exercise into database
   * @param exercise
   */
  public async insertNewExercise(exercise: Exercise) {

    /**
     * Find all labels to append to the record
     */
    const labelTypes = await this.labelTypeModel.find({ 'sections': 'exercises' });
    const labels = labelTypes.map((labelType) => {
      return {
        labelName          : labelType.labelTypeName,
        labelPossibleValues: labelType.isValueList ? labelType.labelTypeValuesList : null,
        isFreeText         : labelType.isFreeText,
        isValueList        : labelType.isValueList,
        labelValue         : '',
        labelValueType     : labelType.labelValueType
      };
    });

    /**
     * Build the final record
     */
    const record = new this.exerciseModel({ labels: labels, ...exercise });

    /* save the record, mongo.insertOne() */
    await record.save();

    /* return created record */
    return record;

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
   * Delete one exercise into Database
   * @param id
   */
  public async deleteExercise(id: string) {

    /** Check required variables */
    if (id === undefined) {
      throw new BadRequestException(
        'Required variables missing',
        'Params missing: id'
      );
    }

    /** Call mongoose method to delete document */
    await this.exerciseModel.findByIdAndDelete(id);

    /** Return a JSON with ID and message */
    return {
      recordID: id,
      message : 'Record deleted successfully'
    };

  }


  /**
   * Function to update only labels array in the exercise
   * @param id
   * @param labels
   */
  public async updateExerciseLabels(id: string, labels: Label[]) {
    return this.exerciseModel.findByIdAndUpdate(id, {
      labels: labels
    });
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
