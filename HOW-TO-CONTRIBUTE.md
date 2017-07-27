![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/sdd_baner.jpg) 

Go to [README] | [CHANGELOG] | [LICENSE] | [CONTRIBUTING] | [CODE OF CONDUCT] 

### It is great to see you here! If you want to help, you may wish to review our plans below.
##### We are very glad that you are here! Because time is precious to everyone - we explain briefly and specifically.
---
### This application ...
| will be a tool | will not be a tool |
|-------------------------------------------|-------------------------------------------|
|  |  |
| built on the platform MeteorJS + MongoDB | that powers PHP + SQL |
| entirely managed by all Users. Also global settings of the system. | in which an organizational administrator interferes. He will not be there at all. |
| for managing democratic organizations. | for managing hierarchical organizations. |
|  |  |

### Code of this app ...
* it is in the final phase of documentation development,
* there are no implemented tests ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/help-wanted.jpg) 
* Other needs - see [Issues]

### The Issue starts its life (template)
```HTML
<template name = "discussionMain">
    <input type = "hidden" value = "{{raporty}}" id="reportsIds"/>
    <div class="row">
        <input id="status" name="status" type="hidden" value="{{status}}">
        <div class="col-xs-12">
            {{#each getPosts _id}}
            {{> discussionPostItem
            wiadomosc = wiadomosc
            uzasadnienie = uzasadnienie
            idUser = idUser
            userFullName = userFullName
            addDate = addDate
            idKwestia = idKwestia
            idRaport = idRaport
            idPost = _id
            wartoscPriorytetu = wartoscPriorytetu
            }}
            {{/each}}
        </div>
    </div>
    {{> discussionPostForm
    status = status
    idKwestia = _id
    czyAktywny = czyAktywny
    }}
</template>
```
#### Example of help from JS ...
```javascript

Template.discussionMain.helpers({
	'getPosts': function(id) {
		return Posts.find({
			idKwestia: id,
			isParent: true
		}, {
			sort: {
				wartoscPriorytetu: -1
			}
		});
	}
});

Template.discussionPostForm.helpers({
	HasUserRights: function(status, czyAktywny) {
		if (!Meteor.userId()) return false;
		 return status == KWESTIA_STATUS.GLOSOWANA
				|| status == KWESTIA_STATUS.ZREALIZOWANA
				|| status == KWESTIA_STATUS.OCZEKUJACA
				|| czyAktywny == false ? false : true;
	}
});

```

### TIMETABLE

| Stage | Plan | Implementation | Comments |
|------------------|-----------------|-----------------|--------------------------------|
| Working out a concept | 08.04.2013 -  | 08.04.2013 - 08.XI.2013 | Work of the Initiative Group. Completed by the decision to set up Task Team for the project |
| Design work | 09.11.2013 - 02.03.2015 | 09.11.2013 - 02.03.2015 | ZK DB Resolution No 8/11/2013, appointment of Task Team. 26 meetings of the Task Team - Finalization. |
| Competition for best offer | 03.03.2015 - 24.04.2015 | 03.03.2015 - 24.04.2015 | Announcing the start and end of the SSD Production Contest |
| Settlement of the Contest | 25.04.2015 - 30.04.2015 | 25.04.2015 - 30.04.2015 | Appointing the Competition Jury and choosing the best competition entry (OneBI) |
| Contract with the Contractor | 02.05.2015 - 15.05.2015 | 02.05.2015 - 15.05.2015 | Preparation and signing of the contract with the Contractor |
| Production | 15.05.2015 - 31.10.2015 | 15.05.2015 - 14.01.2016 | Programming (OneBI), project management (Piotr Mądry) |
| Reception | 21.12.2015 | 14.01.2016 | We only received the source code. Failure to comply with other provisions of the contract and lack of documentation that was guaranteed by the contract. |
| Implementation of | 22.12.2015 - | - | Impossible. Schedule correction |
| Continuation of production | 22.12.2015 - 21.12.2019 |  -  | We do volunteer programmers amateurs + count on help professionals from Java Script |
| Implementation of | 22.12.2019 | - | - |

---

#### Project participant [CODE OF CONDUCT] - our Pledge and Standards.

---

![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/SDD_TIMELINE_part.jpg)
### See all TIMELINE - [SVG](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/SDD_TIMELINE.svg)

---
Go to [README] | [CHANGELOG] | [LICENSE] | [CONTRIBUTING] 
---
###### (c) 2013-2017, PM & Partners. All rights reserved.

[SDD]: http://sdd.ha.pl
[SDD GitHub issue page]: https://github.com/madrypiotr/SDD/issues
[Download the SDD source code]: https://github.com/madrypiotr/SDD
[Install the METEOR]: https://www.meteor.com/install
[METEOR]: https://github.com/meteor/meteor
[MongoDB]: https://github.com/mongodb
[NodeJS]: https://github.com/nodejs/node/blob/master/LICENSE
[HTML5]: https://www.w3.org/2011/03/html-license-options.html
[jQuery]: https://github.com/jquery/jquery/blob/master/LICENSE.txt
[Bootstrap]: https://github.com/twbs/bootstrap
[README]: https://github.com/madrypiotr/SDD/blob/master/README.md
[LICENSE]: https://github.com/madrypiotr/SDD/blob/master/LICENSE.md
[CHANGELOG]: https://github.com/madrypiotr/SDD/blob/master/CHANGELOG.md
[CONTRIBUTING]: https://github.com/madrypiotr/SDD/blob/master/CONTRIBUTING.md
[How to contribute]: https://github.com/madrypiotr/SDD/blob/master/README.md
[WanWeb]: http://ha.pl/#contact
[OneBI]: http://www.onebi.eu
[CODE OF CONDUCT]: https://github.com/madrypiotr/SDD/blob/master/CODE-OF-CONDUCT.md
[Issues]: https://github.com/madrypiotr/SDD/issues