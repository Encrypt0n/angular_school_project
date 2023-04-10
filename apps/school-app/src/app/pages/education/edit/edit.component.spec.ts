import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { Education } from 'libs/data/src/lib/education.model';
import { EducationService } from '../../../shared/services/education/education.service';

import { EducationEditComponent } from './edit.component';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('EducationEditComponent', () => {
  let component: EducationEditComponent;
  let fixture: ComponentFixture<EducationEditComponent>;
  let educationService: EducationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationEditComponent ],
      imports: [
        HttpClientModule,
         FormsModule
        // other imports
      ],
      providers: [
        EducationService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => '1'
            })
          }
        },
        {
          provide: Router,
          useClass: class {
            navigate = jest.fn();
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationEditComponent);
    component = fixture.componentInstance;
    educationService = TestBed.inject(EducationService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isEdit to true and call getEducationById if id exists in route params', () => {
      const education = { id: '1', name: 'Math', description: 'Math description', subjects: [] };
      const educationServiceSpy = jest.spyOn(educationService, 'getEducationById').mockReturnValue(of(education));
      component.ngOnInit();
      expect(component.isEdit).toBe(true);
      expect(educationServiceSpy).toHaveBeenCalledWith('1');
      expect(component.education).toEqual(education);
    });

    it('should set isEdit to false and set education to an empty object if id does not exist in route params', () => {
      jest.spyOn(educationService, 'getEducationById');
      component.ngOnInit();
      expect(component.isEdit).toBe(true);
      expect(component.education).toEqual({ id: '', name: '', description: '', subjects: [] });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.isEdit = true;
      component.education = { id: '1', name: 'Math', description: 'Math description', subjects: [] };
      jest.spyOn(educationService, 'getAllEducations').mockReturnValue(of([{ id: '1', name: 'Math', description: 'Math description', subjects: [] }]));
    });

    it('should call updateEducation if isEdit is true', () => {
      const educationForm = { value: { name: 'New Math', description: 'New Math description' } };
      const educationServiceSpy = jest.spyOn(educationService, 'updateEducation').mockReturnValue(of(educationForm.value));
      component.onSubmit(educationForm as NgForm);
      expect(educationServiceSpy).toHaveBeenCalledWith('1', educationForm.value);
      expect(router.navigate).toHaveBeenCalledWith(['education']);
    });

    it('should call addEducation if isEdit is false', () => {
      component.isEdit = false;
      const educationForm = { value: {  name: 'New Math', description: 'New Math description' } };
      const educationServiceSpy = jest.spyOn(educationService, 'addEducation').mockReturnValue(of(educationForm.value));
      component.onSubmit(educationForm as NgForm);
      expect(educationServiceSpy).toHaveBeenCalledWith({ id: 2, ...educationForm.value });
      expect(router.navigate).toHaveBeenCalledWith(['education']);
    });
  });
});
