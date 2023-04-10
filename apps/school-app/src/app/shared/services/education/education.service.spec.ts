import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EducationService } from './education.service';

describe('EducationService', () => {
  let service: EducationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EducationService]
    });
    service = TestBed.inject(EducationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of educations', () => {
    const mockEducations = [
      { id: 1, name: 'Education 1', description: 'Education 1 description', subjects: ['Subject 1', 'Subject 2'] },
      { id: 2, name: 'Education 2', description: 'Education 2 description', subjects: ['Subject 3', 'Subject 4'] }
    ];

    service.getAllEducations().subscribe(educations => {
      expect(educations.length).toBe(2);
      expect(educations).toEqual(mockEducations);
    });

    const request = httpMock.expectOne(`${service['url']}/education`);
    expect(request.request.method).toBe('GET');
    request.flush(mockEducations);
  });

  it('should return an education by id', () => {
    const mockEducation = { id: 1, name: 'Education 1', description: 'Education 1 description', subjects: ['Subject 1', 'Subject 2'] };

    service.getEducationById('1').subscribe(education => {
      expect(education).toEqual(mockEducation);
    });

    const request = httpMock.expectOne(`${service['url']}/education/1`);
    expect(request.request.method).toBe('GET');
    request.flush(mockEducation);
  });

  it('should add a new education', () => {
    const newEducation = { name: 'New Education', description: 'New Education description', subjects: ['Subject 1', 'Subject 2'] };

    service.addEducation(newEducation).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const request = httpMock.expectOne(`${service['url']}/education`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newEducation);
    request.flush({});
  });

  it('should delete an education', () => {
    const educationId = '1';

    service.deleteEducation(educationId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const request = httpMock.expectOne(`${service['url']}/education/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('should update an education', () => {
    const educationId = '1';
    const updatedEducation = { name: 'Updated Education', description: 'Updated Education description', subjects: ['Subject 3', 'Subject 4'] };

    service.updateEducation(educationId, updatedEducation).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const request = httpMock.expectOne(`${service['url']}/education/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedEducation);
    request.flush({});
  });
});
