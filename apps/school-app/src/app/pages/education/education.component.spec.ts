import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationComponent } from './education.component';
import { EducationService } from '../../shared/services/education/education.service';
import { UserService } from '../../shared/services/user/user.service';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  beforeEach(async () => {
    const mockEducationService = {
      getAllEducations: jest.fn().mockReturnValue({
        subscribe: jest.fn()
      }),
      deleteEducation: jest.fn().mockReturnValue({
        subscribe: jest.fn()
      })
    };

    const mockUserService = {
      decodeJwtToken: jest.fn().mockReturnValue({ id: '123' }),
      getAuthorizationToken: jest.fn().mockReturnValue('token'),
      getUserById: jest.fn().mockReturnValue({
        subscribe: jest.fn()
      })
    };

    await TestBed.configureTestingModule({
      declarations: [EducationComponent],
      providers: [
        { provide: EducationService, useValue: mockEducationService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all educations', () => {
    expect(component.educations).toEqual([]);

    component.ngOnInit();

    expect(component.educations).toEqual([]);
  });

  it('should delete education', () => {
    component.deleteEducation('123');

    expect(component).toBeTruthy();
  });
});
