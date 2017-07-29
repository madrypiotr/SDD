![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/sdd_baner.jpg) 

Go to  [CHANGELOG] | [LICENSE] | [CONTRIBUTING] | [CODE OF CONDUCT] 

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
panel (menu) | a description of the action |
|-----------------------------|---------------------------------------------------------------|
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_issues.jpg) | Here you will get every idea, proposal, problem to solve. We call it the Issue. Here you will get every idea, proposal, problem to solve. We call it the Issue. It has many statuses On startup it is set to active as "deliberate". Issues receive priority points from users (-5 to +5). They are on the list arranged according to the values of the sum of priorities. Issues with the highest priority go to the next panel - Voting. <br /> **But priority, it's not just one condition**. Conditions are three. In addition to the priority, three more people need care for the issue (Implementation Team), and the appropriate quorum (in accordance with the organization's regulations) |
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_voting.jpg) | txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt  | 
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_exec.jpg) | txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt  |  
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_arch.jpg) | txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt  |  
| ![](https://github.com/madrypiotr/SDD/blob/master/client/stylesheets/panel_set.jpg) | txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt txt  |  

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

