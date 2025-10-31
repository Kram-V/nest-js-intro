import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaginatedInterface } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<PaginatedInterface<T>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;

    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const prevPage = page === 1 ? page : page - 1;

    const finalResponse: PaginatedInterface<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        firstPage: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        lastPage: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        currentPage: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        nextPage: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        prevPage: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`,
      },
    };

    return finalResponse;
  }
}
