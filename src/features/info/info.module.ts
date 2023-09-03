import { Module } from '@nestjs/common';
import { OccupationModule } from './occupation/occupation.module';
import { SegmentModule } from './segment/segment.module';
import { IdeaStageModule } from './idea-stage/idea-stage.module';
import { RoleModule } from './role/role.module';
import { AddressModule } from './address/address.module';
import { OnboardingStepModule } from './onboarding-step/onboarding-step.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    OccupationModule,
    SegmentModule,
    IdeaStageModule,
    RoleModule,
    AddressModule,
    OnboardingStepModule,
    DocumentModule,
  ],
})
export class InfoModule {}
