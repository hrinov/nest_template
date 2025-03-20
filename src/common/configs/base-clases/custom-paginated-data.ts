import { Paginated } from 'nestjs-paginate';

export class CustomPaginatedData<RawData, MappedData> {
  data: MappedData[];
  meta: Paginated<RawData>['meta'];
  links: Paginated<RawData>['links'];

  constructor({
    data,
    meta,
    links,
  }: {
    data: MappedData[];
    meta: Paginated<RawData>['meta'];
    links: Paginated<RawData>['links'];
  }) {
    this.data = data;
    this.meta = meta;
    this.links = links;
  }
}
