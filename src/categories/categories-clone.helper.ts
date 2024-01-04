import { Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { QuestionEntity } from 'src/questions/entities/question.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesCloneHelper {
  public parseCategories(
    categorieslist: CategoryEntity[],
    testId: string,
    userId: string,
  ) {
    return categorieslist.map(({ name, questions }, i) => {
      const id = uuidv4();

      const categoryQuestions = this.parseQuestions(
        questions,
        testId,
        userId,
        id,
      );

      return { id, name, testId, order: i, questions: categoryQuestions };
    });
  }

  public parseQuestions(
    questionsList: QuestionEntity[],
    testId: string,
    userId: string,
    categoryId: string,
  ) {
    return questionsList.map(({ title, description, answer }, i) => {
      return {
        title,
        description,
        answer,
        categoryId,
        order: i,
        testId,
        userId,
      };
    });
  }
}
