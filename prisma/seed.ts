import {
  Candidate,
  Interview,
  PrismaClient,
  Question,
  Test,
  User,
} from '@prisma/client';
import { HashService } from './../src/utils/hash/hash.service';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  const user = await createInitialUser();
  const candidates = await createInitialCandidates(user.id);
  const test = await createInitialTest(user.id);
  const interview = await createInitialInterview(
    candidates[0].id,
    test.id,
    user.id,
  );
  const answers = await createInitialAnswers(interview.id);
}

const createInitialUser = async (): Promise<User> => {
  const username = process.env.SEED_USER_USERNAME || 'admin';
  const email = process.env.SEED_USER_EMAIL || 'admin@gmail.com';
  const password = await HashService.hash(
    process.env.SEED_USER_PASSWORD || 'password',
  );
  const user = await prisma.user.upsert({
    where: { email, username },
    update: {},
    create: {
      username,
      email,
      password,
    },
  });

  console.log('Initial user was created successfully', user);

  return user;
};

const createInitialCandidates = async (
  userId: string,
): Promise<Candidate[]> => {
  const list: Candidate[] = await prisma.candidate.findMany({
    where: { userId },
  });

  if (list.length > 0) {
    return list;
  }

  const candidates = [];

  for (let i = 0; i < 10; i++) {
    candidates.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      resumeLink: faker.internet.url(),
      userId,
    });
  }

  await prisma.candidate.createMany({
    data: candidates,
    skipDuplicates: true,
  });

  const result = await prisma.candidate.findMany({ where: { userId } });

  console.log('Initial candidates was created successfully', result);

  return result;
};

const createInitialTest = async (userId: string): Promise<Test> => {
  const list: Test[] = await prisma.test.findMany({ where: { userId } });

  if (list.length > 0) {
    return list[0];
  }

  const test = await prisma.test.create({
    data: {
      name: 'Test',
      userId,
    },
  });

  await createInitialQuestions(test.id, userId);

  console.log('Initial test was created successfully', test);

  return test;
};

const createInitialQuestions = async (
  testId: string,
  userId: string,
): Promise<Question[]> => {
  const list = await prisma.question.findMany({ where: { testId } });

  if (list.length > 0) {
    return list;
  }

  const questions = [];

  for (let i = 0; i < 10; i++) {
    questions.push({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      answer: faker.lorem.paragraph(),
      order: i,
      testId,
      userId,
    });
  }

  await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  const result = await prisma.question.findMany({ where: { testId } });

  console.log('Initial questions was created successfully', result);

  return result;
};

const createInitialInterview = async (
  candidateId: string,
  testId: string,
  userId: string,
): Promise<Interview> => {
  const item = await prisma.interview.findFirst({
    where: {
      candidateId,
      testId,
      userId,
    },
  });

  if (item) {
    return item;
  }

  const interview = await prisma.interview.create({
    data: {
      name: faker.lorem.words(5),
      description: faker.lorem.sentence(2),
      candidateId,
      testId,
      userId,
    },
  });

  console.log('Initial interview was created successfully', interview);

  return interview;
};

const createInitialAnswers = async (interviewId: string) => {
  const list = await prisma.answer.findMany({
    where: {
      interviewId,
    },
  });

  if (list.length > 0) {
    return list;
  }

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId },
  });

  const questions = await prisma.question.findMany({
    where: { testId: interview.testId },
  });

  const answers = [];

  for (const question of questions) {
    answers.push({
      questionId: question.id,
      interviewId,
      correct: faker.datatype.boolean(),
    });
  }

  const answer = await prisma.answer.createMany({
    data: answers,
  });

  console.log('Initial answer was created successfully', answer);

  return answer;
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
