var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CutDroneBrood = (function (_super) {
    __extends(CutDroneBrood, _super);
    function CutDroneBrood(type, photos, description, date, notes) {
        _super.call(this, type, photos, description, date);
        this.notes = notes;
    }
    return CutDroneBrood;
})(DiaryEntry);
//# sourceMappingURL=CutDroneBrood.js.map