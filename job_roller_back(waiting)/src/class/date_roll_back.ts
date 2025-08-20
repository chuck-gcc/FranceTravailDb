export class Extract_date_roll_back
{
    dateLeft: Date;
    dateRight: Date;

    constructor()
    {
        this.dateRight = new Date();
        this.dateLeft = new Date();
        this.dateLeft.setDate(this.dateLeft.getDate() - 1);
    }
    set_new_date()
    {
        //min == to max == from
        this.dateRight.setDate(this.dateRight.getDate() - 1);
        this.dateLeft.setDate(this.dateRight.getDate() - 1);
    }
    display()
    {
        console.log("Extraion du : ",this.dateLeft.toDateString(),"au:", this.dateRight. toDateString());
    }

}