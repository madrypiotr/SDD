Template.informacjeRaport.helpers({
   dataUtworzenia:function(){
       return moment(this.dataUtworzenia).format("DD-MM-YYYY, HH:mm");
   },
    kwestiaNazwa:function(){
        var issue=Kwestia.findOne({_id:this.idKwestia});
        return issue ? issue.kwestiaNazwa : "";
    },
    issueReport:function(){
        var issue=Kwestia.findOne({_id:this.idKwestia});
        return issue? issue : null;
    }
});