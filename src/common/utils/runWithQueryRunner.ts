import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CustomBadRequestException } from '../exceptions/custom-bad-request.exception';
import { DatabaseException } from '../exceptions/database.exception';
import { PostgresErrorCode } from '../modules/pg-database/errors/database.errors';

export const runWithQueryRunner = async <T>(
  dataSource: DataSource,
  query: (qr: QueryRunner) => T | Promise<T>,
) => {
  let queryRunner: QueryRunner;
  try {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const result = await query(queryRunner);

    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    console.error(error);
    if (
      queryRunner &&
      !queryRunner.isReleased &&
      queryRunner.isTransactionActive
    ) {
      await queryRunner.rollbackTransaction();
    }
    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof UnauthorizedException) {
      throw new UnauthorizedException(error.message);
    }
    if (error instanceof CustomBadRequestException) {
      throw error;
    }

    if (
      error instanceof DatabaseException &&
      error.pgError?.code === PostgresErrorCode.UniqueViolation
    ) {
      throw new InternalServerErrorException({
        message: 'Unique constraint violation',
      });
    }
    throw new InternalServerErrorException();
  } finally {
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.release();
    }
  }
};
