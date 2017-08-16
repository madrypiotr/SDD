![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/sdd_baner.jpg) 

[The documentation of the SDD code is here] or Go to [CHANGELOG] | [LICENSE] | [CONTRIBUTING] | [CODE OF CONDUCT]

## About SDD
**This system is designed to make it possible for everyone in the community to influence it. The principle of equal access to the conclusion, reconciliation and vote of ideas, proposals and projects is equal. There will be no admin system that can arbitrarily change anything, correct parameters, add users, restrict their rights, or delete. Any individual parameters and global settings, mode or mode of operation of the System are determined only by decision of all members. This procedure applies both to the startup of the System configuration and to changes made during further use.**

---
#### THIS IS A WORKING WERSION OF THE SOFTWARE. IT CAN NOT BE PUT INTO PUBLIC SERVICE! 
---

Here's how it works today: [SDD]

Applied technologies: [METEOR], [MongoDB], [HTML5], [NodeJS], [jQuery], [Bootstrap].

## Installation
* [Install the METEOR] 
* [Download the SDD source code] 
* [The documentation of the SDD code is here] 
* Because this is a development draft, further development should be known to developers of these components.

### [How to contribute] to the development of this project?

#### Admin login (language setting only) 
* Login: adminSDD, 
* Password: (ask by m@drypiotr.pl)

---
#### The task of the application will be:
1. accept requests for new users,
2. accept User requests on various matters,
3. enable discussion of reported cases,
4. give priority to those matters in accordance with the will of the users,
5. submit the three highest rated cases to the vote,
6. handle voting,
7. transfer win the issue to the panel Realization and generating a Resolution,
8. ensure that the issue is addressed,
9. in the absence of the implementation report - alert the Users,
10. when the issue is not implemented and lack of implementation reports - throw it in the trash.

**These are the most important operations that are already implanted.
However, our application is similar to your home in the raw state.
We still have to do finishing work and usability.**

#### Important but simple - in SDD the basic objects are Issues (added by users). Then the issues pass the Deliberation / Voting / Execution path. The above listed operations will be implemented in five main panels (see illustration).
![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panels.jpg) 

#### **So ... what these panels do:**
Panel / STATUS | a description of the action |
|-----------------------------|---------------------------------------------------------------|
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_issues.jpg) **KWESTIA_STATUS.DELIBEROWANA** | Here you will get every idea, proposal, problem to solve. **We call it the Issue**. <br />It has many statuses. On startup it is set to active as "deliberate". Issues receive priority points from users (-5 to +5). They are on the list arranged according to the values of the sum of priorities. Issues with the highest priority go to the next panel - Voting. <br /> **But priority, it's not just one condition**. Conditions are three. In addition to the priority, three more people need care for the issue (Implementation Team), and the appropriate quorum (in accordance with the organization's regulations). The Issues remain here until they reach the required conditions for Voting. |
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_voting.jpg) **KWESTIA_STATUS.GLOSOWANA** | The Issues that have entered here will be voted for by the time set in the system's global parameters. At this time there is no deliberation, only vote. Hence, Issues can land in three places: <br /> **1**. in the Trash, if the Issue does not get a positive sum of the parameter, <br /> **2**. in Hibernation, if there were Issue-Option, but did not win the Voting, <br /> **3**. in Implementation (next panel), if she won the Voting. | 
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_exec.jpg) <br /> a.  **KWESTIA_STATUS.REALIZOWANA** <br /> b. **KWESTIA_STATUS.ZREALIZOWANA** | The panel Implementation is divided into two subpanels: Realized and Executed. <br /> a. **Realized.** The Issues are being implemented as long as their priority is positive. The Issue may also be thrown into the trash bin by a user decision. <br /> b. **Executed.** The Issue may be decided by the users considered completed. Then lands in this panel. |  
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_arch.jpg) <br /> a. **KWESTIA_STATUS.TRASHBIN** <br /> b. **KWESTIA_STATUS.HIBERNOWANA** | The panel Archives is divided into two subpanels: Thrash bin and Hibernating. <br /> a. **Thrash bin.** Here are the issues that were thrown out by the users decision. Also, those Issues that did not work well in the implementation, that is - their priority dropped below zero - fall into the Trash. <br /> b. **Hibernating.** In the Hibernate panel are placed specific issues. They jump right here from Deliberation. When out of many Question-Options, one of them wins the vote - the other is being put into Hibernation. It is obvious that only one of the Options can be implemented. Only if this winning issue has been withdrawn from implementation - The hibernated Issues are defrosted and return to Deliberation. |  
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_set.jpg) **KWESTIA_STATUS.ADMINISTROWANA** | This status is given to Issues whose status has not yet been assigned. For example, the issue of changing a global parameter or Personality when a new user is assumed. |  

---
![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/SDD_TIMELINE_part.jpg)
#### See all TIMELINE - [SVG](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/SDD_TIMELINE.svg)

---
Go to [CHANGELOG] | [LICENSE] | [CONTRIBUTING] | [CODE OF CONDUCT] 
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
[LICENSE]: https://github.com/madrypiotr/SDD/blob/master/LICENSE.md
[CHANGELOG]: https://github.com/madrypiotr/SDD/blob/master/CHANGELOG.md
[CONTRIBUTING]: https://github.com/madrypiotr/SDD/blob/master/CONTRIBUTING.md
[How to contribute]: https://github.com/madrypiotr/SDD/blob/master/HOW-TO-CONTRIBUTE.md
[CODE OF CONDUCT]: https://github.com/madrypiotr/SDD/blob/master/CODE-OF-CONDUCT.md
[The documentation of the SDD code is here]: http://sdd.ha.pl/doc/README.md.html
