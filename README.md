# Student-Tracker

This Project is made with **nodejs** and **MongoDB** databases. This project is basically a Student Tacker system. There is an option to give the name of the student. It will **automatically scarp** from those websites(Codeforces, Codechef,hackerrank, uva) and collect data. Also in this API you can **create a Group of users** and check their difference. You can make friends. In this project, you can find a realtime **Online Contest Schedule.**



***Before Go Down, You can watch the project view from youtube***

[![Watch the video for details of project view ](https://github.com/Foysal87/S-Tracker/blob/master/S%20tracker.png)](https://www.youtube.com/watch?v=8A6aslMhKXc&t=19s)




## Basic Thing You should know for understanding code

- Javascript
- mongodb
- express
- express authentication system
- Html5 and css
- scraping with nodejs




## Installation

Need this things for run and edit code.

- Visual Studio Code ( **IDE** ). You can download from [Here](https://code.visualstudio.com/docs/setup/linux)
- node (version: **v13.14.0**) . Download it from [Here](https://nodejs.org/en/download/).
- npm **6.14.4** . In node Installation you can find npm installation.
- mongodb

For Better result and not getting any error. **Reinstall all dependencies** by pasting below code.

```
npm install -g

```
It will download **all dependencies** again. **It may be take much time!**

## Project Start

Before project start, you must create a  database with name **testdb**in mongodb and connect with node.
For Creating fully new project and database, you can use

```

npm init

```
And follow the instructions.

**For starting the server** go to the server.js file path. And open terminal.

```
cd S-Tracker
node .

```

or

```
node server.js

```

If there is already a running process in 3000 port. Then kill the port.

```
fuser -n tcp -k 3000 

```
Here you can see the project.


## Problem

- Taking lots of time for first starting scrap. If server is already in process, it won't take much time.
- Don't add realtime update for user. cause it slow down process. You can add it just call from **update info**.
- don't add realtime contest schedule update. You can add it by calling **loadcon()** function when Contest schedule file loaded.
- no design in home and about page.
- You can't update picture. But you can update it by change user database.
- **Not testing corner case.**

### Thank you
