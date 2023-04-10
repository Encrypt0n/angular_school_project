import { of } from 'rxjs';
import { EducationDetailComponent } from './detail.component';
import { Education } from 'apps/school-app/src/app/shared/models/education.model';
import { EducationService } from '../../../shared/services/education/education.service';

describe('EducationDetailComponent', () => {
  let component: EducationDetailComponent;
  let educationService: any;
  let education: Education;
  let route: any;

  beforeEach(() => {
    educationService = {
      getEducationById: jest.fn(),
    } as any;
    education = {
      id: "1",
      name: 'Test Education',
      description: 'Test Description',
      subjects: []
    };
    route = {
      paramMap: of({
        get: () => 1,
      }),
    };
    component = new EducationDetailComponent(educationService, route);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set education when getEducationById is called', () => {
    educationService.getEducationById.mockReturnValue(of(education));
    component.ngOnInit();
    expect(component.education).toEqual(education);
  });
});


 
