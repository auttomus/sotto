import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { MajorsService } from './majors.service';
import { MajorModel } from './models/major.model';
import { Public } from '../../common/decorators/public.decorator';

@Resolver(() => MajorModel)
export class MajorsResolver {
  constructor(private readonly majorsService: MajorsService) {}

  @Public()
  @Query(() => [MajorModel], { name: 'majorsBySchool' })
  async getMajorsBySchool(
    @Args('schoolId', { type: () => ID }) schoolId: string,
  ): Promise<MajorModel[]> {
    return await this.majorsService.getMajorsBySchool(schoolId);
  }
}
