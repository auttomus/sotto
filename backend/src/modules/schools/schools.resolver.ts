import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { SchoolsService } from './schools.service';
import { SchoolModel } from './models/school.model';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => SchoolModel)
export class SchoolsResolver {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Public()
  @Query(() => [SchoolModel], { name: 'searchSchools' })
  async searchSchools(@Args('query') query: string) {
    const schools = await this.schoolsService.searchSchools(query);
    return schools.map((s) => ({ ...s, id: s.id }));
  }

  @Public()
  @Query(() => SchoolModel, { name: 'school', nullable: true })
  async getSchool(@Args('id', { type: () => ID }) id: string) {
    const school = await this.schoolsService.getSchool(id);
    return school ? { ...school, id: school.id } : null;
  }

  @Public()
  @Query(() => [SchoolModel], { name: 'schools' })
  async getAllSchools() {
    const schools = await this.schoolsService.getAllSchools();
    return schools.map((s) => ({ ...s, id: s.id }));
  }
}
