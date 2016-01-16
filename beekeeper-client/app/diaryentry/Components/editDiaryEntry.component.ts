import {Component} 		from 'angular2/core';
import {Router}			from 'angular2/router';
import {RouteParams}	from 'angular2/router';
import {DiaryEntryService}	from '../services/diaryentry.service';

@Component({
	selector: 'EditDiaryEntry',
	templateUrl: 'app/diaryentry/Templates/editDiaryEntry.template.html',
	providers: [DiaryEntryService]
})
export class EditDiaryEntryComponent {
	public diaryentry: any;
	public diaryEntryService: DiaryEntryService;
	public router: Router;
	
	public typeEnum: any[];
	
	constructor(diaryEntryService: DiaryEntryService, router: Router, params: RouteParams) {
		this.diaryEntryService = diaryEntryService;
		this.router = router;
		
		this.diaryentry = {};
		
		this.typeEnum = [];
		this.typeEnum.push("acarianControl");
		this.typeEnum.push("construction");
		this.typeEnum.push("cutDroneBrood");
		this.typeEnum.push("other");
		this.typeEnum.push("feeding");
		this.typeEnum.push("honeyRemoval");
		this.typeEnum.push("loss");
		this.typeEnum.push("treatment");
		console.log("id is: ");
		console.log(params.get('id'));
		this.loadSelectedDiaryEntryFromWebService(params.get('id'));
	}
	
	public loadSelectedDiaryEntryFromWebService(id: string): void {
		var instance = this;
		var observableObject = this.diaryEntryService.getDiaryEntryById(id);
		observableObject.subscribe(
			diaryEntry => {
				instance.diaryentry = diaryEntry;
				console.log(this.diaryentry);
			},
			error => console.log("Error " + error),
			() => console.log("Loaded single diaryEntry")
		);
	}
	
	public updateDiaryEntry(): void {
		this.diaryEntryService.updateDiaryEntry(this.diaryentry, this.updateDiaryEntryCallback('DiaryEntry'));
	}
	
	public updateDiaryEntryCallback(viewName: string): (viewName: string) => void {
		var instance = this;
		return viewname => instance.router.navigate([viewName]);
	}
	
	public navigateToOtherView(viewName: string): void {
		this.router.navigate([viewName]);
	}
	
	public cancel(): void {
		this.navigateToOtherView('DiaryEntry');
	}
}