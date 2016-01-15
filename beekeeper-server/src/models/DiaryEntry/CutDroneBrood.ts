import DiaryEntryImport = require('./DiaryEntry');
var DiaryEntry = DiaryEntryImport.DiaryEntry;

export class CutDroneBrood extends DiaryEntry {
    notes: string;
    
    constructor(type, photos, description, date, notes) {
       super(type, photos, description, date);
       this.notes = notes;
    }
}